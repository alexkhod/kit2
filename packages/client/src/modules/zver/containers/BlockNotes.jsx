import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import BlockNotesView from '../components/BlockNotesView';

import ADD_NOTE_ON_BLOCK from '../graphql/AddNoteOnBlock.graphql';
import EDIT_NOTE from '../graphql/EditNote.graphql';
import DELETE_NOTE from '../graphql/DeleteNote.graphql';
import NOTE_SUBSCRIPTION_ON_BLOCK from '../graphql/NoteSubscriptionOnBlock.graphql';
import ADD_NOTE_CLIENT from '../graphql/AddNote.client.graphql';
import NOTE_QUERY_CLIENT from '../graphql/NoteQuery.client.graphql';

function AddNote(prev, node) {
  // ignore if duplicate
  if (prev.block.notes.some(note => note.id === node.id)) {
    return prev;
  }

  const filteredNotes = prev.block.notes.filter(note => note.id);
  return update(prev, {
    block: {
      notes: {
        $set: [...filteredNotes, node]
      }
    }
  });
}

function DeleteNote(prev, id) {
  const index = prev.block.notes.findIndex(x => x.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    block: {
      notes: {
        $splice: [[index, 1]]
      }
    }
  });
}

class BlockNotes extends React.Component {
  static propTypes = {
    blockId: PropTypes.number.isRequired,
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
    let prevBlockId = prevProps.blockId || null;
    // Check if props have changed and, if necessary, stop the subscription
    if (this.subscription && this.props.blockId !== prevBlockId) {
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
      this.subscribeToNoteList(this.props.blockId);
    }
  }

  subscribeToNoteList = blockId => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: NOTE_SUBSCRIPTION_ON_BLOCK,
      variables: { blockId },
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
    return <BlockNotesView {...this.props} />;
  }
}

const BlockNotesWithApollo = compose(
  graphql(ADD_NOTE_ON_BLOCK, {
    props: ({ mutate }) => ({
      addNote: (content, blockId, updated_at = '', user_id = '') =>
        mutate({
          variables: { input: { content, blockId, updated_at, user_id } },
          optimisticResponse: {
            __typename: 'Mutation',
            addNoteOnBlock: {
              __typename: 'Note',
              id: null,
              content: content,
              updated_at: updated_at,
              user_id: user_id
            }
          },
          updateQueries: {
            block: (
              prev,
              {
                mutationResult: {
                  data: { addNoteOnBlock }
                }
              }
            ) => {
              if (prev.block) {
                return AddNote(prev, addNoteOnBlock);
              }
            }
          }
        })
    })
  }),
  graphql(EDIT_NOTE, {
    props: ({ ownProps: { blockId }, mutate }) => ({
      editNote: (id, content, updated_at = '', user_id = '') =>
        mutate({
          variables: { input: { id, blockId, content, updated_at, user_id } },
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
    props: ({ ownProps: { blockId }, mutate }) => ({
      deleteNote: id =>
        mutate({
          variables: { input: { id, blockId } },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteNote: {
              __typename: 'Note',
              id: id
            }
          },
          updateQueries: {
            block: (
              prev,
              {
                mutationResult: {
                  data: { deleteNote }
                }
              }
            ) => {
              if (prev.block) {
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
)(BlockNotes);

export default BlockNotesWithApollo;
