import _        from 'lodash';
import angular  from 'angular';
import Template from './index.pug';
import Config   from './config';

export default function ($timeout) {
  'ngInject';

  return {
    restrict    : 'EA',
    replace     : true,
    transclude  : true,
    template    : Template,
    scope       : {
      options: '=?alertOptions',
    },
    link ($scope, $element) {
      let defaults = _.defaultsDeep($scope.options, Config);

      $scope.isOpen = false;
      $scope.type   = defaults.type || '';

      /**
       * 显示
       */
      $scope.show = function (options, callback = angular.noop) {
        if (_.isFunction(options)) {
          return $scope.show({}, options);
        }

        options = _.defaults(defaults, options);

        $timeout(() => {
          $element.addClass(options.enterClass);
          $timeout(callback.bind(null), options.during);
          $scope.isOpen = true;
        });
      };

      /**
       * 隐藏
       */
      $scope.hide = function (options, callback = angular.noop) {
        if (_.isFunction(options)) {
          return $scope.hide({}, options);
        }

        options = _.defaults(defaults, options);

        $element.removeClass(options.enterClass).addClass(options.leaveClass);
        $timeout(callback.bind(null), options.during);
        $scope.isOpen = false;
      };

      /**
       * 注销
       */
      $scope.dismiss = function () {
        $scope.hide(function () {
          $element.remove();
          $scope.$destroy();
        });
      };

      $scope.$on('$destroy', function () {
        return $element.remove();
      });

      $scope.show(function () {
        setTimeout(function () {
          $scope.dismiss();
        },
        defaults.delay || 2500);
      });

      $scope.$digest();
    }
  };
}