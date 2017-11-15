import _          from 'lodash';
import angular    from 'angular';
import Template   from './index.pug';
import Controller from './controller';

export default function ($rootScope) {
  'ngInject';

  return {
    restrict    : 'EA',
    transclude  : true,
    replace     : true,
    controller  : Controller,
    template    : Template,
    require     : ['^radio', '^?ngModel'],
    scope       : {
      model      : '=?ngModel',
      ngChecked  : '=?ngChecked',
      ngDisabled : '=?ngDisabled',
      ngChange   : '&',
    },
    link ($scope, $element, $attrs, ctrls) {
      let RadioCtrl           = ctrls[0];

      $scope.attrId           = $attrs.id;
      $scope.attrName         = $attrs.ngModel || `radio-${Date.now() + Math.round(Math.random() * 100)}`;

      $scope.attrValue        = $attrs.hasOwnProperty('value') ? $attrs.value : true;
      $scope.attrNgTrueValue  = $attrs.hasOwnProperty('ngTrueValue') ? $attrs.ngTrueValue : $scope.attrValue;
      $scope.attrNgFalseValue = $attrs.hasOwnProperty('ngFalseValue') ? $attrs.ngFalseValue : false;

      $scope.attrNgChecked    = $attrs.ngChecked;
      $scope.disabled         = $attrs.hasOwnProperty('disabled');
      $scope.checked          = _.isBoolean($scope.ngModel) ? $scope.ngModel : $attrs.hasOwnProperty('checked');

      $scope.stopPropagation  = $attrs.hasOwnProperty('stopPropagation');
      $scope.preventDefault   = $attrs.hasOwnProperty('preventDefault');

      $scope.toggle = (isCheck) => {
        isCheck = angular.isDefined(isCheck) ? !!isCheck : !$scope.checked;
        $scope.checked = isCheck;
      };

      $element
      .removeAttr('id')
      .on('click', (event) => {
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

        $rootScope.$apply(() => {
          $scope.model = $scope.attrValue;
        });
      });

      $scope.$watch('ngChecked', (isChecked) => {
        if (angular.isDefined(isChecked)) {
          $element.attr('checked', isChecked);
          $scope.toggle(!!isChecked);
          RadioCtrl.toggle(isChecked);
          $scope.model = $scope.checked ? $scope.attrNgTrueValue : $scope.attrNgFalseValue;
        }
      });

      $scope.$watch('ngDisabled', function (isDisabled) {
        if ('boolean' === typeof isDisabled) {
          $scope.disabled = isDisabled;
        }
      });

      $scope.$watch('model', (value) => {
        /* eslint eqeqeq: off */
        let isChecked = $scope.checked = true === value || value == $scope.attrNgTrueValue;

        /**
         * 当不知道 model 为 true 或 false 的值时,
         * 重复设置一次 model 的相对 true/false 的值.
         * 会触发多一次 $watch 事件
         */
        if (true !== $scope.attrNgTrueValue && true === value) {
          $scope.model = $scope.attrNgTrueValue;
        }
        else if (false !== $scope.attrNgFalseValue && false === value) {
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

      if (angular.isUndefined($scope.model)) {
        $scope.model = $scope.checked ? $scope.attrNgTrueValue : $scope.attrNgFalseValue;
      }
    },
  };
}