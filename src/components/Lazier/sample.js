import './sample.scss'

import map from 'lodash/map'
import angular from 'angular'
import Component from './index'
import Template from './sample.pug'

export const App = angular.module('QtNgUi.Lazier.Sample', [
  Component
])

App.directive('lazierSample', () => ({
  restrict: 'EA',
  replace: true,
  transclude: true,
  template: Template,
  link ($scope) {
    $scope.images = map(new Array(100), (_, no) => `//lorempixel.com/1024/768/food/?v=${no}`)
  }
}))

export default App.name
