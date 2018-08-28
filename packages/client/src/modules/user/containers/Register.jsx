// React
import React from 'react';
import Loadable from 'react-loadable';
import path from 'path';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
// import RegisterView from '../components/RegisterView';
import Loading from '../components/Loading';

import REGISTER from '../graphql/Register.graphql';

import settings from '../../../../../../settings';

const AsyncRegisterView = Loadable({
  loader: () => import(/* webpackChunkName: "RegisterView" */ '../components/RegisterView'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, '../components/RegisterView')
});

class Register extends React.Component {
  render() {
    return <AsyncRegisterView {...this.props} />;
  }
}

const RegisterWithApollo = compose(
  graphql(REGISTER, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      register: async ({ username, email, password, c }) => {
        try {
          const {
            data: { register }
          } = await mutate({
            variables: { input: { username, email, password, c } }
          });

          if (register.errors) {
            return { errors: register.errors };
          } else if (history) {
            if (settings.subscription.enabled) {
              history.push('/subscription');
            } else {
              history.push('/profile');
            }
          } else if (navigation) {
            navigation.goBack();
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(Register);

export default RegisterWithApollo;
