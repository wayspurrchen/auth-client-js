'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _superagentPromisePlugin = require('superagent-promise-plugin');

var _superagentPromisePlugin2 = _interopRequireDefault(_superagentPromisePlugin);

var _clientStorage = require('./clientStorage');

var _clientStorage2 = _interopRequireDefault(_clientStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function now() {
  return Math.floor(new Date().getTime() / 1000);
}

var Client = function () {
  function Client(config, refresh_token, _window) {
    (0, _classCallCheck3.default)(this, Client);

    this.config = config;

    // Only attempt to establish a ClientStorage if a window was passed.
    // A window should not be passed in a Node.js environment because there
    // is no window to pass.
    if (_window) {
      this.store = _clientStorage2.default.enabled(_window.localStorage) ? new _clientStorage2.default(_window.localStorage) : null;
    }
    this.tokens = this._setOrRestoreTokens(refresh_token);
  }

  (0, _createClass3.default)(Client, [{
    key: '_setOrRestoreTokens',
    value: function _setOrRestoreTokens(refresh_token) {
      var storedTokens = this.store ? this.store.getObject(Client.TOKEN_KEY) : {};
      if (refresh_token) return { refresh_token: refresh_token };
      if (storedTokens) return storedTokens;
      return {};
    }
  }, {
    key: '_tokens',
    value: function _tokens(tokens) {
      this.tokens = tokens;
      this.interval = this.tokens.expires_in;
      this.expires = now() + this.interval;
      if (this.store !== undefined) {
        this.store.setObject(Client.TOKEN_KEY, this.tokens);
      }
      return this.tokens;
    }
  }, {
    key: '_clearTokens',
    value: function _clearTokens() {
      this.tokens = null;
      this.store && this.store.setObject(Client.TOKEN_KEY, null);
    }
  }, {
    key: 'login',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(username, password) {
        var response;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _superagent2.default.post(this.config.endpoint + '/login').type('application/json').accept('application/json').send({
                  email: username,
                  password: password
                }).use(_superagentPromisePlugin2.default);

              case 2:
                response = _context.sent;

                if (!(response.status == 200)) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt('return', this._tokens(response.body));

              case 7:
                throw response.error;

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function login(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return login;
    }()
  }, {
    key: 'refresh',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var refresh_token, response;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                refresh_token = this.tokens.refresh_token;

                if (refresh_token) {
                  _context2.next = 3;
                  break;
                }

                throw Error("no refresh token");

              case 3:
                _context2.next = 5;
                return _superagent2.default.post(this.config.endpoint + '/refresh').type('application/json').accept('application/json').send({ refresh_token: refresh_token }).use(_superagentPromisePlugin2.default);

              case 5:
                response = _context2.sent;

                if (!(response.status == 200)) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt('return', this._tokens(response.body));

              case 10:
                throw response.error;

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function refresh() {
        return _ref2.apply(this, arguments);
      }

      return refresh;
    }()
  }, {
    key: 'logout',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        var access_token, response;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                access_token = this.tokens.access_token;


                this._clearTokens();

                if (access_token) {
                  _context3.next = 6;
                  break;
                }

                throw Error("no access token");

              case 6:
                _context3.next = 8;
                return _superagent2.default.post(this.config.endpoint + '/logout').set('authorization', 'Bearer ' + access_token).use(_superagentPromisePlugin2.default);

              case 8:
                response = _context3.sent;

                if (!(response.status == 204)) {
                  _context3.next = 13;
                  break;
                }

                return _context3.abrupt('return', true);

              case 13:
                throw response.error;

              case 14:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function logout() {
        return _ref3.apply(this, arguments);
      }

      return logout;
    }()
  }, {
    key: 'reauthenticate',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(this.tokens && this.expires && this.interval && this.expires - now() > 0.5 * this.interval)) {
                  _context4.next = 4;
                  break;
                }

                return _context4.abrupt('return', true);

              case 4:
                return _context4.abrupt('return', this.refresh());

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function reauthenticate() {
        return _ref4.apply(this, arguments);
      }

      return reauthenticate;
    }()
  }]);
  return Client;
}();

Client.TOKEN_KEY = "tok";
exports.default = Client;