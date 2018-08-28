import React from 'react';
import Loadable from 'react-loadable';
import path from 'path';
import { graphql, compose } from 'react-apollo';

// import ResetPasswordView from '../components/ResetPasswordView';
import Loading from '../components/Loading';

import RESET_PASSWORD from '../graphql/ResetPassword.graphql';

const AsyncResetPasswordView = Loadable({
  loader: () => import(/* webpackChunkName: "ResetPasswordView" */ '../components/ResetPasswordView'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, '../components/ResetPasswordView')
});

class ResetPassword extends React.Component {
  render() {
    return <AsyncResetPasswordView {...this.props} />;
  }
}

const ResetPasswordWithApollo = compose(
  graphql(RESET_PASSWORD, {
    props: ({ ownProps: { history }, mutate }) => ({
      resetPassword: async ({ password, passwordConfirmation, token }) => {
        try {
          const {
            data: { resetPassword }
          } = await mutate({
            variables: { input: { password, passwordConfirmation, token } }
          });

          if (resetPassword.errors) {
            return { errors: resetPassword.errors };
          }

          history.push('/login');
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(ResetPassword);

export default ResetPasswordWithApollo;
