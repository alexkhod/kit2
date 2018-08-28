// React
import React from 'react';
import Loadable from 'react-loadable';
import path from 'path';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
// import ProfileView from '../components/ProfileView';
import Loading from '../components/Loading';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';

const AsyncProfileView = Loadable({
  loader: () => import(/* webpackChunkName: "ProfileView" */ '../components/ProfileView'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, '../components/ProfileView')
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
