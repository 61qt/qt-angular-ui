import './sample.scss'

import angular from 'angular'
import Component from './index'
import Template from './sample.pug'

export const App = angular.module('QtNgUi.Alert.Sample', [
  Component
])

App.directive('alertSample', ($alert) => ({
  restrict: 'EA',
  replace: true,
  transclude: true,
  template: Template,
  link ($scope) {
    $scope.alert = function (message) {
      $alert.create(message || 'message')
    }
  }
}))

export default App.name
