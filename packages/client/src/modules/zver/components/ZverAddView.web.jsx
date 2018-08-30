import React from 'react';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import translate from '../../../i18n';
import { PageLayoutN } from '../../common/components/web';
import Loading from './Loading';

// import settings from '../../../../../../settings';

const AsyncZverForm = Loadable({
  loader: () => import('./ZverForm'),
  loading: Loading,
  delay: 300
});

const onSubmit = addZver => values => {
  addZver(values.inv, values.isWork);
};

const ZverAddView = ({ addZver, t }) => {
  const renderMetaData = () => (
    <Helmet
      title={t('zver.add')} // title={`${settings.app.name} - ${t('zver.title')}`}
      meta={[
        {
          name: 'description',
          content: t('zver.meta')
        }
      ]}
    />
  );
  return (
    <PageLayoutN>
      {renderMetaData()}
      <Link id="back-button" to="/zvers">
        {t('zver.btn.back')}
      </Link>
      <h2>
        {t(`zver.label.create`)} {t('zver.label.zver')}
      </h2>
      <AsyncZverForm onSubmit={onSubmit(addZver)} />
      <br />
    </PageLayoutN>
  );
};

ZverAddView.propTypes = {
  addZver: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('zver')(ZverAddView);
