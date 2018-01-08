import './stylesheet.scss'

import Remove from 'lodash/remove'
import forEach from 'lodash/forEach'
import defaults from 'lodash/defaults'
import isPlainObject from 'lodash/isPlainObject'
import angular from 'angular'
import { FlashController, config as Config } from '../../controllers/FlashController'
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

  $get ($rootScope, $compile) {
    const create = (message, options = this.defaultSettings) => {
      let $alias = angular.element(`<toast>${message}</toast>`)
      let $newScope = $rootScope.$new()

      if (isPlainObject(options)) {
        $newScope.toastOptions = options
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

const Component = ($toast) => ({
  restrict: 'EA',
  replace: true,
  transclude: true,
  template: Template,
  controller: FlashController,
  controllerAs: '$ctrl',
  scope: {
    options: '=?toastOptions'
  },
  link ($scope, $element, $attr, ctrl) {
    let settings = defaults({}, $scope.options, Config)
    ctrl.configure($scope, $element, settings)

    $scope.show = ctrl.show.bind(ctrl, $scope, $element)
    $scope.hide = ctrl.hide.bind(ctrl, $scope, $element)
    $scope.dismiss = ctrl.dismiss.bind(ctrl, $scope, $element)

    $scope.$on('$destroy', function () {
      $toast.remove($scope)
      $element.remove()
    })

    $scope.show(function () {
      setTimeout($scope.dismiss.bind($scope), $scope.delay)
    })
  }
})

App.provider('$toast', Service)
App.directive('toast', Component)

export default App.name
