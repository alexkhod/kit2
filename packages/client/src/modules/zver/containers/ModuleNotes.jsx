import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import ModuleNotesView from '../components/ModuleNotesView';

import ADD_NOTE_ON_MODULE from '../graphql/AddNoteOnModule.graphql';
import EDIT_NOTE from '../graphql/EditNote.graphql';
import DELETE_NOTE from '../graphql/DeleteNote.graphql';
import NOTE_SUBSCRIPTION_ON_MODULE from '../graphql/NoteSubscriptionOnModule.graphql';
import ADD_NOTE_CLIENT from '../graphql/AddNote.client.graphql';
import NOTE_QUERY_CLIENT from '../graphql/NoteQuery.client.graphql';

function AddNote(prev, node) {
  // ignore if duplicate
  if (prev.module.notes.some(note => note.id === node.id)) {
    return prev;
  }

  const filteredNotes = prev.module.notes.filter(note => note.id);
  return update(prev, {
    module: {
      notes: {
        $set: [...filteredNotes, node]
      }
    }
  });
}

function DeleteNote(prev, id) {
  const index = prev.module.notes.findIndex(x => x.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    module: {
      notes: {
        $splice: [[index, 1]]
      }
    }
  });
}

class ModuleNotes extends React.Component {
  static propTypes = {
    moduleId: PropTypes.number.isRequired,
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
    let prevModuleId = prevProps.moduleId || null;
    // Check if props have changed and, if necessary, stop the subscription
    if (this.subscription && this.props.moduleId !== prevModuleId) {
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
      this.subscribeToNoteList(this.props.moduleId);
    }
  }

  subscribeToNoteList = moduleId => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: NOTE_SUBSCRIPTION_ON_MODULE,
      variables: { moduleId },
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
    return <ModuleNotesView {...this.props} />;
  }
}

const ModuleNotesWithApollo = compose(
  graphql(ADD_NOTE_ON_MODULE, {
    props: ({ mutate }) => ({
      addNote: (content, moduleId, updated_at = '', user_id = '') =>
        mutate({
          variables: { input: { content, moduleId, updated_at, user_id } },
          optimisticResponse: {
            __typename: 'Mutation',
            addNoteOnModule: {
              __typename: 'Note',
              id: null,
              content: content,
              updated_at: updated_at,
              user_id: user_id
            }
          },
          updateQueries: {
            module: (
              prev,
              {
                mutationResult: {
                  data: { addNoteOnModule }
                }
              }
            ) => {
              if (prev.module) {
                return AddNote(prev, addNoteOnModule);
              }
            }
          }
        })
    })
  }),
  graphql(EDIT_NOTE, {
    props: ({ ownProps: { moduleId }, mutate }) => ({
      editNote: (id, content, updated_at = '', user_id = '') =>
        mutate({
          variables: { input: { id, moduleId, content, updated_at, user_id } },
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
    props: ({ ownProps: { moduleId }, mutate }) => ({
      deleteNote: id =>
        mutate({
          variables: { input: { id, moduleId } },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteNote: {
              __typename: 'Note',
              id: id
            }
          },
          updateQueries: {
            module: (
              prev,
              {
                mutationResult: {
                  data: { deleteNote }
                }
              }
            ) => {
              if (prev.module) {
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
)(ModuleNotes);

export default ModuleNotesWithApollo;
