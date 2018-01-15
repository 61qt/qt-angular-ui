import './stylesheet.scss'

import angular from 'angular'
import Template from './template.pug'

const App = angular.module('QtNgUi.Spinner', [])

const Component = () => ({
  restrict: 'E',
  replace: true,
  template: Template
})

App.directive('spinner', Component)

export default App.name
