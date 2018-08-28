import React from 'react';
import Loadable from 'react-loadable';
import path from 'path';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { PageLayoutN } from '../../common/components/web';

// import UserForm from './UserForm';
import Loading from './Loading';
import settings from '../../../../../../settings';
import translate from '../../../i18n';

const AsyncUserForm = Loadable({
  loader: () => import(/* webpackChunkName: "UserForm" */ './UserForm'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, './UserForm')
});

class UserAddView extends React.PureComponent {
  static propTypes = {
    user: PropTypes.object,
    errors: PropTypes.array,
    addUser: PropTypes.func.isRequired,
    history: PropTypes.object,
    t: PropTypes.func,
    onSubmit: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  state = {};

  static getDerivedStateFromProps(nextProps) {
    if (!nextProps.loading && nextProps.errors && nextProps.errors.length) {
      nextProps.history.push('/profile');
    }
    return null;
  }

  renderMetaData = t => (
    <Helmet
      title={`${settings.app.name} - ${t('userEdit.title')}`} // title={`${settings.app.name} - ${t('userEdit.title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${t('userEdit.meta')}`
        }
      ]}
    />
  );

  render() {
    const { t } = this.props;

    return (
      <PageLayoutN>
        {this.renderMetaData(t)}
        <Link id="back-button" to="/users">
          Back
        </Link>
        <h2>
          {t('userEdit.form.titleCreate')} {t('userEdit.form.title')}
        </h2>
        <AsyncUserForm
          onSubmit={this.props.onSubmit}
          initialValues={{}}
          shouldRoleDisplay={true}
          shouldActiveDisplay={true}
        />
      </PageLayoutN>
    );
  }
}

export default translate('user')(UserAddView);
