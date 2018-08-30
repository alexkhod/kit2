// React
import React from 'react';
import Loadable from 'react-loadable';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import Loading from '../components/Loading';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';

const AsyncProfileView = Loadable({
  loader: () => import('../components/ProfileView'),
  loading: Loading,
  delay: 300
});

class Profile extends React.Component {
  render() {
    return <AsyncProfileView {...this.props} />;
  }
}

export default compose(
  graphql(CURRENT_USER_QUERY, {
    props({ data: { loading, error, currentUser } }) {
      if (error) throw new Error(error);
      return { loading, currentUser };
    }
  })
)(Profile);
