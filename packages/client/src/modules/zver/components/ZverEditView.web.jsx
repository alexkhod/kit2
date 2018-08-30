import React from 'react';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Loading from './Loading';

import translate from '../../../i18n';
import { PageLayoutN } from '../../common/components/web';

const onSubmit = (zver, editZver) => values => {
  editZver(zver.id, values.inv, values.isWork);
};

const AsyncZverForm = Loadable({
  loader: () => import('./ZverForm'),
  loading: Loading,
  delay: 300
});

const AsyncZverNotes = Loadable({
  loader: () => import('../containers/ZverNotes'),
  loading: Loading,
  delay: 300
});

const AsyncZverBlocks = Loadable({
  loader: () => import('../containers/ZverBlocks'),
  loading: Loading,
  delay: 300
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
