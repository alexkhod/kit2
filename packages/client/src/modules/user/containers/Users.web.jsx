import React from 'react';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { compose } from 'react-apollo';

import settings from '../../../../../../settings';
import translate from '../../../i18n';
import { Button, PageLayoutN } from '../../common/components/web';
import Loading from '../components/Loading';
import withSubscription from './withSubscription';
import {
  withFilterUpdating,
  withOrderByUpdating,
  withUsers,
  withUsersDeleting,
  withUsersState,
  updateUsersState
} from './UserOperations';

const AsyncUsersFilterView = Loadable({
  loader: () => import('../components/UsersFilterView'),
  loading: Loading,
  delay: 300
});

const AsyncUsersListView = Loadable({
  loader: () => import('../components/UsersListView'),
  loading: Loading,
  delay: 300
});

class Users extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const { usersUpdated, updateQuery } = this.props;
    if (usersUpdated) {
      updateUsersState(usersUpdated, updateQuery);
    }
  }

  renderMetaData() {
    return (
      <Helmet
        title={`${this.props.t('users.title')}`} // title={`${settings.app.name} - ${this.props.t('users.title')}`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${this.props.t('users.meta')}`
          }
        ]}
      />
    );
  }

  render() {
    return (
      <PageLayoutN>
        {this.renderMetaData()}
        <h2>{this.props.t('users.list.title')}</h2>
        <Link to="/users/new">
          <Button color="primary">{this.props.t('users.btn.add')}</Button>
        </Link>
        <hr />
        <AsyncUsersFilterView {...this.props} />
        <hr />
        <AsyncUsersListView {...this.props} />
      </PageLayoutN>
    );
  }
}

Users.propTypes = {
  usersUpdated: PropTypes.object,
  updateQuery: PropTypes.func,
  t: PropTypes.func
};

export default compose(
  withUsersState,
  withUsers,
  withUsersDeleting,
  withOrderByUpdating,
  withFilterUpdating,
  withSubscription
)(translate('user')(Users));
