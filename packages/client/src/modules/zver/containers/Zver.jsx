import React from 'react';

import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import ZverList from '../components/ZverList';

import ZVERS_QUERY from '../graphql/ZversQuery.graphql';
import ZVERS_SUBSCRIPTION from '../graphql/ZversSubscription.graphql';
import DELETE_ZVER from '../graphql/DeleteZver.graphql';

import paginationConfig from '../../../../../../config/pagination';
import { PLATFORM } from '../../../../../common/utils';

const limit =
  PLATFORM === 'web' || PLATFORM === 'server' ? paginationConfig.web.itemsNumber : paginationConfig.mobile.itemsNumber;

export function AddZver(prev, node) {
  // ignore if duplicate
  if (prev.zvers.edges.some(zver => node.id === zver.cursor)) {
    return prev;
  }

  const filteredZvers = prev.zvers.edges.filter(zver => zver.node.id !== null);

  const edge = {
    cursor: node.id,
    node: node,
    __typename: 'ZverEdges'
  };

  return update(prev, {
    zvers: {
      totalCount: {
        $set: prev.zvers.totalCount + 1
      },
      edges: {
        $set: [edge, ...filteredZvers]
      }
    }
  });
}

function DeleteZver(prev, id) {
  const index = prev.zvers.edges.findIndex(x => x.node.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    zvers: {
      totalCount: {
        $set: prev.zvers.totalCount - 1
      },
      edges: {
        $splice: [[index, 1]]
      }
    }
  });
}

class Zver extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    zvers: PropTypes.object,
    subscribeToMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidUpdate(prevProps) {
    if (!this.props.loading) {
      const endCursor = this.props.zvers ? this.props.zvers.pageInfo.endCursor : 0;
      const prevEndCursor = prevProps.zvers ? prevProps.zvers.pageInfo.endCursor : null;
      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && prevEndCursor !== endCursor) {
        this.subscription();
        this.subscription = null;
      }
      if (!this.subscription) {
        this.subscribeToZverList(endCursor);
      }
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
      this.subscription = null;
    }
  }

  subscribeToZverList = endCursor => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: ZVERS_SUBSCRIPTION,
      variables: { endCursor },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              zversUpdated: { mutation, node }
            }
          }
        }
      ) => {
        let newResult = prev;

        if (mutation === 'CREATED') {
          newResult = AddZver(prev, node);
        } else if (mutation === 'DELETED') {
          newResult = DeleteZver(prev, node.id);
        }

        return newResult;
      }
    });
  };

  render() {
    return <ZverList {...this.props} />;
  }
}

export default compose(
  graphql(ZVERS_QUERY, {
    options: () => {
      return {
        variables: { limit: limit, after: 0 },
        fetchPolicy: 'cache-and-network'
      };
    },
    props: ({ data }) => {
      const { loading, error, zvers, fetchMore, subscribeToMore } = data;
      const loadData = (after, dataDelivery) => {
        return fetchMore({
          variables: {
            after: after
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const totalCount = fetchMoreResult.zvers.totalCount;
            const newEdges = fetchMoreResult.zvers.edges;
            const pageInfo = fetchMoreResult.zvers.pageInfo;
            const displayedEdges = dataDelivery === 'add' ? [...previousResult.zvers.edges, ...newEdges] : newEdges;

            return {
              // By returning `cursor` here, we update the `fetchMore` function
              // to the new cursor.
              zvers: {
                totalCount,
                edges: displayedEdges,
                pageInfo,
                __typename: 'Zvers'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return { loading, zvers, subscribeToMore, loadData };
    }
  }),
  graphql(DELETE_ZVER, {
    props: ({ mutate }) => ({
      deleteZver: id => {
        mutate({
          variables: { id },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteZver: {
              id: id,
              __typename: 'Zver'
            }
          },
          updateQueries: {
            zvers: (
              prev,
              {
                mutationResult: {
                  data: { deleteZver }
                }
              }
            ) => {
              return DeleteZver(prev, deleteZver.id);
            }
          }
        });
      }
    })
  })
)(Zver);
