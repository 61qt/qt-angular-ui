import _        from 'lodash';
import Config   from './config';
import Template from './index.jade';

export default function ($timeout) {
  'ngInject';

  return {
    restrict : 'E',
    replace  : true,
    template : Template,
    scope    : {
      options  : '=?lockerOptions',
    },
    link ($scope, $element) {
      let timeoutPromise;
      let defaults = _.defaults($scope.options, Config);

      $scope.isOpened = false;
      $scope.content  = defaults.content;

      /**
       * 显示
       * @param  {Object}   options  配置
       * @param  {Function} callback 回调
       * @return {undefined}
       */
      $scope.show = function (options, callback) {
        if (_.isString(options)) {
          return $scope.show({ content: options }, callback);
        }

        if (true === $scope.isOpened) {
          return;
        }

        if (_.isFunction(options)) {
          return $scope.enter({}, options);
        }

        /**
         * 设置配置
         */
        options = _.defaultsDeep(options, defaults);

        /**
         * 设置属性
         */
        $scope.isOpened = undefined;
        $scope.content  = options.content;

        /**
         * 开始动画
         */
        timeoutPromise && $timeout.cancel(timeoutPromise);

        $element
        .removeClass(options.leaveClass)
        .addClass(options.duringClass)
        .addClass(options.enterClass);

        timeoutPromise = $timeout(function () {
          timeoutPromise  = undefined;
          $scope.isOpened = true;

          _.isFunction(callback) && callback();
        },
        options.during);
      };

      /**
       * 隐藏
       * @param  {Object}   options  配置
       * @param  {Function} callback 回调
       * @return {undefined}
       */
      $scope.hide = function (options, callback) {
        if (_.isString(options)) {
          return $scope.hide({ content: options }, callback);
        }

        if (false === $scope.isOpened) {
          return;
        }

        if (_.isFunction(options)) {
          return $scope.hide({}, options);
        }

        /**
         * 设置配置
         */
        options = _.defaultsDeep(options, defaults);

        /**
         * 设置属性
         */
        $scope.isOpened = undefined;
        $scope.content  = defaults.content;

        timeoutPromise && $timeout.cancel(timeoutPromise);

        /**
         * 开始动画
         */
        $element.addClass(options.leaveClass);

        timeoutPromise = $timeout(function () {
          timeoutPromise  = undefined;
          $scope.isOpened = false;

          $element
          .removeClass(options.duringClass)
          .removeClass(options.enterClass)
          .removeClass(options.leaveClass);

          _.isFunction(callback) && callback();
        },
        options.during);
      };
    },
  };
}
