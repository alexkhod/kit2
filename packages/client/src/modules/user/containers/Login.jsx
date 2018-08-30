import React from 'react';
import Loadable from 'react-loadable';
import { graphql, compose, withApollo } from 'react-apollo';

import Loading from '../components/Loading';
import access from '../access';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
import LOGIN from '../graphql/Login.graphql';

const AsyncLoginView = Loadable({
  loader: () => import('../components/LoginView'),
  loading: Loading,
  delay: 300
});

class Login extends React.Component {
  render() {
    return <AsyncLoginView {...this.props} />;
  }
}

const LoginWithApollo = compose(
  withApollo,
  graphql(LOGIN, {
    props: ({ ownProps: { client, onLogin }, mutate }) => ({
      login: async ({ usernameOrEmail, password }) => {
        const {
          data: { login }
        } = await mutate({
          variables: { input: { usernameOrEmail, password } }
        });
        if (!login.errors) {
          await access.doLogin(client);
          await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: login.user } });
          if (onLogin) {
            onLogin();
          }
        }
        return login;
      }
    })
  })
)(Login);

export default LoginWithApollo;
