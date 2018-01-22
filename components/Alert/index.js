'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Name = exports.DefaultSettings = undefined;

require('./stylesheet.scss');

var _remove = require('lodash/remove');

var _remove2 = _interopRequireDefault(_remove);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _defaults = require('lodash/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _template = require('lodash/template');

var _template2 = _interopRequireDefault(_template);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isInteger = require('lodash/isInteger');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _constants = require('./constants');

var _FlashController = require('../../controllers/FlashController');

var _module = require('../../share/module');

var _template3 = require('./template.pug');

var _template4 = _interopRequireDefault(_template3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultSettings = exports.DefaultSettings = (0, _defaults2.default)({ delay: 2500 }, _FlashController.config);
var Name = exports.Name = 'QtNgUi.Alert';
exports.default = Name;


if (!(0, _module.exists)(Name)) {
  var App = (0, _module.def)(Name, []);

  var Service = function Service() {
    this.openScopes = [];
    this.defaultSettings = DefaultSettings;

    this.configure = function (options) {
      this.defaultSettings = (0, _defaults2.default)({}, options, this.defaultSettings);
    };

    this.$get = ['$rootScope', '$compile', function ($rootScope, $compile) {
      var _this = this;

      var create = function create(message) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.defaultSettings;

        if ((0, _isString2.default)(options)) {
          return create(message, { type: options });
        }

        var AlertTemplate = (0, _template2.default)(_constants.template)({ message: message });
        var $alias = _angular2.default.element(AlertTemplate);
        var $newScope = $rootScope.$new();

        if ((0, _isPlainObject2.default)(options)) {
          $newScope.options = (0, _defaults2.default)({}, options, _this.defaultSettings);
        }

        var $element = $compile($alias)($newScope);
        var $scope = _angular2.default.element($element[0].childNodes[0]).scope();
        _angular2.default.element(document.body).append($element);

        !$scope.$$phase && !$scope.$root.$$phase && $scope.$digest();
        _this.openScopes.push($scope);
      };

      var remove = function remove(scope) {
        (0, _remove2.default)(_this.openScopes, function ($scope) {
          return $scope === scope;
        });
      };

      var removeAll = function removeAll() {
        (0, _forEach2.default)(_this.openScopes, function (scope) {
          return scope.dismiss(true);
        });
      };

      return { create: create, remove: remove, removeAll: removeAll };
    }];
  };

  var Component = ['$alert', function ($alert) {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      template: _template4.default,
      controller: _FlashController.FlashController,
      controllerAs: '$ctrl',
      scope: {
        options: '=?alertOptions'
      },
      link: function link($scope, $element, $attr, ctrl, transclude) {
        var settings = (0, _defaults2.default)({}, $scope.options, DefaultSettings);
        ctrl.configure($scope, $element, settings);

        $scope.type = settings.type || '';
        $scope.delay = (0, _isInteger2.default)(settings.delay) && settings.delay > 0 ? settings.delay : DefaultSettings.delay;
        $scope.show = ctrl.show.bind(ctrl, $scope, $element);
        $scope.hide = ctrl.hide.bind(ctrl, $scope, $element);
        $scope.dismiss = ctrl.dismiss.bind(ctrl, $scope, $element);

        $scope.$on('$destroy', function () {
          $alert.remove($scope);
          $element.remove();
        });

        $scope.show(function () {
          setTimeout($scope.dismiss.bind($scope), $scope.delay);
        });
      }
    };
  }];

  App.provider('$alert', Service);
  App.directive('alert', Component);
}