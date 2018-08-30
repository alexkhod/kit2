import React from 'react';
import Loadable from 'react-loadable';
import { Route, NavLink } from 'react-router-dom';
import translate from '../../i18n';

import Loading from './components/Loading';
import { MenuItem } from '../../modules/common/components/web';
import resources from './locales';
import resolvers from './resolvers';
import Feature from '../connector';

const AsyncZver = Loadable({
  loader: () => import('./containers/Zver'),
  loading: Loading,
  delay: 300
});

const AsyncZverAdd = Loadable({
  loader: () => import('./containers/ZverAdd'),
  loading: Loading,
  delay: 300
});

const AsyncZverEdit = Loadable({
  loader: () => import('./containers/ZverEdit'),
  loading: Loading,
  delay: 300
});

const AsyncBlockEdit = Loadable({
  loader: () => import('./containers/BlockEdit'),
  loading: Loading,
  delay: 300
});

const AsyncModuleEdit = Loadable({
  loader: () => import('./containers/ModuleEdit'),
  loading: Loading,
  delay: 300
});

const NavLinkWithI18n = translate()(({ t }) => (
  <NavLink to="/zvers" className="nav-link" activeClassName="active">
    {t('zver:navLink')}
  </NavLink>
));

export default new Feature({
  route: [
    <Route exact path="/" component={AsyncZver} />,
    <Route exact path="/zvers" component={AsyncZver} />,
    <Route exact path="/zver/new" component={AsyncZverAdd} />,
    <Route path="/zver/:id" component={AsyncZverEdit} />,
    <Route path="/block/:zid/:id" component={AsyncBlockEdit} />,
    <Route path="/module/:zid/:bid/:id" component={AsyncModuleEdit} />
  ],
  navItem: (
    <MenuItem key="/">
      <NavLinkWithI18n />
    </MenuItem>
  ),
  resolver: resolvers,
  localization: { ns: 'zver', resources }
});
