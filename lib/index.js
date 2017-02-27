'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.superagent = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.createClient = createClient;
exports.createRequester = createRequester;

var _superagentPromisePlugin = require('superagent-promise-plugin');

var _superagentPromisePlugin2 = _interopRequireDefault(_superagentPromisePlugin);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _superagent2 = require('superagent');

var _superagent3 = _interopRequireDefault(_superagent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.superagent = _superagent3.default;
function createClient(_ref) {
  var config = _ref.config,
      refresh_token = _ref.refresh_token,
      _window = _ref._window;

  return new _client2.default(config, refresh_token, _window);
}

function createRequester(_ref2) {
  var config = _ref2.config,
      refresh_token = _ref2.refresh_token,
      _window = _ref2._window,
      username = _ref2.username,
      password = _ref2.password;

  var client = createClient({ config: config, refresh_token: refresh_token, _window: _window });
  var active = true;
  if (username && password) active = false;
  return function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(request) {
      var authenticated;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (active) {
                _context.next = 3;
                break;
              }

              _context.next = 3;
              return client.login(username, password);

            case 3:
              _context.next = 5;
              return client.reauthenticate();

            case 5:
              authenticated = _context.sent;

              if (authenticated) {
                _context.next = 8;
                break;
              }

              throw Error('unable to authenticate');

            case 8:
              return _context.abrupt('return', request.use(_superagentPromisePlugin2.default).set('authorization', 'Bearer ' + client.tokens.access_token));

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }();
}