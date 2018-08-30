// import _ from 'lodash';
import pickBy from 'lodash/pickBy';
import get from 'lodash/get';
import * as modules from './config';

const envSettings = Object.assign(
  {},
  pickBy(modules, (v, k) => k !== 'env'),
  get(modules, 'env.' + process.env.NODE_ENV)
);

export default envSettings;
