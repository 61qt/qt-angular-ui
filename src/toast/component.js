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
      options : '=?toastOptions',
    },
    link ($scope, $element) {
      let defaults = _.defaults(Config, $scope.options);

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

        $element.addClass(options.leaveClass);
        $timeout(callback.bind(null), options.during);
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
          $scope.hide();
        },
        defaults.delay || 1500);
      });
    }
  };
}