// React
import React from 'react';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import RegisterView from '../components/RegisterView';

import REGISTER from '../graphql/Register.graphql';

import settings from '../../../../../../settings';

class Register extends React.Component {
  render() {
    return <RegisterView {...this.props} />;
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
