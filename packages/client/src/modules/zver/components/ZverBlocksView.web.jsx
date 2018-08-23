import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router-dom';

import translate from '../../../i18n';
import { Table, Button } from '../../common/components/web';
import ZverBlockForm from './ZverBlockForm';
import { IfLoggedIn } from '../../user/containers/AuthBase';

class ZverBlocksView extends React.PureComponent {
  static propTypes = {
    zverId: PropTypes.number.isRequired,
    blocks: PropTypes.array.isRequired,
    block: PropTypes.object,
    addBlock: PropTypes.func.isRequired,
    editBlock: PropTypes.func.isRequired,
    deleteBlock: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired,
    onBlockSelect: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  handleEditBlock = (id, inv) => {
    const { onBlockSelect } = this.props;
    onBlockSelect({ id, inv });
  };

  handleDeleteBlock = id => {
    const { block, onBlockSelect, deleteBlock } = this.props;

    if (block.id === id) {
      onBlockSelect({ id: null, inv: '' });
    }

    deleteBlock(id);
  };

  onSubmit = () => values => {
    const { block, zverId, addBlock, editBlock, onBlockSelect } = this.props;

    if (block.id === null) {
      addBlock(values.inv, values.isWork, zverId);
    } else {
      editBlock(block.id, values.inv);
    }

    onBlockSelect({ id: null, inv: '' });
  };

  render() {
    const { zverId, blocks, block, t } = this.props;
    const columns = [
      {
        title: t('blocks.column.content'),
        dataIndex: 'inv',
        key: 'inv',
        render: (text, record) => (
          <Link
            className={cn({
              ['alert-warning']: !record.isWork
            })}
            to={`/block/${zverId}/${record.id}`}
          >
            {text}
          </Link>
        )
      },
      {
        title: t('blocks.column.actions'),
        key: 'actions',
        width: 120,
        render: (text, record) => (
          <IfLoggedIn role="admin">
            <div style={{ width: 120 }}>
              <Button
                color="primary"
                size="sm"
                className="delete-block"
                onClick={() => this.handleDeleteBlock(record.id)}
              >
                {t('blocks.btn.del')}
              </Button>
            </div>
          </IfLoggedIn>
        )
      }
    ];

    return (
      <div>
        <h3>{t('blocks.title')}</h3>
        <IfLoggedIn role="admin">
          <ZverBlockForm zverId={zverId} onSubmit={this.onSubmit()} initialValues={block} block={block} />
        </IfLoggedIn>
        <h1 />
        <Table dataSource={blocks} columns={columns} />
      </div>
    );
  }
}

export default translate('zver')(ZverBlocksView);
