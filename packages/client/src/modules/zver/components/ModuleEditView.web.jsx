import React from 'react';
import Loadable from 'react-loadable';
import path from 'path';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import translate from '../../../i18n';
import { PageLayoutN } from '../../common/components/web';
// import ModuleForm from './ModuleForm';
// import ModuleNotes from '../containers/ModuleNotes';
import Loading from './Loading';
// import settings from '../../../../../../settings';

const AsyncModuleForm = Loadable({
  loader: () => import(/* webpackChunkName: "ModuleForm" */ './ModuleForm'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, './ModuleForm')
});

const AsyncModuleNotes = Loadable({
  loader: () => import(/* webpackChunkName: "ModuleNotes" */ '../containers/ModuleNotes'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, '../containers/ModuleNotes')
});

const onSubmit = (module, editModule) => values => {
  editModule(module.id, values.inv, values.isWork, values.zverId, values.blockId);
};

const ModuleEditView = ({ loading, module, match, location, subscribeToMore, editModule, t, zverId, blockId }) => {
  let moduleObj = module;
  // if new module was just added read it from router
  if (!moduleObj && location.state) {
    moduleObj = location.state.module;
  }

  const renderMetaData = () => (
    <Helmet
      title={t('module.title')} // title={`${settings.app.name} - ${t('module.title')}`}
      meta={[
        {
          name: 'description',
          content: t('module.meta')
        }
      ]}
    />
  );

  if (loading && !moduleObj) {
    return (
      <PageLayoutN>
        {renderMetaData()}
        <div className="text-center">{t('module.loadMsg')}</div>
      </PageLayoutN>
    );
  } else {
    return (
      <PageLayoutN>
        {renderMetaData()}
        <p>
          <Link id="back-button" to={'/zver/' + zverId}>
            {t('zver.title2')} {zverId}
          </Link>{' '}
          -{' '}
          <Link id="back-button" to={'/block/' + zverId + '/' + blockId}>
            {t('block.title2')} {blockId}
          </Link>{' '}
          - {t('module.title2')} {match.params.id}
        </p>
        <h2>
          {t(`module.label.edit`)} {t('module.label.module')}
        </h2>
        <AsyncModuleForm onSubmit={onSubmit(moduleObj, editModule)} module={module} zverId={zverId} blockId={blockId} />
        <br />
        {moduleObj && (
          <AsyncModuleNotes
            moduleId={Number(match.params.id)}
            notes={moduleObj.notes}
            subscribeToMore={subscribeToMore}
          />
        )}
      </PageLayoutN>
    );
  }
};

ModuleEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  module: PropTypes.object,
  editModule: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('zver')(ModuleEditView);
