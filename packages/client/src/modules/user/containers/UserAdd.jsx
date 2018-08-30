import React from 'react';
import Loadable from 'react-loadable';
import { compose, graphql } from 'react-apollo';
// import { pick } from 'lodash';
import pick from 'lodash/pick';

import Loading from '../components/Loading';
import ADD_USER from '../graphql/AddUser.graphql';
import settings from '../../../../../../settings';
import UserFormatter from '../helpers/UserFormatter';

const AsyncUserAddView = Loadable({
  loader: () => import('../components/UserAddView'),
  loading: Loading,
  delay: 300
});

class UserAdd extends React.Component {
  constructor(props) {
    super(props);
  }

  onSubmit = async values => {
    const { addUser, t } = this.props;

    let userValues = pick(values, ['username', 'email', 'role', 'isActive', 'password']);

    userValues['profile'] = pick(values.profile, ['firstName', 'lastName']);

    userValues = UserFormatter.trimExtraSpaces(userValues);

    if (settings.user.auth.certificate.enabled) {
      userValues['auth'] = { certificate: pick(values.auth.certificate, 'serial') };
    }

    const result = await addUser(userValues);

    if (result && result.errors) {
      throw result.errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: t('userEdit.errorMsg') }
      );
    }
  };

  render() {
    return <AsyncUserAddView onSubmit={this.onSubmit} {...this.props} />;
  }
}

export default compose(
  graphql(ADD_USER, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      addUser: async input => {
        try {
          const {
            data: { addUser }
          } = await mutate({
            variables: { input }
          });

          if (addUser.errors) {
            return { errors: addUser.errors };
          }

          if (history) {
            return history.push('/users/');
          }
          if (navigation) {
            return navigation.goBack();
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(UserAdd);
