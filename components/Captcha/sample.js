import './sample.scss'

import angular from 'angular'
import Component from './index'
import Template from './sample.pug'

export const App = angular.module('QtNgUi.Captcha.Sample', [
  Component
])

App.config(function ($uiCaptchaProvider) {
  $uiCaptchaProvider.configure({
    url: 'https://student-api.61qt.cn/common/captcha'
  })
})

App.directive('captchaSample', () => ({
  restrict: 'EA',
  replace: true,
  transclude: true,
  template: Template
}))

export default App.name
