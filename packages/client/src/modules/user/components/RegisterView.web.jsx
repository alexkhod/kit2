import React from 'react';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import translate from '../../../i18n';
import Loading from './Loading';
import { LayoutCenter } from '../../common/components';
import { PageLayoutN } from '../../common/components/web';

import settings from '../../../../../../settings';

const AsyncRegisterForm = Loadable({
  loader: () => import('../components/RegisterForm'),
  loading: Loading,
  delay: 300
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
        { _error: t('reg.errorMsg') }
      );
    }
  };

  renderMetaData = t => (
    <Helmet
      title={`${t('reg.title')}`} // title={`${settings.app.name} - ${t('reg.title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${t('reg.meta')}`
        }
      ]}
    />
  );

  render() {
    const { t } = this.props;
    return (
      <PageLayoutN>
        {this.renderMetaData(t)}
        <LayoutCenter>
          <h1 className="text-center">{t('reg.form.title')}</h1>
          <AsyncRegisterForm onSubmit={this.onSubmit} />
        </LayoutCenter>
      </PageLayoutN>
    );
  }
}

export default translate('user')(RegisterView);
