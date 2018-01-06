import './sample.scss'

import angular from 'angular'
import Component from './index'
import Template from './sample.pug'

export const App = angular.module('QtNgUi.Switch.Sample', [
  Component
])

App.directive('switchSample', () => ({
  restrict: 'EA',
  replace: true,
  transclude: true,
  template: Template
}))

export default App.name
