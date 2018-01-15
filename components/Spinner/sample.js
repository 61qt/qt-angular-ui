import './sample.scss'

import angular from 'angular'
import Component from './index'
import Template from './sample.pug'

export const App = angular.module('QtNgUi.Spinner.Sample', [
  Component
])

App.directive('spinnerSample', () => ({
  restrict: 'EA',
  replace: true,
  transclude: true,
  template: Template
}))

export default App.name
