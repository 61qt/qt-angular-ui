'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Name = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _defaults = require('lodash/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _module = require('../../share/module');

var _template = require('./template.pug');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Name = exports.Name = 'QtNgUi.Captcha';
exports.default = Name;


if (!(0, _module.exists)(Name)) {
  var App = (0, _module.def)(Name, []);

  var confilt = function confilt(captcha) {
    return captcha.replace(/\?([\w\W]+?)$/, '') + ('?v=' + Date.now());
  };

  var Service = function Service() {
    this.defaultSettings = { url: '' };

    this.configure = function (options) {
      this.defaultSettings = (0, _defaults2.default)({}, options, this.defaultSettings);
    };

    this.$get = function () {
      var ArrayProps = Array.prototype;
      var defaultSettings = this.defaultSettings;

      var Captcha = function () {
        function Captcha(options) {
          (0, _classCallCheck3.default)(this, Captcha);

          ArrayProps.push.call(this);

          this.settings = (0, _defaults2.default)({}, options, defaultSettings);

          if (window.angular && window.angular.env && window.angular.env.QT_UI_LOG && !defaultSettings.url) {
            window.console.error('[qt-angular-ui]尚未进行 Captcha 的配置，请查看 qt-angular-ui/src/captcha/README.md 进行配置');
          }

          this.captcha = this.change();
        }

        (0, _createClass3.default)(Captcha, [{
          key: '$add',
          value: function $add(openScope) {
            var _this = this;

            ArrayProps.push.call(this, openScope);

            openScope.$on('$destroy', function () {
              var index = ArrayProps.indexOf.call(_this, openScope);
              index !== -1 && ArrayProps.splice.call(_this, index, 1);
            });
          }
        }, {
          key: '$change',
          value: function $change(captcha) {
            if (arguments.length > 0) {
              return captcha ? confilt(captcha) : '';
            }

            var opts = this.settings;
            return opts.url ? confilt(opts.url) : '';
          }
        }, {
          key: 'change',
          value: function change() {
            var _this2 = this;

            this.captcha = this.$change();

            ArrayProps.forEach.call(this, function (openScope) {
              openScope.captcha = _this2.captcha;
            });
          }
        }]);
        return Captcha;
      }();

      return new Captcha();
    };
  };

  var Captcha = ['$uiCaptcha', function ($uiCaptcha) {
    return {
      restrict: 'EA',
      replace: true,
      template: _template2.default,
      scope: {
        captcha: '=?ngModel'
      },
      link: function link($scope, $element) {
        if (_angular2.default.isString($scope.captcha) && $scope.captcha) {
          $scope.captcha = $uiCaptcha.$change($scope.captcha);

          $scope.changeCaptcha = function () {
            $scope.captcha = $uiCaptcha.$change($scope.captcha);
          };
        } else {
          $uiCaptcha.$add($scope);
          $scope.captcha = $uiCaptcha.url;

          $scope.changeCaptcha = function () {
            $uiCaptcha.change();
          };
        }

        $element.on('click', function () {
          $scope.changeCaptcha();
          $scope.$digest();
        });

        $scope.$on('captcha.change', function () {
          $scope.changeCaptcha();
        });

        $scope.changeCaptcha();
      }
    };
  }];

  App.provider('$uiCaptcha', Service);
  App.directive('captcha', Captcha);
}