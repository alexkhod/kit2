import React from 'react';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { PageLayoutN } from '../../common/components/web';

import Loading from './Loading';
import settings from '../../../../../../settings';
import translate from '../../../i18n';

const AsyncUserForm = Loadable({
  loader: () => import('./UserForm'),
  loading: Loading,
  delay: 300
});

class UserEditView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object,
    currentUser: PropTypes.object,
    errors: PropTypes.array,
    history: PropTypes.object,
    t: PropTypes.func,
    editUser: PropTypes.func.isRequired,
    onSubmit: PropTypes.func
  };

  state = {};

  static getDerivedStateFromProps(nextProps) {
    if (!nextProps.loading && nextProps.errors && nextProps.errors.length) {
      nextProps.history.push('/profile');
    }
    return null;
  }

  renderMetaData = t => (
    <Helmet
      title={`${t('userEdit.title')}`} // title={`${settings.app.name} - ${t('userEdit.title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${t('userEdit.meta')}`
        }
      ]}
    />
  );

  render() {
    const { loading, user, t, currentUser } = this.props;

    if (loading && !user) {
      return (
        <PageLayoutN>
          {this.renderMetaData(t)}
          <div className="text-center">{t('userEdit.loadMsg')}</div>
        </PageLayoutN>
      );
    } else {
      const isNotSelf = !user || (user && user.id !== currentUser.id);
      return (
        <PageLayoutN>
          {this.renderMetaData(t)}
          <Link id="back-button" to={user && user.role === 'admin' ? '/users' : '/profile'}>
            Back
          </Link>
          <h2>
            {t('userEdit.form.titleEdit')} {t('userEdit.form.title')}
          </h2>
          <AsyncUserForm
            onSubmit={this.props.onSubmit}
            shouldRoleDisplay={isNotSelf}
            shouldActiveDisplay={isNotSelf}
            initialValues={user}
          />
        </PageLayoutN>
      );
    }
  }
}

export default translate('user')(UserEditView);
