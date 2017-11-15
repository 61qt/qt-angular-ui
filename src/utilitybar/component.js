import _          from 'lodash';
import angular    from 'angular';
import Controller from './controller.js';
import Template   from './index.pug';

export default function ($compile, $stateParams, $utilitybar) {
  'ngInject';

  return {
    restrict   : 'EA',
    transclude : true,
    replace    : true,
    template   : Template,
    controller : Controller,
    require    : ['^utilitybar', '^?ngModel'],
    scope      : {
      isOpen: '=?ngModel',
    },
    link ($scope, $element, $attrs, ctrls, $transclude) {
      let utilityCtrl = ctrls[0];

      /**
       * 显示/隐藏工具栏
       * @param  {Boolean} isOpen 是否打开
       * @return {Boolean}        当前状态
       */
      $scope.toggle = function (isOpen) {
        $scope.isOpen = _.isBoolean(isOpen) ? isOpen : !!$scope.isOpen;
        return $scope.isOpen;
      };

      /**
       * 返回
       * @return {undefined}
       */
      $scope.goback = function () {
        if ($stateParams.hasOwnProperty('dt') && $stateParams.dt) {
          angular.redirect($stateParams.dt);
        }
        else if (0 < window.history.length) {
          window.history.back();
        }
      };

      /**
       * $cloneElements 会绑定一个 scope, 因此可以随意创建一个 scope,
       * 然后将 scope 删除, 再次执行绑定, 就能实现不同的绑定功能.
       * 这里注意 $cloneElements 会绑定 $transclude 传入的的 scope
       * 因此要确定 scope.$destroy 会不会影响到其他 scope, 因此保险起见
       * 可以直接使用 $scope.$new() 创建一个子 scope
       */
      $transclude($scope.$new(), function ($cloneElements) {
        0 < $cloneElements.length && utilityCtrl.clean();

        _.forEach($cloneElements, function (element) {
          angular.element(element).scope().$destroy();

          let hasAttr = angular.element(element).attr('scope');
          let newElem = _.isUndefined(hasAttr) ? $compile(element)($scope) : $compile(element)($scope.$parent);

          utilityCtrl.transclude(newElem);
        });
      });

      /**
       * 堆栈
       */
      $utilitybar.add($scope);
    },
  };
}
