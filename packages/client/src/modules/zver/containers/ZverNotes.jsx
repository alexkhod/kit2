import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import ZverNotesView from '../components/ZverNotesView';

import ADD_NOTE_ON_ZVER from '../graphql/AddNoteOnZver.graphql';
import EDIT_NOTE from '../graphql/EditNote.graphql';
import DELETE_NOTE from '../graphql/DeleteNote.graphql';
import NOTE_SUBSCRIPTION from '../graphql/NoteSubscription.graphql';
import ADD_NOTE_CLIENT from '../graphql/AddNote.client.graphql';
import NOTE_QUERY_CLIENT from '../graphql/NoteQuery.client.graphql';

function AddNote(prev, node) {
  // ignore if duplicate
  if (prev.zver.notes.some(note => note.id === node.id)) {
    return prev;
  }

  const filteredNotes = prev.zver.notes.filter(note => note.id);
  return update(prev, {
    zver: {
      notes: {
        $set: [...filteredNotes, node]
      }
    }
  });
}

function DeleteNote(prev, id) {
  const index = prev.zver.notes.findIndex(x => x.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    zver: {
      notes: {
        $splice: [[index, 1]]
      }
    }
  });
}

class ZverNotes extends React.Component {
  static propTypes = {
    zverId: PropTypes.number.isRequired,
    notes: PropTypes.array.isRequired,
    note: PropTypes.object.isRequired,
    onNoteSelect: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidMount() {
    this.initNoteListSubscription();
  }

  componentDidUpdate(prevProps) {
    let prevZverId = prevProps.zverId || null;
    // Check if props have changed and, if necessary, stop the subscription
    if (this.subscription && this.props.zverId !== prevZverId) {
      this.subscription();
      this.subscription = null;
    }
    this.initNoteListSubscription();
  }

  componentWillUnmount() {
    this.props.onNoteSelect({ id: null, content: '', updated_at: '', user_id: '' });

    if (this.subscription) {
      // unsubscribe
      this.subscription();
      this.subscription = null;
    }
  }

  initNoteListSubscription() {
    if (!this.subscription) {
      this.subscribeToNoteList(this.props.zverId);
    }
  }

  subscribeToNoteList = zverId => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: NOTE_SUBSCRIPTION,
      variables: { zverId },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              noteUpdated: { mutation, id, node }
            }
          }
        }
      ) => {
        let newResult = prev;

        if (mutation === 'CREATED') {
          newResult = AddNote(prev, node);
        } else if (mutation === 'DELETED') {
          newResult = DeleteNote(prev, id);
        }

        return newResult;
      }
    });
  };

  render() {
    //console.log(note);
    return <ZverNotesView {...this.props} />;
  }
}

const ZverNotesWithApollo = compose(
  graphql(ADD_NOTE_ON_ZVER, {
    props: ({ mutate }) => ({
      addNote: (content, zverId, updated_at = '', user_id = '') =>
        mutate({
          variables: { input: { content, zverId, updated_at, user_id } },
          optimisticResponse: {
            __typename: 'Mutation',
            addNoteOnZver: {
              __typename: 'Note',
              id: null,
              content: content,
              updated_at: updated_at,
              user_id: user_id
            }
          },
          updateQueries: {
            zver: (
              prev,
              {
                mutationResult: {
                  data: { addNoteOnZver }
                }
              }
            ) => {
              if (prev.zver) {
                return AddNote(prev, addNoteOnZver);
              }
            }
          }
        })
    })
  }),
  graphql(EDIT_NOTE, {
    props: ({ ownProps: { zverId }, mutate }) => ({
      editNote: (id, content, updated_at = '', user_id = '') =>
        mutate({
          variables: { input: { id, zverId, content, updated_at, user_id } },
          optimisticResponse: {
            __typename: 'Mutation',
            editNote: {
              __typename: 'Note',
              id: id,
              content: content,
              updated_at: updated_at,
              user_id: user_id
            }
          }
        })
    })
  }),
  graphql(DELETE_NOTE, {
    props: ({ ownProps: { zverId }, mutate }) => ({
      deleteNote: id =>
        mutate({
          variables: { input: { id, zverId } },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteNote: {
              __typename: 'Note',
              id: id
            }
          },
          updateQueries: {
            zver: (
              prev,
              {
                mutationResult: {
                  data: { deleteNote }
                }
              }
            ) => {
              if (prev.zver) {
                return DeleteNote(prev, deleteNote.id);
              }
            }
          }
        })
    })
  }),
  graphql(ADD_NOTE_CLIENT, {
    props: ({ mutate }) => ({
      onNoteSelect: note => {
        mutate({ variables: { note: note } });
      }
    })
  }),
  graphql(NOTE_QUERY_CLIENT, {
    props: ({ data: { note } }) => ({ note })
  })
)(ZverNotes);

export default ZverNotesWithApollo;
