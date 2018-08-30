// import { map, union, without, castArray } from 'lodash';
import map from 'lodash/map';
import union from 'lodash/union';
import without from 'lodash/without';
import castArray from 'lodash/castArray';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class {
  // eslint-disable-next-line no-unused-vars
  constructor({ link, dataRootComponent, login, logout }, ...features) {
    this.link = combine(arguments, arg => arg.link);
    this.dataRootComponent = combine(arguments, arg => arg.dataRootComponent);
    this.login = combine(arguments, arg => arg.login);
    this.logout = combine(arguments, arg => arg.logout);
  }

  async doLogin(client) {
    for (const login of this.login) {
      await login(client);
    }
  }

  async doLogout(client) {
    for (const logout of this.logout) {
      await logout(client);
    }
  }
}
