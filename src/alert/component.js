import _        from 'lodash';
import Template from './index.jade';
import Config   from './config';

function noop () {}

export default function ($timeout) {
  'ngInject';

  return {
    restrict    : 'EA',
    replace     : true,
    transclude  : true,
    template    : Template,
    // scope       : {
    //   options : '=?alertOptions',
    //   isOpen  : '=',
    // },
    link ($scope, $element) {
      let defaults = _.assign(Config, $scope.options);

      $scope.isOpen = false;
      $scope.type   = defaults.type;

      /**
       * 显示
       */
      $scope.show = function (options, callback = noop) {
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
      $scope.hide = function (options, callback = noop) {
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
    }
  };
}