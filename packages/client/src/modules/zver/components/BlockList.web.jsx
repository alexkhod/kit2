import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { PageLayoutN, Table, Button, Pagination } from '../../common/components/web';
import translate from '../../../i18n';
import settings from '../../../../../../settings';
import paginationConfig from '../../../../../../config/pagination';

const { itemsNumber, type } = paginationConfig.web;

class BlockList extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    blocks: PropTypes.object,
    deleteBlock: PropTypes.func.isRequired,
    loadData: PropTypes.func,
    t: PropTypes.func
  };

  handleDeleteBlock = id => {
    const { deleteBlock } = this.props;
    deleteBlock(id);
  };

  renderMetaData = () => {
    const { t } = this.props;
    return (
      <Helmet
        title={`${settings.app.name} - ${t('list.title')}`}
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
      blocks: {
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
    const { loading, blocks, t } = this.props;
    if (loading && !blocks) {
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
            <Link className="zver-link" to={`/block/${record.id}`}>
              {text}
            </Link>
          )
        },
        {
          title: t('list.column.actions'),
          key: 'actions',
          width: 50,
          render: (text, record) => (
            <Button
              color="primary"
              size="sm"
              className="delete-button"
              onClick={() => this.handleDeleteBlock(record.id)}
            >
              {t('zver.btn.del')}
            </Button>
          )
        }
      ];
      return (
        <PageLayoutN>
          {this.renderMetaData()}
          <h2>{t('list.subTitle')}</h2>
          <Link to="/block/new">
            <Button color="primary">{t('list.btn.add')}</Button>
          </Link>
          <h1 />
          <Table dataSource={blocks.edges.map(({ node }) => node)} columns={columns} />
          <Pagination
            itemsPerPage={blocks.edges.length}
            handlePageChange={this.handlePageChange}
            hasNextPage={blocks.pageInfo.hasNextPage}
            pagination={type}
            total={blocks.totalCount}
            loadMoreText={t('list.btn.more')}
            defaultPageSize={itemsNumber}
          />
        </PageLayoutN>
      );
    }
  }
}

export default translate('zver')(BlockList);
