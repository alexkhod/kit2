import React from 'react';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import Loading from './Loading';
import translate from '../../../i18n';

const AsyncResetPasswordForm = Loadable({
  loader: () => import('../components/ResetPasswordForm'),
  loading: Loading,
  delay: 300
});

class ResetPasswordView extends React.Component {
  static propTypes = {
    resetPassword: PropTypes.func.isRequired,
    t: PropTypes.func,
    match: PropTypes.shape({
      params: PropTypes.shape({
        token: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  onSubmit = resetPassword => async values => {
    const { errors } = await resetPassword({
      ...values,
      token: this.props.match.params.token
    });

    if (errors && errors.length) {
      throw errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: this.props.t('resetPass.errorMsg') }
      );
    }
  };

  render() {
    const { resetPassword } = this.props;
    return (
      <View style={styles.container}>
        <AsyncResetPasswordForm onSubmit={this.onSubmit(resetPassword)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'stretch',
    flex: 1
  }
});

export default translate('user')(ResetPasswordView);
