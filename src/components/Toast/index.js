import './stylesheet.scss'

import Remove from 'lodash/remove'
import forEach from 'lodash/forEach'
import defaults from 'lodash/defaults'
import isInteger from 'lodash/isInteger'
import isPlainObject from 'lodash/isPlainObject'
import angular from 'angular'
import { FlashController, config as Config } from '../../controllers/FlashController'
import Template from './template.pug'

export const DefaultSettings = defaults({ delay: 2500 }, Config)

const App = angular.module('QtNgUi.Toast', [])

const Service = function () {
  this.openScopes = []
  this.defaultSettings = DefaultSettings

  this.configure = function (options) {
    this.defaultSettings = defaults({}, options, this.defaultSettings)
  }

  this.$get = [
    '$rootScope', '$compile',
    function ($rootScope, $compile) {
      const create = (message, options = this.defaultSettings) => {
        let $newScope = $rootScope.$new()

        if (isPlainObject(options)) {
          $newScope.options = defaults({}, options, this.defaultSettings)
        }

        let $alias = angular.element(`<toast toast-options="options">${message}</toast>`)
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
        forEach(this.openScopes, (scope) => scope.dismiss(true))
      }

      return { create, remove, removeAll }
    }
  ]
}

const Component = [
  '$toast',
  function ($toast) {
    return {
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
        let settings = defaults({}, $scope.options, DefaultSettings)
        ctrl.configure($scope, $element, settings)

        $scope.delay = isInteger(settings.delay) && settings.delay > 0 ? settings.delay : DefaultSettings.delay
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
    }
  }
]

App.provider('$toast', Service)
App.directive('toast', Component)

export default App.name
