import React from 'react';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import translate from '../../../i18n';
import { PageLayoutN } from '../../common/components/web';
import Loading from './Loading';

const AsyncBlockForm = Loadable({
  loader: () => import('./BlockForm'),
  loading: Loading,
  delay: 300
});

const AsyncBlockNotes = Loadable({
  loader: () => import('../containers/BlockNotes'),
  loading: Loading,
  delay: 300
});

const AsyncBlockModules = Loadable({
  loader: () => import('../containers/BlockModules'),
  loading: Loading,
  delay: 300
});

const onSubmit = (block, editBlock) => values => {
  editBlock(block.id, values.inv, values.isWork, values.zverId);
};

const BlockEditView = ({
  loading,
  block,
  match,
  location,
  subscribeToMore,
  editBlock,
  t,
  history,
  navigation,
  zverId
}) => {
  let blockObj = block;
  // if new block was just added read it from router
  if (!blockObj && location.state) {
    blockObj = location.state.block;
  }

  const renderMetaData = () => (
    <Helmet
      title={t('block.title')} // title={`${settings.app.name} - ${t('block.title')}`}
      meta={[
        {
          name: 'description',
          content: t('block.meta')
        }
      ]}
    />
  );

  if (loading && !blockObj) {
    return (
      <PageLayoutN>
        {renderMetaData()}
        <div className="text-center">{t('block.loadMsg')}</div>
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
          - {t('block.title2')} {match.params.id}
        </p>
        <h2>
          {t(`block.label.edit`)} {t('block.label.block')}
        </h2>
        <AsyncBlockForm onSubmit={onSubmit(blockObj, editBlock)} block={block} zverId={zverId} />
        <br />
        {blockObj && (
          <AsyncBlockNotes blockId={Number(match.params.id)} notes={blockObj.notes} subscribeToMore={subscribeToMore} />
        )}
        {blockObj && (
          <AsyncBlockModules
            zverId={Number(zverId)}
            blockId={Number(match.params.id)}
            modules={blockObj.modules}
            subscribeToMore={subscribeToMore}
            history={history}
            navigation={navigation}
          />
        )}
      </PageLayoutN>
    );
  }
};

BlockEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  block: PropTypes.object,
  editBlock: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  t: PropTypes.func,
  history: PropTypes.object,
  navigation: PropTypes.object
};

export default translate('zver')(BlockEditView);
