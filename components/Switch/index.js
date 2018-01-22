'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Name = undefined;

require('./stylesheet.scss');

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _isBoolean = require('lodash/isBoolean');

var _isBoolean2 = _interopRequireDefault(_isBoolean);

var _module = require('../../share/module');

var _template = require('./template.pug');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Name = exports.Name = 'QtNgUi.Switch';
exports.default = Name;


if (!(0, _module.exists)(Name)) {
  var App = (0, _module.def)(Name, []);

  var Transclude = function Transclude() {
    return {
      restrict: 'EA',
      require: '^switch',
      link: function link($scope, $element, $attrs, ctrl) {
        var transcludeName = $attrs.switchTransclude;

        ctrl.transclude[transcludeName] = function (content) {
          $element.html(content);
        };
      }
    };
  };

  var Origin = function Origin() {
    return {
      restrict: 'A',
      require: '^switch',
      scope: false,
      link: function link($scope, $element, $attrs, ctrl) {
        ctrl.select = function (isChecked) {
          var trigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
          var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

          isChecked = !!isChecked;

          if (force || isChecked !== $element.prop('checked')) {
            $element.prop('checked', isChecked).attr('checked', isChecked);
            trigger && $element.triggerHandler('change');
          }
        };

        ctrl.toggle = function (isChecked, trigger, force) {
          ctrl.select(isChecked, trigger, force);
        };

        $element.on('change', function () {
          $scope.toggle(!!$element.prop('checked'));

          // 继承 ngChange
          $scope.ngChange && $scope.ngChange();
        });
      }
    };
  };

  var Controller = ['$scope', function ($scope) {
    $scope.checked = false;

    this.transclude = function (name, content) {
      this.transclude[name](content);
    };
  }];

  var Component = ['$rootScope', function ($rootScope) {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      controller: Controller,
      template: _template2.default,
      require: ['^switch', '^?ngModel'],
      scope: {
        model: '=?ngModel',
        ngDisabled: '=?ngDisabled',
        ngChange: '&'
      },
      link: function link($scope, $element, $attrs, ctrls, $transclude) {
        var SwitchCtrl = ctrls[0];

        $scope.attrId = $attrs.id;
        $scope.attrName = ($attrs.ngModel || 'switch-' + (Date.now() + Math.round(Math.random() * 100))).replace(/\[([\w\W]+?)\]/g, '[]');

        $scope.attrType = $attrs.hasOwnProperty('type') ? $attrs.ngType : 'checkbox';
        $scope.attrValue = $attrs.hasOwnProperty('value') ? $attrs.value : true;
        $scope.attrNgTrueValue = $attrs.hasOwnProperty('ngTrueValue') ? $attrs.ngTrueValue : $scope.attrValue;
        $scope.attrNgFalseValue = $attrs.hasOwnProperty('ngFalseValue') ? $attrs.ngFalseValue : false;

        $scope.attrNgChecked = $attrs.ngChecked;
        $scope.disabled = $attrs.hasOwnProperty('disabled');
        $scope.checked = (0, _isBoolean2.default)($scope.ngModel) ? $scope.ngModel : $attrs.hasOwnProperty('checked');

        $scope.stopPropagation = $attrs.hasOwnProperty('stopPropagation');
        $scope.preventDefault = $attrs.hasOwnProperty('preventDefault');

        $scope.toggle = function (isChecked) {
          isChecked = _angular2.default.isDefined(isChecked) ? !!isChecked : !$scope.checked;
          $scope.checked = isChecked;
        };

        /**
         * 绑定点击事件
         */
        $element.removeAttr('id').on('click', function (event) {
          $scope.stopPropagation && event.stopPropagation();
          $scope.preventDefault && event.preventDefault();

          if ($scope.disabled) {
            event.stopPropagation();
            event.preventDefault();
            return false;
          }

          $scope.toggle();

          var isChecked = $scope.checked;

          $rootScope.$apply(function () {
            $scope.model = isChecked ? $scope.attrNgTrueValue : $scope.attrNgFalseValue;
          });

          /**
          * 点击的时候必须触发 $digest
          * 但是注意不能让 watch 也触发
          * 因此, 下面 watch model 中
          * 不能触发 $digest
          */
          SwitchCtrl.toggle(isChecked, true, true);
          $rootScope.$digest();
        });

        /**
         * 监听 ng-disabled 属性改变
         */
        $scope.$watch('ngDisabled', function (isDisabled) {
          if (typeof isDisabled === 'boolean') {
            $scope.disabled = isDisabled;
          }
        });

        /**
         * 监听 model 值改变
         */
        $scope.$watch('model', function (value) {
          /* eslint eqeqeq:0 */
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
          SwitchCtrl.toggle(isChecked, false);
        });

        /**
         * include HTML
         */
        (0, _forEach2.default)($transclude(), function (element) {
          var name = element.tagName.toLowerCase().replace(/-[a-z]/g, function ($1) {
            return $1.replace('-', '').toUpperCase();
          });

          SwitchCtrl.transclude(name, element.innerHTML);
        });

        /**
         * 初始化值
         */
        if (_angular2.default.isUndefined($scope.model)) {
          $scope.model = $scope.checked ? $scope.attrNgTrueValue : $scope.attrNgFalseValue;
        }
      }
    };
  }];

  App.directive('switchTransclude', Transclude);
  App.directive('switchOrigin', Origin);
  App.directive('switch', Component);
}