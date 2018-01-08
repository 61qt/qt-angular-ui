import './stylesheet.scss'

import Remove from 'lodash/remove'
import forEach from 'lodash/forEach'
import isString from 'lodash/isString'
import isInteger from 'lodash/isInteger'
import isFunction from 'lodash/isFunction'
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

class FlashController {
  constructor ($scope) {
    this.$scope = $scope

    $scope.isOpen = false
    $scope.duration = Config.duration
    $scope.delay = Config.delay
    $scope.displayClass = Config.displayClass
    $scope.animationClass = Config.animationClass
  }

  configure ($scope = this.$scope, $element, options) {
    this.$scope = this.$scope
    this.$element = $element

    $scope.duration = isInteger(options.duration) ? options.duration : Config.duration
    $scope.delay = isInteger(options.delay) && options.delay > 0 ? options.delay : Config.delay
    $scope.displayClass = options.displayClass || Config.displayClass
    $scope.animationClass = options.animationClass || Config.animationClass
  }

  show ($scope = this.$scope, $element = this.$element, callback) {
    if ($scope.isOpen === true) {
      return
    }

    setTimeout(() => {
      transitionEnd($element, callback, $scope.duration)
      $element.addClass($scope.animationClass)
      $scope.isOpen = true
    }, 10)

    this.$element.addClass($scope.displayClass)
  }

  hide ($scope = this.$scope, $element = this.$element, callback) {
    if ($scope.isOpen === false) {
      return
    }

    let afterFadeOut = () => {
      this.$element.removeClass($scope.displayClass)
      isFunction(callback) && callback()
    }

    transitionEnd(this.$element, afterFadeOut, $scope.duration)
    this.$element.removeClass($scope.animationClass)
    $scope.isOpen = false
  }

  dismiss ($scope = this.$scope, $element = this.$element, callback) {
    this.hide($scope, $element, function () {
      $element.remove()
      $scope.$destroy()

      isFunction(callback) && callback()
    })
  }
}

const Component = ($document, $alert) => ({
  restrict: 'EA',
  replace: true,
  transclude: true,
  template: Template,
  controller: FlashController,
  controllerAs: '$ctrl',
  scope: {
    options: '=?alertOptions'
  },
  link ($scope, $element, $attr, ctrl, transclude) {
    let defaultSettings = defaults({}, $scope.options, Config)
    ctrl.configure($scope, $element, defaultSettings)

    $scope.type = defaultSettings.type || ''
    $scope.show = ctrl.show.bind(ctrl, $scope, $element)
    $scope.hide = ctrl.hide.bind(ctrl, $scope, $element)
    $scope.dismiss = ctrl.dismiss.bind(ctrl, $scope, $element)

    $scope.$on('$destroy', function () {
      $alert.remove($scope)
      $element.remove()
    })

    $document.ready(function () {
      $scope.show(function () {
        setTimeout($scope.dismiss.bind($scope), $scope.delay)
      })
    })
  }
})

App.provider('$alert', Service)
App.directive('alert', Component)

export default App.name
