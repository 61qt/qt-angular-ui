import './stylesheet.scss'

import Remove from 'lodash/remove'
import forEach from 'lodash/forEach'
import isString from 'lodash/isString'
import defaults from 'lodash/defaults'
import template from 'lodash/template'
import isPlainObject from 'lodash/isPlainObject'
import angular from 'angular'
import { template as AliasTemplate } from './constants'
import { config as Config, FlashController } from '../../controllers/FlashController'
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
      let $alias = angular.element(AlertTemplate)
      let $newScope = $rootScope.$new()

      if (isPlainObject(options)) {
        $newScope.alertOptions = options
      }

      let $element = $compile($alias)($newScope)
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

const Component = ($alert) => ({
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
    let settings = defaults({}, $scope.options, Config)
    ctrl.configure($scope, $element, settings)

    $scope.type = settings.type || ''
    $scope.show = ctrl.show.bind(ctrl, $scope, $element)
    $scope.hide = ctrl.hide.bind(ctrl, $scope, $element)
    $scope.dismiss = ctrl.dismiss.bind(ctrl, $scope, $element)

    $scope.$on('$destroy', function () {
      $alert.remove($scope)
      $element.remove()
    })

    $scope.show(function () {
      setTimeout($scope.dismiss.bind($scope), $scope.delay)
    })
  }
})

App.provider('$alert', Service)
App.directive('alert', Component)

export default App.name
