/*eslint-disable */

describe('Client', function() {
  var fixtures = require('../fixtures');
  var mock = require('superagent-mock');
  mock(_RMAUTH.superagent, fixtures);

  var assert = function(x) {
    if (!x)
      throw Error('assertion failed');
  };
  var config = { endpoint: 'https://auth.realmassive.com' };
  var client = _RMAUTH.createClient({config, _window: window});

  it('login', function() {
    return client.login('testuser', 'efgh5678@')
      .then(function(tokens) {
        assert(tokens.access_token);
      });
  });

  it('refresh', function() {
    return client.refresh()
      .then(function(tokens) {
        assert(tokens.access_token);
      });
  });

  it('reauthenticate', function() {
    return client.reauthenticate()
      .then(function(response) {
        assert(response);
      });
  });

  it('logout', function() {
    return client.logout()
      .then(function(response) {
        assert(response);
      });
  });

  /* Tokens */
it('stores tokens on login', function() {
    return client.login('testuser', 'efgh5678@')
      .then(function(tokens) {
        assert(tokens.access_token === client.store.getObject("tok").access_token);
      });
  });

  it('updates tokens on refresh', function() {
    return client.refresh()
      .then(function(tokens) {
        assert(tokens.access_token === client.store.getObject("tok").access_token);
      });
  });

  it('updates tokens on reauthenticate', function() {
    return client.reauthenticate()
      .then(function(response) {
        assert(response === true);
      });
  });

  it('clears tokens on logout', function() {
    return client.logout()
      .then(function(response) {
        assert(response === true);
      });
  });
});
