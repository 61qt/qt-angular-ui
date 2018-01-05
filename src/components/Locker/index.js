import './stylesheet.scss'

import defaults from 'lodash/defaults'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'
import angular from 'angular'
import { config as Config } from './constants'
import Template from './template.pug'

const App = angular.module('QtNgUi.Locker', [])

class Service {
  constructor () {
    this.defaultSettings = Config
  }

  configure (options) {
    this.defaultSettings = defaults({}, options, this.defaultSettings)
  }

  $get ($rootScope, $compile) {
    'ngInject'

    let $scope = $rootScope.$new()
    $scope.lockerOptions = this.defaultSettings

    let $component = $compile('<locker locker-options = "lockerOptions"></locker>')($scope)
    let $childScope = $component.children().scope()

    angular.element(document.body).append($component)

    return {
      show (options, callback) {
        $childScope.show(options, callback)
      },
      hide (options, callback) {
        $childScope.hide(options, callback)
      }
    }
  }
}

const Component = ($timeout) => ({
  restrict: 'E',
  replace: true,
  template: Template,
  scope: {
    options: '=?lockerOptions'
  },
  link ($scope, $element) {
    let timeoutPromise
    let settings = defaults($scope.options, Config)

    $scope.isOpened = false
    $scope.content = settings.content

    /**
     * 显示
     * @param  {Object}   options  配置
     * @param  {Function} callback 回调
     * @return {undefined}
     */
    $scope.show = function (options, callback) {
      if (isString(options)) {
        return $scope.show({ content: options }, callback)
      }

      if ($scope.isOpened === true) {
        return
      }

      if (isFunction(options)) {
        return $scope.show({}, options)
      }

      /**
       * 设置配置
       */
      options = defaults({}, options, settings)

      /**
       * 设置属性
       */
      $scope.isOpened = undefined
      $scope.content = options.content

      /**
       * 开始动画
       */
      timeoutPromise && $timeout.cancel(timeoutPromise)

      $element
        .removeClass(options.leaveClass)
        .addClass(options.duringClass)
        .addClass(options.enterClass)

      timeoutPromise = $timeout(function () {
        timeoutPromise = undefined
        $scope.isOpened = true

        isFunction(callback) && callback()
      },
      options.during)
    }

    /**
     * 隐藏
     * @param  {Object}   options  配置
     * @param  {Function} callback 回调
     * @return {undefined}
     */
    $scope.hide = function (options, callback) {
      if (isString(options)) {
        return $scope.hide({ content: options }, callback)
      }

      if ($scope.isOpened === false) {
        return
      }

      if (isFunction(options)) {
        return $scope.hide({}, options)
      }

      /**
       * 设置配置
       */
      options = defaults({}, options, settings)

      /**
       * 设置属性
       */
      $scope.isOpened = undefined
      $scope.content = options.content

      timeoutPromise && $timeout.cancel(timeoutPromise)

      /**
       * 开始动画
       */
      $element.addClass(options.leaveClass)

      timeoutPromise = $timeout(function () {
        timeoutPromise = undefined
        $scope.isOpened = false

        $element
          .removeClass(options.duringClass)
          .removeClass(options.enterClass)
          .removeClass(options.leaveClass)

        isFunction(callback) && callback()
      },
      options.during)
    }
  }
})

App.provider('$locker', Service)
App.directive('locker', Component)

export default App.name
