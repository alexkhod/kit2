import React from 'react';
import Loadable from 'react-loadable';
import { graphql, compose } from 'react-apollo';

import Loading from '../components/Loading';

import FORGOT_PASSWORD from '../graphql/ForgotPassword.graphql';

const AsyncForgotPasswordView = Loadable({
  loader: () => import('../components/ForgotPasswordView'),
  loading: Loading,
  delay: 300
});

class ForgotPassword extends React.Component {
  render() {
    return <AsyncForgotPasswordView {...this.props} />;
  }
}

const ForgotPasswordWithApollo = compose(
  graphql(FORGOT_PASSWORD, {
    props: ({ mutate }) => ({
      forgotPassword: async ({ email }) => {
        try {
          const {
            data: { forgotPassword }
          } = await mutate({
            variables: { input: { email } }
          });

          if (forgotPassword.errors) {
            return { errors: forgotPassword.errors };
          }
          return forgotPassword;
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(ForgotPassword);

export default ForgotPasswordWithApollo;
