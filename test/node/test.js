import assert from 'assert';
import superagent from 'superagent';
import fixtures from '../fixtures';
import {createClient, createRequester} from '../../src';
import mock from 'superagent-mock'

mock(superagent, fixtures);

describe('Client', () => {
  const config = { endpoint: 'https://auth.realmassive.com' };
  const username = 'testuser';
  const password = 'efgh5678@';

  const requester = createRequester({config, username, password});
  const client = createClient({config});

  it('login', async () => {
    const tokens = await client.login(username, password);
    assert(tokens.access_token);
  });

  it('refresh', async () => {
    const tokens = await client.refresh();
    assert(tokens.access_token);
  });

  it('reauthenticate', async () => {
    const response = await client.reauthenticate();
    assert(response);
  });

  it('logout', async () => {
    const response = await client.logout();
    assert(response);
  });

  it('requester', async () => {
    const response = await requester(superagent.post(config.endpoint + '/test'));
    assert.equal(response.body.message, 'success!');
  });
});
