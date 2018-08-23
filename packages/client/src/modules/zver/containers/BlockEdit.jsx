import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import BlockEditView from '../components/BlockEditView';

import BLOCK_QUERY from '../graphql/BlockQuery.graphql';
import EDIT_BLOCK from '../graphql/EditBlock.graphql';
import BLOCK_SUBSCRIPTION from '../graphql/BlockSubscription.graphql';

class BlockEdit extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    block: PropTypes.object,
    subscribeToMore: PropTypes.func.isRequired,
    history: PropTypes.object,
    navigation: PropTypes.object,
    match: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidMount() {
    if (!this.props.loading) {
      this.initBlockEditSubscription();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.loading) {
      let prevBlockId = prevProps.block ? prevProps.block.id : null;
      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && prevBlockId !== this.props.block.id) {
        this.subscription();
        this.subscription = null;
      }
      this.initBlockEditSubscription();
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
      this.subscription = null;
    }
  }

  initBlockEditSubscription() {
    if (!this.subscription && this.props.block) {
      this.subscribeToBlockEdit(this.props.block.id);
    }
  }

  subscribeToBlockEdit = zverId => {
    const { subscribeToMore, history, navigation } = this.props;

    this.subscription = subscribeToMore({
      document: BLOCK_SUBSCRIPTION,
      variables: { zverId: zverId },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              blockUpdated: { mutation }
            }
          }
        }
      ) => {
        if (mutation === 'DELETED') {
          if (history) {
            return history.push('/blocks');
          } else if (navigation) {
            return navigation.goBack();
          }
        }
        return prev;
      }
    });
  };

  render() {
    return <BlockEditView {...this.props} zverId={this.props.match.params.zid} />;
  }
}

export default compose(
  graphql(BLOCK_QUERY, {
    options: props => {
      let id = 0;
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        variables: { id }
      };
    },
    props({ data: { loading, error, block, subscribeToMore } }) {
      if (error) throw new Error(error);
      return { loading, block, subscribeToMore };
    }
  }),
  graphql(EDIT_BLOCK, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      editBlock: async (id, inv, isWork, zverId) => {
        await mutate({
          variables: { input: { id, inv: inv.trim(), isWork: isWork, zverId: zverId } }
        });
        if (history) {
          return history.push('/zver/' + zverId);
        }
        if (navigation) {
          //return navigation.navigate('ZverList');
          return console.log(2, navigation);
        }
      }
    })
  })
)(BlockEdit);
