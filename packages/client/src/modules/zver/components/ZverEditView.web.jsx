import React from 'react';
import Loadable from 'react-loadable';
import path from 'path';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Loading from './Loading';

import translate from '../../../i18n';
import { PageLayoutN } from '../../common/components/web';
// import ZverForm from './ZverForm';
// import ZverNotes from '../containers/ZverNotes';
// import ZverBlocks from '../containers/ZverBlocks';
// import { IfLoggedIn } from '../../user/containers/AuthBase';
// import settings from '../../../../../../settings';

const onSubmit = (zver, editZver) => values => {
  editZver(zver.id, values.inv, values.isWork);
};

const AsyncZverForm = Loadable({
  loader: () => import(/* webpackChunkName: "ZverForm" */ './ZverForm'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, './ZverForm')
});

const AsyncZverNotes = Loadable({
  loader: () => import(/* webpackChunkName: "ZverNotes" */ '../containers/ZverNotes'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, '../containers/ZverNotes')
});

const AsyncZverBlocks = Loadable({
  loader: () => import(/* webpackChunkName: "ZverBlocks" */ '../containers/ZverBlocks'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, '../containers/ZverBlocks')
});

const ZverEditView = ({ loading, zver, match, location, subscribeToMore, editZver, t, history, navigation }) => {
  let zverObj = zver;
  // if new zver was just added read it from router
  if (!zverObj && location.state) {
    zverObj = location.state.zver;
  }

  const renderMetaData = () => (
    <Helmet
      title={t('zver.title')} // title={`${settings.app.name} - ${t('zver.title')}`}
      meta={[
        {
          name: 'description',
          content: t('zver.meta')
        }
      ]}
    />
  );

  if (loading && !zverObj) {
    return (
      <PageLayoutN>
        {renderMetaData()}
        <div className="text-center">{t('zver.loadMsg')}</div>
      </PageLayoutN>
    );
  } else {
    return (
      <PageLayoutN>
        {renderMetaData()}
        <h2>
          {t(`zver.label.edit`)} {t('zver.label.zver')} {match.params.id}
        </h2>
        <AsyncZverForm onSubmit={onSubmit(zverObj, editZver)} zver={zver} />
        <br />
        {zverObj && (
          <AsyncZverNotes zverId={Number(match.params.id)} notes={zverObj.notes} subscribeToMore={subscribeToMore} />
        )}
        {zverObj && (
          <AsyncZverBlocks
            zverId={Number(match.params.id)}
            blocks={zverObj.blocks}
            subscribeToMore={subscribeToMore}
            history={history}
            navigation={navigation}
          />
        )}
      </PageLayoutN>
    );
  }
};

ZverEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  zver: PropTypes.object,
  editZver: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  t: PropTypes.func,
  history: PropTypes.object,
  navigation: PropTypes.object
};

export default translate('zver')(ZverEditView);