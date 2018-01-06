import './sample.scss'

import angular from 'angular'
import Component from './index'
import Template from './sample.pug'

export const App = angular.module('QtNgUi.Locker.Sample', [
  Component
])

App.directive('lockerSample', ($locker) => ({
  restrict: 'EA',
  replace: true,
  transclude: true,
  template: Template,
  link ($scope) {
    $scope.lock = function (message) {
      $locker.show('努力加载中')
      setTimeout(() => $locker.hide(), 3000)
    }
  }
}))

export default App.name
