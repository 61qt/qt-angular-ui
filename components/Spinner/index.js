'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Name = undefined;

require('./stylesheet.scss');

var _module = require('../../share/module');

var _template = require('./template.pug');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Name = exports.Name = 'QtNgUi.Spinner';
exports.default = Name;


if (!(0, _module.exists)(Name)) {
  var App = (0, _module.def)(Name, []);

  var Component = function Component() {
    return {
      restrict: 'E',
      replace: true,
      template: _template2.default
    };
  };

  App.directive('spinner', Component);
}