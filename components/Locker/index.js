import './stylesheet.scss'

import defaults from 'lodash/defaults'
import angular from 'angular'
import Spinner from '../Spinner'
import { FlashController, config as Config } from '../../controllers/FlashController'
import Template from './template.pug'

export const DefaultSettings = defaults({ content: '努力加载中' }, Config)

const App = angular.module('QtNgUi.Locker', [
  Spinner
])

const Service = function () {
  this.defaultSettings = DefaultSettings

  this.configure = function (options) {
    this.defaultSettings = defaults({}, options, this.defaultSettings)
  }

  this.$get = function ($rootScope, $compile) {
    'ngInject'

    let $newScope = $rootScope.$new()
    $newScope.options = this.defaultSettings

    let $component = $compile('<locker locker-options="options"></locker>')($newScope)
    let $scope = $component.children().scope()

    angular.element(document.body).append($component)

    const show = function (options, callback) {
      $scope.show(options, callback)
    }

    const hide = function (options, callback) {
      $scope.hide(options, callback)
    }

    return { show, hide }
  }
}

const Component = function ($timeout) {
  'ngInject'

  return {
    restrict: 'E',
    replace: true,
    template: Template,
    controller: FlashController,
    controllerAs: '$ctrl',
    scope: {
      options: '=?lockerOptions'
    },
    link ($scope, $element, $attr, ctrl) {
      let settings = defaults({}, $scope.options, DefaultSettings)
      ctrl.configure($scope, $element, settings)

      $scope.content = settings.content
      $scope.show = ctrl.show.bind(ctrl, $scope, $element)
      $scope.hide = ctrl.hide.bind(ctrl, $scope, $element)
      $scope.dismiss = ctrl.dismiss.bind(ctrl, $scope, $element)
    }
  }
}

App.provider('$locker', Service)
App.directive('locker', Component)

export default App.name
