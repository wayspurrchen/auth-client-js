import request from 'superagent';
import promise from 'superagent-promise-plugin';
import ClientStorage from './clientStorage';

function now() {
  return Math.floor((new Date()).getTime() / 1000);
}

export default class Client {
  static TOKEN_KEY = "tok";

  constructor(config, refresh_token, _window) {
    this.config = config;

    // Only attempt to establish a ClientStorage if a window was passed.
    // A window should not be passed in a Node.js environment because there
    // is no window to pass.
    if (_window) {
      this.store = ClientStorage.enabled(_window.localStorage) ? new ClientStorage(_window.localStorage) : null;
    }
    this.tokens = this._setOrRestoreTokens(refresh_token);
  }

  _setOrRestoreTokens(refresh_token) {
    const storedTokens = this.store ? this.store.getObject(Client.TOKEN_KEY) : {};
    if (refresh_token)
        return {refresh_token};
    if (storedTokens)
        return storedTokens;
    return {};
  }

  _tokens(tokens) {
    this.tokens = tokens;
    this.interval = this.tokens.expires_in;
    this.expires = now() + this.interval;
    if (this.store !== undefined) {
        this.store.setObject(Client.TOKEN_KEY, this.tokens);
    }
    return this.tokens;
  }

  _clearTokens() {
    this.tokens = null;
    this.store && this.store.setObject(Client.TOKEN_KEY, null);
  }

  async login(username, password) {
    const response = await request
      .post(this.config.endpoint + '/login')
      .auth(username, password)
      .accept('application/json')
      .use(promise);
    if (response.status == 200)
      return this._tokens(response.body);
    else
      throw response.error;
  }

  async refresh() {
    const {refresh_token} = this.tokens;
    if (!refresh_token)
      throw Error("no refresh token");
    const response = await request
      .post(this.config.endpoint + '/refresh')
      .type('application/json')
      .accept('application/json')
      .send({refresh_token})
      .use(promise);
    if (response.status == 200)
      return this._tokens(response.body);
    else
      throw response.error;
  }

  async logout() {
    const {access_token} = this.tokens;

    this._clearTokens();

    if (!access_token)
      throw Error("no access token");
    else {
      const response = await request
        .post(this.config.endpoint + '/logout')
        .set('authorization', 'Bearer ' + access_token)
        .use(promise)
      if (response.status == 204){
        return true;
    }
      else
        throw response.error;
    }
  }

  async reauthenticate() {
    if (this.tokens && this.expires && this.interval &&
        this.expires - now() > 0.5 * this.interval)
      return true;
    else
      return this.refresh();
  }
}
