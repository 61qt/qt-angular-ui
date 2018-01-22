'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Name = exports.DefaultSettings = undefined;

require('./stylesheet.scss');

var _defaults = require('lodash/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _Spinner = require('../Spinner');

var _Spinner2 = _interopRequireDefault(_Spinner);

var _FlashController = require('../../controllers/FlashController');

var _module = require('../../share/module');

var _template = require('./template.pug');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultSettings = exports.DefaultSettings = (0, _defaults2.default)({ content: '努力加载中' }, _FlashController.config);
var Name = exports.Name = 'QtNgUi.Locker';
exports.default = Name;


if (!(0, _module.exists)(Name)) {
  var App = (0, _module.def)(Name, [_Spinner2.default]);

  var Service = function Service() {
    this.defaultSettings = DefaultSettings;

    this.configure = function (options) {
      this.defaultSettings = (0, _defaults2.default)({}, options, this.defaultSettings);
    };

    this.$get = ['$rootScope', '$compile', function ($rootScope, $compile) {
      var $newScope = $rootScope.$new();
      $newScope.options = this.defaultSettings;

      var $component = $compile('<locker locker-options="options"></locker>')($newScope);
      var $scope = $component.children().scope();

      _angular2.default.element(document.body).append($component);

      var show = function show(options, callback) {
        $scope.show(options, callback);
      };

      var hide = function hide(options, callback) {
        $scope.hide(options, callback);
      };

      return { show: show, hide: hide };
    }];
  };

  var Component = ['$timeout', function ($timeout) {
    return {
      restrict: 'E',
      replace: true,
      template: _template2.default,
      controller: _FlashController.FlashController,
      controllerAs: '$ctrl',
      scope: {
        options: '=?lockerOptions'
      },
      link: function link($scope, $element, $attr, ctrl) {
        var settings = (0, _defaults2.default)({}, $scope.options, DefaultSettings);
        ctrl.configure($scope, $element, settings);

        $scope.content = settings.content;
        $scope.show = ctrl.show.bind(ctrl, $scope, $element);
        $scope.hide = ctrl.hide.bind(ctrl, $scope, $element);
        $scope.dismiss = ctrl.dismiss.bind(ctrl, $scope, $element);
      }
    };
  }];

  App.provider('$locker', Service);
  App.directive('locker', Component);
}