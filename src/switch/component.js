import _          from 'lodash';
import angular    from 'angular';
import Controller from './controller';
import Template   from './index.jade';

export default function ($rootScope) {
  'ngInject';

  return {
    restrict    : 'EA',
    transclude  : true,
    replace     : true,
    controller  : Controller,
    template    : Template,
    require     : ['^switch', '^?ngModel'],
    scope       : {
      model      : '=?ngModel',
      ngDisabled : '=?ngDisabled',
      ngDisabled : '=?ngDisabled',
      ngChange   : '&',
    },
    link ($scope, $element, $attrs, ctrls, $transclude) {
      let SwitchCtrl = ctrls[0];

      $scope.attrId           = $attrs.id;
      $scope.attrName         = ($attrs.ngModel || `switch-${Date.now() + Math.round(Math.random() * 100)}`).replace(/\[([\w\W]+?)\]/g, '[]');

      $scope.attrType         = $attrs.hasOwnProperty('type') ? $attrs.ngType : 'checkbox';
      $scope.attrValue        = $attrs.hasOwnProperty('value') ? $attrs.value : true;
      $scope.attrNgTrueValue  = $attrs.hasOwnProperty('ngTrueValue') ? $attrs.ngTrueValue : $scope.attrValue;
      $scope.attrNgFalseValue = $attrs.hasOwnProperty('ngFalseValue') ? $attrs.ngFalseValue : false;

      $scope.attrNgChecked    = $attrs.ngChecked;
      $scope.disabled         = $attrs.hasOwnProperty('disabled');
      $scope.checked          = _.isBoolean($scope.ngModel) ? $scope.ngModel : $attrs.hasOwnProperty('checked');

      $scope.stopPropagation  = $attrs.hasOwnProperty('stopPropagation');
      $scope.preventDefault   = $attrs.hasOwnProperty('preventDefault');

      $scope.toggle = function (isChecked) {
        isChecked = angular.isDefined(isChecked) ? !!isChecked : !$scope.checked;
        $scope.checked = isChecked;
      };

      /**
       * 绑定点击事件
       */
      $element
      .removeAttr('id')
      .on('click', (event) => {
        $scope.stopPropagation && event.stopPropagation();
        $scope.preventDefault && event.preventDefault();

        if ($scope.disabled) {
          event.stopPropagation();
          event.preventDefault();
          return false;
        }

        $scope.toggle();

        let isChecked = $scope.checked;

        $rootScope.$apply(() => {
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
      $scope.$watch('ngDisabled', (isDisabled) => {
        if ('boolean' === typeof isDisabled) {
          $scope.disabled = isDisabled;
        }
      });

      /**
       * 监听 model 值改变
       */
      $scope.$watch('model', (value) => {
        /* eslint eqeqeq:0 */
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
        SwitchCtrl.toggle(isChecked, false);
      });

      /**
       * include HTML
       */
      _.forEach($transclude(), function (element) {
        let name = element.tagName
        .toLowerCase()
        .replace(/\-[a-z]/g, function ($1) {
          return $1.replace('-', '').toUpperCase();
        });

        SwitchCtrl.transclude(name, element.innerHTML);
      });

      /**
       * 初始化值
       */
      if (angular.isUndefined($scope.model)) {
        $scope.model = $scope.checked ? $scope.attrNgTrueValue : $scope.attrNgFalseValue;
      }
    },
  };
}
