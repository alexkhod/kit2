import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { PageLayoutN, Table, Button, Pagination } from '../../common/components/web';
import translate from '../../../i18n';
import settings from '../../../../../../settings';
import paginationConfig from '../../../../../../config/pagination';
import { IfLoggedIn } from '../../user/containers/AuthBase';

const { itemsNumber, type } = paginationConfig.web;

class ZverList extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    zvers: PropTypes.object,
    deleteZver: PropTypes.func.isRequired,
    loadData: PropTypes.func,
    t: PropTypes.func
  };

  handleDeleteZver = id => {
    const { deleteZver } = this.props;
    deleteZver(id);
  };

  renderMetaData = () => {
    const { t } = this.props;
    return (
      <Helmet
        title={t('list.title')} // title={`${settings.app.name} - ${t('list.title')}`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${t('list.meta')}`
          }
        ]}
      />
    );
  };

  handlePageChange = (pagination, pageNumber) => {
    const {
      zvers: {
        pageInfo: { endCursor }
      },
      loadData
    } = this.props;
    if (pagination === 'relay') {
      loadData(endCursor + 1, 'add');
    } else {
      loadData((pageNumber - 1) * itemsNumber, 'replace');
    }
  };

  render() {
    const { loading, zvers, t } = this.props;
    if (loading && !zvers) {
      return (
        <PageLayoutN>
          {this.renderMetaData()}
          <div className="text-center">{t('zver.loadMsg')}</div>
        </PageLayoutN>
      );
    } else {
      const columns = [
        {
          title: t('list.column.title'),
          dataIndex: 'inv',
          key: 'inv',
          render: (text, record) => (
            <Link
              className={cn({
                ['alert-warning']: !record.isWork
              })}
              to={`/zver/${record.id}`}
            >
              {text}
            </Link>
          )
        },
        {
          title: t('list.column.actions'),
          key: 'actions',
          width: 50,
          render: (text, record) => (
            <IfLoggedIn role="admin">
              <Button
                color="primary"
                size="sm"
                className="delete-button"
                onClick={() => this.handleDeleteZver(record.id)}
              >
                {t('zver.btn.del')}
              </Button>
            </IfLoggedIn>
          )
        }
      ];
      return (
        <PageLayoutN>
          {this.renderMetaData()}
          <h2>{t('list.subTitle')}</h2>
          <IfLoggedIn role="admin">
            <Link to="/zver/new">
              <Button color="primary">{t('list.btn.add')}</Button>
            </Link>
          </IfLoggedIn>
          <h1 />
          <Table dataSource={zvers.edges.map(({ node }) => node)} columns={columns} />
          <Pagination
            itemsPerPage={zvers.edges.length}
            handlePageChange={this.handlePageChange}
            hasNextPage={zvers.pageInfo.hasNextPage}
            pagination={type}
            total={zvers.totalCount}
            loadMoreText={t('list.btn.more')}
            defaultPageSize={itemsNumber}
          />
        </PageLayoutN>
      );
    }
  }
}

export default translate('zver')(ZverList);
