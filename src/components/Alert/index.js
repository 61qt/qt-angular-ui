import './stylesheet.scss'

import Remove from 'lodash/remove'
import forEach from 'lodash/forEach'
import isString from 'lodash/isString'
import defaults from 'lodash/defaults'
import template from 'lodash/template'
import isPlainObject from 'lodash/isPlainObject'
import angular from 'angular'
import {
  config as Config,
  template as AliasTemplate
} from './constants'
import transitionEnd from '../../share/transitionEnd'
import Template from './template.pug'

const App = angular.module('QtNgUi.Alert', [])

class Service {
  constructor () {
    this.openScopes = []
    this.defaultSettings = Config
  }

  configure (options) {
    this.defaultSettings = defaults({}, options, Config)
  }

  $get ($rootScope, $compile) {
    const create = (message, options = this.defaultSettings) => {
      if (isString(options)) {
        return create(message, { type: options })
      }

      let AlertTemplate = template(AliasTemplate)({ message })
      let $alert = angular.element(AlertTemplate)
      let $newScope = $rootScope.$new()

      if (isPlainObject(options)) {
        $newScope.alertOptions = options
      }

      let $element = $compile($alert)($newScope)
      let $scope = angular.element($element[0].childNodes[0]).scope()
      angular.element(document.body).append($element)

      !$scope.$$phase && !$scope.$root.$$phase && $scope.$digest()
      this.openScopes.push($scope)
    }

    const remove = (scope) => {
      Remove(this.openScopes, ($scope) => $scope === scope)
    }

    const removeAll = () => {
      forEach(this.openScopes, (scope) => scope.dismiss())
    }

    return { create, remove, removeAll }
  }
}

const Component = ($timeout, $alert) => ({
  restrict: 'EA',
  replace: true,
  transclude: true,
  template: Template,
  scope: {
    options: '=?alertOptions'
  },
  link ($scope, $element, $attr, ctrl, transclude) {
    let defaultSettings = defaults({}, $scope.options, Config)
    let transitionEndInstance

    $scope.isOpen = false
    $scope.type = defaultSettings.type || ''
    $scope.during = defaultSettings.during || Config.during
    $scope.delay = defaultSettings.delay || Config.delay
    $scope.fadeClass = defaultSettings.fadeClass
    $scope.openClass = defaultSettings.openClass

    $scope.show = (callback) => {
      if ($scope.isOpen === true) {
        return
      }

      setTimeout(() => {
        transitionEndInstance && transitionEndInstance.remove()
        transitionEndInstance = transitionEnd($element, callback, $scope.during)

        $element.addClass($scope.fadeClass)
        $scope.isOpen = true
      })

      $element.addClass($scope.openClass)
    }

    $scope.hide = (callback) => {
      if ($scope.isOpen === false) {
        return
      }

      transitionEndInstance && transitionEndInstance.remove()
      transitionEndInstance = transitionEnd($element, () => {
        $element.removeClass($scope.openClass)
        callback()
      }, $scope.during)

      $element.removeClass($scope.fadeClass)
      $scope.isOpen = false
    }

    $scope.dismiss = () => {
      $scope.hide(function () {
        $element.remove()
        $scope.$destroy()
      })
    }

    $scope.$on('$destroy', () => {
      $alert.remove($scope)
      $element.remove()
    })

    $scope.show(() => {
      setTimeout(() => $scope.dismiss(), $scope.delay)
    })
  }
})

App.provider('$alert', Service)
App.directive('alert', Component)

export default App.name
