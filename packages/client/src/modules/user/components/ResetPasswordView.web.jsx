import React from 'react';
import Loadable from 'react-loadable';
import path from 'path';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import translate from '../../../i18n';
// import ResetPasswordForm from '../components/ResetPasswordForm';
import Loading from './Loading';
import { PageLayoutN } from '../../common/components/web';

import settings from '../../../../../../settings';

const AsyncResetPasswordForm = Loadable({
  loader: () => import(/* webpackChunkName: "ResetPasswordForm" */ '../components/ResetPasswordForm'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, '../components/ResetPasswordForm')
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
    const { t } = this.props;

    if (errors && errors.length) {
      throw errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: t('resetPass.errorMsg') }
      );
    }
  };

  render() {
    const { resetPassword, t } = this.props;

    const renderMetaData = () => (
      <Helmet
        title={`${t('resetPass.title')}`} // title={`${settings.app.name} - ${t('resetPass.title')}`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${t('resetPass.meta')}`
          }
        ]}
      />
    );

    return (
      <PageLayoutN>
        {renderMetaData()}
        <h1>{t('resetPass.form.title')}</h1>
        <AsyncResetPasswordForm onSubmit={this.onSubmit(resetPassword)} />
      </PageLayoutN>
    );
  }
}

export default translate('user')(ResetPasswordView);
