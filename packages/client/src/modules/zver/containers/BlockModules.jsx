import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import BlockModulesView from '../components/BlockModulesView';

import ADD_MODULE from '../graphql/AddModuleOnBlock.graphql';
import EDIT_MODULE from '../graphql/EditModule.graphql';
import DELETE_MODULE from '../graphql/DeleteModule.graphql';
import MODULE_SUBSCRIPTION from '../graphql/ModuleSubscription.graphql';
import ADD_MODULE_CLIENT from '../graphql/AddModule.client.graphql';
import MODULE_QUERY_CLIENT from '../graphql/ModuleQuery.client.graphql';

function AddModule(prev, node) {
  // ignore if duplicate
  if (prev.block.modules.some(module => module.id === node.id)) {
    return prev;
  }

  const filteredModules = prev.block.modules.filter(module => module.id);
  return update(prev, {
    block: {
      modules: {
        $set: [...filteredModules, node]
      }
    }
  });
}

function DeleteModule(prev, id) {
  const index = prev.block.modules.findIndex(x => x.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    block: {
      modules: {
        $splice: [[index, 1]]
      }
    }
  });
}

class BlockModules extends React.Component {
  static propTypes = {
    zverId: PropTypes.number.isRequired,
    blockId: PropTypes.number.isRequired,
    modules: PropTypes.array.isRequired,
    module: PropTypes.object.isRequired,
    onModuleSelect: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired,
    history: PropTypes.object,
    navigation: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidMount() {
    this.initModuleListSubscription();
  }

  componentDidUpdate(prevProps) {
    let prevBlockId = prevProps.blockId || null;
    // Check if props have changed and, if necessary, stop the subscription
    if (this.subscription && this.props.blockId !== prevBlockId) {
      this.subscription();
      this.subscription = null;
    }
    this.initModuleListSubscription();
  }

  componentWillUnmount() {
    this.props.onModuleSelect({ id: null, inv: '' });

    if (this.subscription) {
      // unsubscribe
      this.subscription();
      this.subscription = null;
    }
  }

  initModuleListSubscription() {
    if (!this.subscription) {
      this.subscribeToModuleList(this.props.blockId);
    }
  }

  subscribeToModuleList = blockId => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: MODULE_SUBSCRIPTION,
      variables: { blockId },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              moduleUpdated: { mutation, id, node }
            }
          }
        }
      ) => {
        let newResult = prev;

        if (mutation === 'CREATED') {
          newResult = AddModule(prev, node);
        } else if (mutation === 'DELETED') {
          newResult = DeleteModule(prev, id);
        }

        return newResult;
      }
    });
  };

  render() {
    return <BlockModulesView {...this.props} />;
  }
}

const BlockModulesWithApollo = compose(
  graphql(ADD_MODULE, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      addModule: async (inv, isWork = false, blockId, zverId) => {
        let moduleData = await mutate({
          variables: { input: { inv, isWork, blockId, zverId } },
          optimisticResponse: {
            __typename: 'Mutation',
            addModule: {
              __typename: 'Module',
              id: null,
              inv: inv,
              isWork: isWork,
              notes: []
            }
          },
          updateQueries: {
            block: (
              prev,
              {
                mutationResult: {
                  data: { addModule }
                }
              }
            ) => {
              if (prev.block) {
                return AddModule(prev, addModule);
              }
            }
          }
        });

        if (history) {
          return history.push('/module/' + zverId + '/' + blockId + '/' + moduleData.data.addModule.id, {
            module: moduleData.data.addModule
          });
        } else if (navigation) {
          return navigation.navigate('ModuleEdit', { id: moduleData.data.addModule.id });
        }
      }
    })
  }),
  graphql(EDIT_MODULE, {
    props: ({ ownProps: { blockId }, mutate }) => ({
      editModule: (id, inv) =>
        mutate({
          variables: { input: { id, blockId, inv } },
          optimisticResponse: {
            __typename: 'Mutation',
            editModule: {
              __typename: 'Module',
              id: id,
              inv: inv
            }
          }
        })
    })
  }),
  graphql(DELETE_MODULE, {
    props: ({ ownProps: { blockId }, mutate }) => ({
      deleteModule: id =>
        mutate({
          variables: { input: { id, blockId } },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteModule: {
              __typename: 'Module',
              id: id
            }
          },
          updateQueries: {
            block: (
              prev,
              {
                mutationResult: {
                  data: { deleteModule }
                }
              }
            ) => {
              if (prev.block) {
                return DeleteModule(prev, deleteModule.id);
              }
            }
          }
        })
    })
  }),
  graphql(ADD_MODULE_CLIENT, {
    props: ({ mutate }) => ({
      onModuleSelect: module => {
        mutate({ variables: { module: module } });
      }
    })
  }),
  graphql(MODULE_QUERY_CLIENT, {
    props: ({ data: { module } }) => ({ module })
  })
)(BlockModules);

export default BlockModulesWithApollo;
