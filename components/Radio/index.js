'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Name = undefined;

require('./stylesheet.scss');

var _filter = require('lodash/filter');

var _filter2 = _interopRequireDefault(_filter);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _isBoolean = require('lodash/isBoolean');

var _isBoolean2 = _interopRequireDefault(_isBoolean);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _module = require('../../share/module');

var _template = require('./template.pug');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Name = exports.Name = 'QtNgUi.Radio';
exports.default = Name;


if (!(0, _module.exists)(Name)) {
  var App = (0, _module.def)(Name, []);

  var Controller = ['$scope', function ($scope) {
    $scope.checked = false;
  }];

  var Component = ['$rootScope', function ($rootScope) {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      controller: Controller,
      template: _template2.default,
      require: ['^radio', '^?ngModel'],
      scope: {
        model: '=?ngModel',
        ngChecked: '=?ngChecked',
        ngDisabled: '=?ngDisabled',
        ngChange: '&'
      },
      link: function link($scope, $element, $attrs, ctrls) {
        var RadioCtrl = ctrls[0];

        $scope.attrId = $attrs.id;
        $scope.attrName = $attrs.ngModel || 'radio-' + (Date.now() + Math.round(Math.random() * 100));

        $scope.attrValue = $attrs.hasOwnProperty('value') ? $attrs.value : true;
        $scope.attrNgTrueValue = $attrs.hasOwnProperty('ngTrueValue') ? $attrs.ngTrueValue : $scope.attrValue;
        $scope.attrNgFalseValue = $attrs.hasOwnProperty('ngFalseValue') ? $attrs.ngFalseValue : false;

        $scope.attrNgChecked = $attrs.ngChecked;
        $scope.disabled = $attrs.hasOwnProperty('disabled');
        $scope.checked = (0, _isBoolean2.default)($scope.ngModel) ? $scope.ngModel : $attrs.hasOwnProperty('checked');

        $scope.stopPropagation = $attrs.hasOwnProperty('stopPropagation');
        $scope.preventDefault = $attrs.hasOwnProperty('preventDefault');

        $scope.toggle = function (isCheck) {
          isCheck = _angular2.default.isDefined(isCheck) ? !!isCheck : !$scope.checked;
          $scope.checked = isCheck;
        };

        $element.removeAttr('id').on('click', function (event) {
          if ($scope.stopPropagation) {
            event.stopPropagation();
          }

          if ($scope.preventDefault) {
            event.preventDefault();
          }

          if ($scope.disabled) {
            event.preventDefault();
            event.stopPropagation();
            return false;
          }

          $scope.toggle(true);
          RadioCtrl.toggle && RadioCtrl.toggle($scope.checked);

          $rootScope.$apply(function () {
            $scope.model = $scope.attrValue;
          });
        });

        $scope.$watch('ngChecked', function (isChecked) {
          if (_angular2.default.isDefined(isChecked)) {
            $element.attr('checked', isChecked);
            $scope.toggle(!!isChecked);
            RadioCtrl.toggle(isChecked);
            $scope.model = $scope.checked ? $scope.attrNgTrueValue : $scope.attrNgFalseValue;
          }
        });

        $scope.$watch('ngDisabled', function (isDisabled) {
          if (typeof isDisabled === 'boolean') {
            $scope.disabled = isDisabled;
          }
        });

        $scope.$watch('model', function (value) {
          /* eslint eqeqeq: off */
          var isChecked = $scope.checked = value === true || value == $scope.attrNgTrueValue;

          /**
           * 当不知道 model 为 true 或 false 的值时,
           * 重复设置一次 model 的相对 true/false 的值.
           * 会触发多一次 $watch 事件
           */
          if ($scope.attrNgTrueValue !== true && value === true) {
            $scope.model = $scope.attrNgTrueValue;
          } else if ($scope.attrNgFalseValue !== false && value === false) {
            $scope.model = $scope.attrNgFalseValue;
          }

          $element.attr('checked', isChecked);
          $scope.toggle(isChecked);

          /**
           * 这里不能触发 change 事件, 否则会再次触发关联者的再次 $digest
           */
          RadioCtrl.toggle(isChecked, false);
        });

        RadioCtrl.unchecked = function () {
          $element.removeAttr('checked');
        };

        if (_angular2.default.isUndefined($scope.model)) {
          $scope.model = $scope.checked ? $scope.attrNgTrueValue : $scope.attrNgFalseValue;
        }
      }
    };
  }];

  var Origin = function Origin() {
    return {
      restrict: 'A',
      require: '^radio',
      link: function link($scope, $element, $attrs, ctrl) {
        ctrl.select = function (isChecked) {
          var trigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
          var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

          isChecked = !!isChecked;

          if (force || isChecked !== $element.prop('checked')) {
            if ($scope.attrName) {
              var radioes = (0, _filter2.default)(document.getElementsByTagName('input'), function (input) {
                return input.type === 'radio' && input.name === $scope.attrName;
              });

              (0, _forEach2.default)(radioes, function (radio) {
                if (radio !== $element[0]) {
                  var $radio = _angular2.default.element(radio);

                  $radio.prop('checked', false).removeAttr('checked');

                  trigger && $radio.triggerHandler('change');
                }
              });
            }

            $element.prop('checked', true).attr('checked', true);

            trigger && $element.triggerHandler('change');
          }
        };

        ctrl.toggle = function (isCheck) {
          isCheck && ctrl.select();
        };

        $element.on('change', function () {
          var checked = !!_angular2.default.element(this).prop('checked');
          $scope.toggle(checked);
          checked === false && ctrl.unchecked();
        });
      }
    };
  };

  App.directive('radio', Component);
  App.directive('radioOrigin', Origin);
}