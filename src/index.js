import promise from 'superagent-promise-plugin';
import Client from './client';

export superagent from 'superagent';

export function createClient({config, refresh_token, _window}) {
  return new Client(config, refresh_token, _window);
}

export function createRequester({config, refresh_token, _window, username, password}) {
  const client = createClient({config, refresh_token, _window});
  let active = true
  if (username && password)
    active = false;
  return async function(request) {
    if (!active)
      await client.login(username, password);
    const authenticated = await client.reauthenticate();
    if (!authenticated)
      throw Error('unable to authenticate');
    return request
      .use(promise)
      .set('authorization', 'Bearer ' + client.tokens.access_token);
  }
}
