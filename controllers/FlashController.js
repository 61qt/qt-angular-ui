'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FlashController = exports.config = undefined;

var _isBoolean = require('lodash/isBoolean');

var _isBoolean2 = _interopRequireDefault(_isBoolean);

var _isInteger = require('lodash/isInteger');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _transitionEnd = require('../share/transitionEnd');

var _transitionEnd2 = _interopRequireDefault(_transitionEnd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = exports.config = {
  displayClass: 'in',
  animationClass: 'fade',
  duration: 260,
  padding: 10
};

var FlashController = exports.FlashController = ['$scope', function ($scope) {
  this.$scope = $scope;

  this.configure = function () {
    var $scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.$scope;
    var $element = arguments[1];
    var options = arguments[2];

    this.$scope = this.$scope;
    this.$element = $element;

    if ((0, _isInteger2.default)(options.duration)) {
      $scope.duration = options.duration;
    }

    if (options.displayClass) {
      $scope.displayClass = options.displayClass;
    }

    if (options.animationClass) {
      $scope.animationClass = options.animationClass;
    }
  };

  this.show = function () {
    var $scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.$scope;

    var _this = this;

    var $element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.$element;
    var callback = arguments[2];

    if ($scope.isOpen === true) {
      return;
    }

    this.transitPromise && this.transitPromise.remove();

    setTimeout(function () {
      _this.transitPromise = (0, _transitionEnd2.default)($element, callback, $scope.duration);
      $element.addClass($scope.animationClass);
      $scope.isOpen = true;
    }, 10);

    this.$element.addClass($scope.displayClass);
  };

  this.hide = function () {
    var $scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.$scope;
    var $element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.$element;

    var _this2 = this;

    var callback = arguments[2];
    var force = arguments[3];

    if ($scope.isOpen === false && force !== true) {
      return;
    }

    var afterFadeOut = function afterFadeOut() {
      _this2.$element.removeClass($scope.displayClass);
      (0, _isFunction2.default)(callback) && callback();
    };

    this.transitPromise && this.transitPromise.remove();
    this.transitPromise = (0, _transitionEnd2.default)(this.$element, afterFadeOut, $scope.duration);
    this.$element.removeClass($scope.animationClass);
    $scope.isOpen = false;
  };

  this.dismiss = function () {
    var $scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.$scope;
    var $element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.$element;
    var callback = arguments[2];
    var force = arguments[3];

    if ((0, _isBoolean2.default)(callback)) {
      return this.dismiss($scope, $element, null, callback);
    }

    this.destroying = true;

    this.hide($scope, $element, function () {
      $element.remove();
      $scope.$destroy();

      (0, _isFunction2.default)(callback) && callback();
    }, force);
  };

  $scope.isOpen = false;
  $scope.displayClass = config.dismiss;
  $scope.animationClass = config.animationClass;
  $scope.duration = config.duration;
  $scope.padding = config.padding;
}];