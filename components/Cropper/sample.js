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

var _Alert = require('../Alert');

var _Alert2 = _interopRequireDefault(_Alert);

var _sample = require('./sample.pug');

var _sample2 = _interopRequireDefault(_sample);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = exports.App = _angular2.default.module('QtNgUi.Cropper.Sample', [_Alert2.default, _index2.default]);

App.provider('cropperInterceptor', function () {
  this.$get = ['$alert', function ($alert) {
    var notify = function notify() {
      return $alert.create('因为实例无法并不能获取TOKEN 所以不能上传');
    };
    var upload = function upload(file, options, callback) {
      return callback(null, true);
    };

    return { notify: notify, upload: upload };
  }];
});

App.directive('cropperSample', function () {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: _sample2.default,
    link: function link($scope) {
      $scope.image = require('./images/avatar.png');
    }
  };
});

exports.default = App.name;