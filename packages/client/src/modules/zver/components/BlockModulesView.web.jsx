import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import translate from '../../../i18n';
import { Table, Button } from '../../common/components/web';
import BlockModuleForm from './BlockModuleForm';
import { IfLoggedIn } from '../../user/containers/AuthBase';

class BlockModulesView extends React.PureComponent {
  static propTypes = {
    zverId: PropTypes.number.isRequired,
    blockId: PropTypes.number.isRequired,
    modules: PropTypes.array.isRequired,
    module: PropTypes.object,
    addModule: PropTypes.func.isRequired,
    editModule: PropTypes.func.isRequired,
    deleteModule: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired,
    onModuleSelect: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  handleEditModule = (id, inv) => {
    const { onModuleSelect } = this.props;
    onModuleSelect({ id, inv });
  };

  handleDeleteModule = id => {
    const { module, onModuleSelect, deleteModule } = this.props;

    if (module.id === id) {
      onModuleSelect({ id: null, inv: '' });
    }

    deleteModule(id);
  };

  onSubmit = () => values => {
    const { module, blockId, zverId, addModule, editModule, onModuleSelect } = this.props;

    if (module.id === null) {
      addModule(values.inv, values.isWork, blockId, zverId);
    } else {
      editModule(module.id, values.inv);
    }

    onModuleSelect({ id: null, inv: '' });
  };

  render() {
    const { zverId, blockId, modules, module, t } = this.props;
    const columns = [
      {
        title: t('modules.column.content'),
        dataIndex: 'inv',
        key: 'inv',
        render: (text, record) => (
          <Link
            className={cn({
              ['alert-warning']: !record.isWork
            })}
            to={`/module/${zverId}/${blockId}/${record.id}`}
          >
            {text}
          </Link>
        )
      },
      {
        title: t('modules.column.actions'),
        key: 'actions',
        width: 120,
        render: (text, record) => (
          <IfLoggedIn role="admin">
            <div style={{ width: 120 }}>
              <Button
                color="primary"
                size="sm"
                className="delete-module"
                onClick={() => this.handleDeleteModule(record.id)}
              >
                {t('modules.btn.del')}
              </Button>
            </div>
          </IfLoggedIn>
        )
      }
    ];

    return (
      <div>
        <h3>{t('modules.title')}</h3>
        <IfLoggedIn role="admin">
          <BlockModuleForm blockId={blockId} onSubmit={this.onSubmit()} initialValues={module} module={module} />
        </IfLoggedIn>
        <h1 />
        <Table dataSource={modules} columns={columns} />
      </div>
    );
  }
}

export default translate('zver')(BlockModulesView);
