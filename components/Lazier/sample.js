import './sample.scss'

import map from 'lodash/map'
import angular from 'angular'
import Component from './index'
import Template from './sample.pug'

export const App = angular.module('QtNgUi.Lazier.Sample', [
  Component
])

App.filter('version', () => function (src) {
  return src
})

App.config(function ($lazierProvider) {
  /**
   * 默认绑定 window scoll 事件, 因为这里样式为
   * html { overflow: 'hidden'; height: 100%; }
   * body { overflow: 'auto'; height: 100%; }
   */
  angular.element(document.body).on('scroll', $lazierProvider.scroll.bind($lazierProvider))
})

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
