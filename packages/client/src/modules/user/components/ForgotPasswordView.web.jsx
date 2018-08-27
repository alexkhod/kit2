import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import translate from '../../../i18n';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import { LayoutCenter } from '../../common/components';
import { PageLayoutN } from '../../common/components/web';

import settings from '../../../../../../settings';

class ForgotPasswordView extends React.Component {
  static propTypes = {
    forgotPassword: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  state = {
    sent: false
  };

  onSubmit = ({ forgotPassword, t }) => async values => {
    const result = await forgotPassword(values);
    if (result && result.errors) {
      throw result.errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: t('forgotPass.errorMsg') }
      );
    }

    this.setState({ sent: true });
  };

  render() {
    const { forgotPassword, t } = this.props;

    const renderMetaData = () => (
      <Helmet
        title={`${t('forgotPass.title')}`} // title={`${settings.app.name} - ${t('forgotPass.title')}`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${t('forgotPass.meta')}`
          }
        ]}
      />
    );

    return (
      <PageLayoutN>
        {renderMetaData()}
        <LayoutCenter>
          <h1 className="text-center">{t('forgotPass.form.title')}</h1>
          <ForgotPasswordForm onSubmit={this.onSubmit({ forgotPassword, t })} sent={this.state.sent} />
        </LayoutCenter>
      </PageLayoutN>
    );
  }
}

export default translate('user')(ForgotPasswordView);
