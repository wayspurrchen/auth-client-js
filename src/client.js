import request from 'superagent';
import promise from 'superagent-promise-plugin';

function now() {
  return Math.floor((new Date()).getTime() / 1000);
}

export default class Client {
  constructor(config, refresh_token) {
    this.config = config;
    this.tokens = {refresh_token};
  }

  _tokens(tokens) {
    this.tokens = tokens;
    this.interval = this.tokens.expires_in;
    this.expires = now() + this.interval;
    return this.tokens;
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
    if (!access_token)
      throw Error("no access token");
    else {
      const response = await request
        .post(this.config.endpoint + '/logout')
        .set('authorization', 'Bearer ' + access_token)
        .use(promise);
      if (response.status == 204)
        return true;
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
