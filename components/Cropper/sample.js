import './sample.scss'

import angular from 'angular'
import Component from './index'
import Alert from '../Alert'
import Template from './sample.pug'

export const App = angular.module('QtNgUi.Cropper.Sample', [
  Alert,
  Component
])

App.provider('cropperInterceptor', function () {
  this.$get = [
    '$alert',
    function ($alert) {
      const notify = () => $alert.create('因为实例无法并不能获取TOKEN 所以不能上传')
      const upload = (file, options, callback) => callback(null, true)

      return { notify, upload }
    }
  ]
})

App.directive('cropperSample', () => ({
  restrict: 'EA',
  replace: true,
  transclude: true,
  template: Template,
  link ($scope) {
    $scope.image = require('./images/avatar.png')
  }
}))

export default App.name
