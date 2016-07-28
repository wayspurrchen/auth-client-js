"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClientStorage = function () {
    function ClientStorage(store) {
        (0, _classCallCheck3.default)(this, ClientStorage);

        this._store = store;
        if (!ClientStorage.enabled(this._store)) throw Error('Storing data in localStorage unsupported.');
    }

    (0, _createClass3.default)(ClientStorage, [{
        key: "setObject",
        value: function setObject(key, value) {
            this._store.setItem(key, (0, _stringify2.default)(value));
        }
    }, {
        key: "getObject",
        value: function getObject(key) {
            var value = this._store.getItem(key);
            return value && JSON.parse(value);
        }
    }, {
        key: "store",
        get: function get() {
            return this._store;
        }
    }], [{
        key: "enabled",
        value: function enabled(test_store) {
            // Taken from: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
            var test_token = "test_token";
            try {
                test_store.setItem(test_token, test_token);
                test_store.getItem(test_token);
                return true;
            } catch (e) {
                return false;
            }
        }
    }]);
    return ClientStorage;
}();

exports.default = ClientStorage;