import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import ZverBlocksView from '../components/ZverBlocksView';

import ADD_BLOCK from '../graphql/AddBlockOnZver.graphql';
import EDIT_BLOCK from '../graphql/EditBlock.graphql';
import DELETE_BLOCK from '../graphql/DeleteBlock.graphql';
import BLOCK_SUBSCRIPTION from '../graphql/BlockSubscription.graphql';
import ADD_BLOCK_CLIENT from '../graphql/AddBlock.client.graphql';
import BLOCK_QUERY_CLIENT from '../graphql/BlockQuery.client.graphql';

function AddBlock(prev, node) {
  // ignore if duplicate
  if (prev.zver.blocks.some(block => block.id === node.id)) {
    return prev;
  }

  const filteredBlocks = prev.zver.blocks.filter(block => block.id);
  return update(prev, {
    zver: {
      blocks: {
        $set: [...filteredBlocks, node]
      }
    }
  });
}

function DeleteBlock(prev, id) {
  const index = prev.zver.blocks.findIndex(x => x.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    zver: {
      blocks: {
        $splice: [[index, 1]]
      }
    }
  });
}

class ZverBlocks extends React.Component {
  static propTypes = {
    zverId: PropTypes.number.isRequired,
    blocks: PropTypes.array.isRequired,
    block: PropTypes.object.isRequired,
    onBlockSelect: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired,
    history: PropTypes.object,
    navigation: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidMount() {
    this.initBlockListSubscription();
  }

  componentDidUpdate(prevProps) {
    let prevZverId = prevProps.zverId || null;
    // Check if props have changed and, if necessary, stop the subscription
    if (this.subscription && this.props.zverId !== prevZverId) {
      this.subscription();
      this.subscription = null;
    }
    this.initBlockListSubscription();
  }

  componentWillUnmount() {
    this.props.onBlockSelect({ id: null, inv: '' });

    if (this.subscription) {
      // unsubscribe
      this.subscription();
      this.subscription = null;
    }
  }

  initBlockListSubscription() {
    if (!this.subscription) {
      this.subscribeToBlockList(this.props.zverId);
    }
  }

  subscribeToBlockList = zverId => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: BLOCK_SUBSCRIPTION,
      variables: { zverId },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              blockUpdated: { mutation, id, node }
            }
          }
        }
      ) => {
        let newResult = prev;

        if (mutation === 'CREATED') {
          newResult = AddBlock(prev, node);
        } else if (mutation === 'DELETED') {
          newResult = DeleteBlock(prev, id);
        }

        return newResult;
      }
    });
  };

  render() {
    return <ZverBlocksView {...this.props} />;
  }
}

const ZverBlocksWithApollo = compose(
  graphql(ADD_BLOCK, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      addBlock: async (inv, isWork = false, zverId) => {
        let blockData = await mutate({
          variables: { input: { inv, isWork, zverId } },
          optimisticResponse: {
            __typename: 'Mutation',
            addBlock: {
              __typename: 'Block',
              id: null,
              inv: inv,
              isWork: isWork,
              notes: [],
              modules: []
            }
          },
          updateQueries: {
            zver: (
              prev,
              {
                mutationResult: {
                  data: { addBlock }
                }
              }
            ) => {
              if (prev.zver) {
                return AddBlock(prev, addBlock);
              }
            }
          }
        });

        if (history) {
          return history.push('/block/' + zverId + '/' + blockData.data.addBlock.id, {
            block: blockData.data.addBlock
          });
        } else if (navigation) {
          return navigation.navigate('BlockEdit', { id: blockData.data.addBlock.id });
        }
      }
    })
  }),
  graphql(EDIT_BLOCK, {
    props: ({ ownProps: { zverId }, mutate }) => ({
      editBlock: (id, inv) =>
        mutate({
          variables: { input: { id, zverId, inv } },
          optimisticResponse: {
            __typename: 'Mutation',
            editBlock: {
              __typename: 'Block',
              id: id,
              inv: inv
            }
          }
        })
    })
  }),
  graphql(DELETE_BLOCK, {
    props: ({ ownProps: { zverId }, mutate }) => ({
      deleteBlock: id =>
        mutate({
          variables: { input: { id, zverId } },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteBlock: {
              __typename: 'Block',
              id: id
            }
          },
          updateQueries: {
            zver: (
              prev,
              {
                mutationResult: {
                  data: { deleteBlock }
                }
              }
            ) => {
              if (prev.zver) {
                return DeleteBlock(prev, deleteBlock.id);
              }
            }
          }
        })
    })
  }),
  graphql(ADD_BLOCK_CLIENT, {
    props: ({ mutate }) => ({
      onBlockSelect: block => {
        mutate({ variables: { block: block } });
      }
    })
  }),
  graphql(BLOCK_QUERY_CLIENT, {
    props: ({ data: { block } }) => ({ block })
  })
)(ZverBlocks);

export default ZverBlocksWithApollo;
