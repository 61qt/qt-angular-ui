'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Name = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

require('./stylesheet.scss');

var _chunk = require('lodash/chunk');

var _chunk2 = _interopRequireDefault(_chunk);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _indexOf = require('lodash/indexOf');

var _indexOf2 = _interopRequireDefault(_indexOf);

var _defaults = require('lodash/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _module = require('../../share/module');

var _placeholder = require('./placeholder');

var _placeholder2 = _interopRequireDefault(_placeholder);

var _template = require('./template.pug');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Name = exports.Name = 'QtNgUi.Lazier';
exports.default = Name;


if (!(0, _module.exists)(Name)) {
  var App = (0, _module.def)(Name, []);

  var Service = function Service() {
    this.list = [];
    this.defaultSettings = {
      placeholder: _placeholder2.default,
      errorholder: _placeholder2.default
    };

    this.configure = function (options) {
      this.defaultSettings = (0, _defaults2.default)(options, this.defaultSettings);
    };

    this.scroll = function () {
      (0, _forEach2.default)((0, _chunk2.default)(this.list, 2), function (_ref) {
        var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
            _ = _ref2[0],
            handle = _ref2[1];

        (0, _isFunction2.default)(handle) && handle();
      });
    };

    this.$get = function () {
      var _this = this;

      var list = this.list;
      var settings = this.defaultSettings;
      var scroll = this.scroll.bind(this);

      var onView = function onView(scope, handle) {
        offView(scope);

        handle = handle.bind(null, offView.bind(null, scope));
        list.push(scope, handle);
        _this.scroll();
      };

      var offView = function offView(scope) {
        var index = (0, _indexOf2.default)(list, scope);
        index !== -1 && list.splice(index, 2);
      };

      return { settings: settings, onView: onView, offView: offView, scroll: scroll };
    };

    _angular2.default.element(window).on('scroll', this.scroll.bind(this));
  };

  var Controller = ['$scope', '$lazier', function ($scope, $lazier) {
    this.$scope = $scope;

    $scope.state = 'idle';
    $scope.finished = false;

    var _$lazier$settings = $lazier.settings,
        errorholder = _$lazier$settings.errorholder,
        placeholder = _$lazier$settings.placeholder;

    $scope.errorholder = errorholder;
    $scope.placeholder = placeholder;

    this.inScreen = function ($element) {
      var element = $element[0];

      var _element$getBoundingC = element.getBoundingClientRect(),
          top = _element$getBoundingC.top,
          left = _element$getBoundingC.left;

      return top > -element.clientHeight && top < window.innerHeight && left > -element.clientWidth && left < window.innerWidth;
    };

    this.load = function () {
      var $scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.$scope;
      var $element = arguments[1];
      var callback = arguments[2];

      $scope.state = 'loading';

      var image = new window.Image();
      image.onload = function () {
        $scope.state = 'success';
        $scope.finished = true;

        (0, _isFunction2.default)(callback) && callback(null, $scope.image);
        $scope.$digest();
      };

      image.onerror = function (error) {
        $scope.state = 'error';
        $scope.finished = true;

        (0, _isFunction2.default)(callback) && callback(error);
        $scope.$digest();
      };

      image.src = $scope.image;
    };
  }];

  var Component = ['$lazier', function ($lazier) {
    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      template: _template2.default,
      controller: Controller,
      controllerAs: '$ctrl',
      scope: {
        image: '=?ngSrc'
      },
      link: function link($scope, $element, $attrs, ctrl) {
        var _$lazier$settings2 = $lazier.settings,
            errorholder = _$lazier$settings2.errorholder,
            placeholder = _$lazier$settings2.placeholder;

        $scope.errorholder = $attrs.errorholder || errorholder;
        $scope.placeholder = $attrs.placeholder || placeholder;

        $scope.$watch('image', function (nextValue, prevValue) {
          $scope.state = 'idle';
          $scope.finished = false;

          $lazier.onView($scope, function (done) {
            if ($scope.finished === true) {
              done(null);
              return;
            }

            ctrl.inScreen($element) && ctrl.load($scope, $element, done);
          });
        });
      }
    };
  }];

  App.provider('$lazier', Service);
  App.directive('lazier', Component);
}