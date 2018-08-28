import React from 'react';
import Loadable from 'react-loadable';
import path from 'path';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

// import RegisterForm from '../components/RegisterForm';
import Loading from './Loading';
import translate from '../../../i18n';

const AsyncRegisterForm = Loadable({
  loader: () => import(/* webpackChunkName: "RegisterForm" */ '../components/RegisterForm'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, '../components/RegisterForm')
});

class RegisterView extends React.PureComponent {
  static propTypes = {
    register: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  onSubmit = async values => {
    const { register, t } = this.props;
    const { errors } = await register(values);

    if (errors && errors.length) {
      throw errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: t('reg.form.title') }
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <AsyncRegisterForm onSubmit={this.onSubmit} />
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

export default translate('user')(RegisterView);
