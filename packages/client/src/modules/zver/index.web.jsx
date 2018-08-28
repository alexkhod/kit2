import React from 'react';
import Loadable from 'react-loadable';
import path from 'path';
import { Route, NavLink } from 'react-router-dom';
import translate from '../../i18n';

import Loading from './components/Loading';
import { MenuItem } from '../../modules/common/components/web';
// import Zver from './containers/Zver';
// import ZverEdit from './containers/ZverEdit';
// import BlockEdit from './containers/BlockEdit';
// import ModuleEdit from './containers/ModuleEdit';
// import ZverAdd from './containers/ZverAdd';
import resources from './locales';
import resolvers from './resolvers';
import Feature from '../connector';

const AsyncZver = Loadable({
  loader: () => import(/* webpackChunkName: "Zver" */ './containers/Zver'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, './containers/Zver')
});

const AsyncZverAdd = Loadable({
  loader: () => import(/* webpackChunkName: "ZverAdd" */ './containers/ZverAdd'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, './containers/ZverAdd')
});

const AsyncZverEdit = Loadable({
  loader: () => import(/* webpackChunkName: "ZverEdit" */ './containers/ZverEdit'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, './containers/ZverEdit')
});

const AsyncBlockEdit = Loadable({
  loader: () => import(/* webpackChunkName: "BlockEdit" */ './containers/BlockEdit'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, './containers/BlockEdit')
});

const AsyncModuleEdit = Loadable({
  loader: () => import(/* webpackChunkName: "ModuleEdit" */ './containers/ModuleEdit'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, './containers/ModuleEdit')
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
