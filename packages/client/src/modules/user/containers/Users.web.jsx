import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { compose } from 'react-apollo';

import settings from '../../../../../../settings';
import translate from '../../../i18n';
import UsersFilterView from '../components/UsersFilterView';
import { Button, PageLayoutN } from '../../common/components/web';
import UsersListView from '../components/UsersListView';
import withSubscription from './withSubscription';
import {
  withFilterUpdating,
  withOrderByUpdating,
  withUsers,
  withUsersDeleting,
  withUsersState,
  updateUsersState
} from './UserOperations';

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
        <UsersFilterView {...this.props} />
        <hr />
        <UsersListView {...this.props} />
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
