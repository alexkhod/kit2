import React from 'react';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import translate from '../../../i18n';
import { LayoutCenter } from '../../common/components';
import { PageLayoutN } from '../../common/components/web'; //import { PageLayoutN, Card, CardGroup, CardTitle, CardText } from '../../common/components/web';

import Loading from './Loading';
import settings from '../../../../../../settings';

const AsyncLoginForm = Loadable({
  loader: () => import('./LoginForm'),
  loading: Loading,
  delay: 300
});

class LoginView extends React.PureComponent {
  static propTypes = {
    error: PropTypes.string,
    login: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  onSubmit = login => async values => {
    const res = await login(values);
    const { errors } = res;
    const { t } = this.props;

    if (errors && errors.length) {
      throw errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: t('login.errorMsg') }
      );
    }
  };

  render() {
    const { login, t } = this.props;

    const renderMetaData = () => (
      <Helmet
        title={`${t('login.title')}`} // title={`${settings.app.name} - ${t('login.title')}`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${t('login.meta')}`
          }
        ]}
      />
    );

    return (
      <PageLayoutN>
        {renderMetaData()}
        <LayoutCenter>
          <h1 className="text-center">{t('login.form.title')}</h1>
          <AsyncLoginForm onSubmit={this.onSubmit(login)} />
        </LayoutCenter>
      </PageLayoutN>
    );
  }
}

export default translate('user')(LoginView);
