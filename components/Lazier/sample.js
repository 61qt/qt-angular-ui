'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = undefined;

require('./sample.scss');

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _sample = require('./sample.pug');

var _sample2 = _interopRequireDefault(_sample);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = exports.App = _angular2.default.module('QtNgUi.Lazier.Sample', [_index2.default]);

App.filter('version', function () {
  return function (src) {
    return src;
  };
});

App.config(function ($lazierProvider) {
  /**
   * 默认绑定 window scoll 事件, 因为这里样式为
   * html { overflow: 'hidden'; height: 100%; }
   * body { overflow: 'auto'; height: 100%; }
   */
  _angular2.default.element(document.body).on('scroll', $lazierProvider.scroll.bind($lazierProvider));
});

App.directive('lazierSample', function () {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: _sample2.default,
    link: function link($scope) {
      $scope.images = (0, _map2.default)(new Array(100), function (_, no) {
        return '//lorempixel.com/1024/768/food/?v=' + no;
      });
    }
  };
});

exports.default = App.name;