import './stylesheet.scss'

import forEach from 'lodash/forEach'
import defaults from 'lodash/defaults'
import isFunction from 'lodash/isFunction'
import isPlainObject from 'lodash/isPlainObject'
import angular from 'angular'
import { config as Config } from './constant'
import Template from './template.pug'

const App = angular.module('QtNgUi.Toast', [])

class Service {
  constructor () {
    this.openScopes = []
    this.defaultSettings = Config
  }

  configure (options) {
    this.defaultSettings = defaults(options, this.defaultSettings)
  }

  $get ($document, $rootScope, $compile) {
    const create = (message, options = this.defaultSettings) => {
      let $toast = angular.element(`<toast>${message}</toast>`)
      let $scope = $rootScope.$new()

      if (isPlainObject(options)) {
        $scope.toastOptions = options
      }

      let $element = $compile($toast)($scope)
      angular.element(document.body).append($element)

      !$scope.$$phase && !$scope.$root.$$phase && $scope.$digest()
      this.openScopes.push($scope)
    }

    const removeAll = () => {
      forEach(this.openScopes, (scope) => scope.hide())
    }

    return { create, removeAll }
  }
}

const Component = ($timeout) => ({
  restrict: 'EA',
  replace: true,
  transclude: true,
  template: Template,
  scope: {
    options: '=?toastOptions'
  },
  link ($scope, $element) {
    let settings = defaults($scope.options, Config)

    /**
     * 显示
     */
    $scope.show = function (options, callback = angular.noop) {
      if (isFunction(options)) {
        return $scope.show({}, options)
      }

      options = defaults(options, settings)

      $timeout(() => {
        $element.addClass(options.enterClass)
        $timeout(callback.bind(null), options.during)
      })
    }

    /**
     * 隐藏
     */
    $scope.hide = function (options, callback = angular.noop) {
      if (isFunction(options)) {
        return $scope.hide({}, options)
      }

      options = defaults(options, settings)

      $element.addClass(options.leaveClass)
      $timeout(callback.bind(null), options.during)
    }

    /**
     * 注销
     */
    $scope.dismiss = function () {
      $scope.hide(function () {
        $element.remove()
        $scope.$destroy()
      })
    }

    $scope.$on('$destroy', function () {
      return $element.remove()
    })

    $scope.show(function () {
      setTimeout(function () {
        $scope.hide()
      },
      defaults.delay || 1500)
    })
  }
})

App.provider('$toast', Service)
App.directive('toast', Component)

export default App.name
