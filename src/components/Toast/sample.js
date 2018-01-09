import './sample.scss'

import angular from 'angular'
import Component from './index'
import Template from './sample.pug'

export const App = angular.module('QtNgUi.Toast.Sample', [
  Component
])

App.directive('toastSample', ($toast) => ({
  restrict: 'EA',
  replace: true,
  transclude: true,
  template: Template,
  link ($scope) {
    $scope.toast = function (message) {
      $toast.create(message || 'message')
    }
  }
}))

export default App.name
