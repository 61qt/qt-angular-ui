'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.def = exports.exists = undefined;

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exists = exports.exists = function exists(name) {
  try {
    _angular2.default.module(name);
  } catch (error) {
    return false;
  }

  return true;
};

var def = exports.def = function def(name) {
  var dependences = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  return exists(name) ? _angular2.default.module(name) : _angular2.default.module(name, dependences);
};