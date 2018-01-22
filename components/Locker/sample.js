'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = undefined;

require('./sample.scss');

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _sample = require('./sample.pug');

var _sample2 = _interopRequireDefault(_sample);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = exports.App = _angular2.default.module('QtNgUi.Locker.Sample', [_index2.default]);

App.directive('lockerSample', function ($locker) {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: _sample2.default,
    link: function link($scope) {
      $scope.lock = function (message) {
        $locker.show('努力加载中');
        setTimeout(function () {
          return $locker.hide();
        }, 3000);
      };
    }
  };
});

exports.default = App.name;