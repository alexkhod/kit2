import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import ZverEditView from '../components/ZverEditView';

import ZVER_QUERY from '../graphql/ZverQuery.graphql';
import EDIT_ZVER from '../graphql/EditZver.graphql';
import ZVER_SUBSCRIPTION from '../graphql/ZverSubscription.graphql';

class ZverEdit extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    zver: PropTypes.object,
    subscribeToMore: PropTypes.func.isRequired,
    history: PropTypes.object,
    navigation: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidMount() {
    if (!this.props.loading) {
      this.initZverEditSubscription();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.loading) {
      let prevZverId = prevProps.zver ? prevProps.zver.id : null;
      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && prevZverId !== this.props.zver.id) {
        this.subscription();
        this.subscription = null;
      }
      this.initZverEditSubscription();
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
      this.subscription = null;
    }
  }

  initZverEditSubscription() {
    if (!this.subscription && this.props.zver) {
      this.subscribeToZverEdit(this.props.zver.id);
    }
  }

  subscribeToZverEdit = zverId => {
    const { subscribeToMore, history, navigation } = this.props;

    this.subscription = subscribeToMore({
      document: ZVER_SUBSCRIPTION,
      variables: { id: zverId },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              zverUpdated: { mutation }
            }
          }
        }
      ) => {
        if (mutation === 'DELETED') {
          if (history) {
            return history.push('/zvers');
          } else if (navigation) {
            return navigation.goBack();
          }
        }
        return prev;
      }
    });
  };

  render() {
    return <ZverEditView {...this.props} />;
  }
}

export default compose(
  graphql(ZVER_QUERY, {
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
    props({ data: { loading, error, zver, subscribeToMore } }) {
      if (error) throw new Error(error);
      return { loading, zver, subscribeToMore };
    }
  }),
  graphql(EDIT_ZVER, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      editZver: async (id, inv, isWork) => {
        await mutate({
          variables: { input: { id, inv: inv.trim(), isWork: isWork } }
        });
        if (history) {
          return history.push('/zvers');
        }
        if (navigation) {
          return navigation.navigate('ZverList');
        }
      }
    })
  })
)(ZverEdit);
