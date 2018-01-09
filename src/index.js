import './index.scss'

import map from 'lodash/map'
import angular from 'angular'
import uiRouter from '@uirouter/angularjs'
import Alert from './components/Alert/sample'
import Calendar from './components/Calendar/sample'
import Captcha from './components/Captcha/sample'
import Checkbox from './components/Checkbox/sample'
import Cropper from './components/Cropper/sample'
import Lazier from './components/Lazier/sample'
import Locker from './components/Locker/sample'
import Radio from './components/Radio/sample'
import Spinner from './components/Spinner/sample'
import Switch from './components/Switch/sample'
import Toast from './components/Toast/sample'
import Tempalte from './navigation.pug'

export const App = angular.module('App', [
  uiRouter,
  Alert,
  Calendar,
  Captcha,
  Checkbox,
  Cropper,
  Lazier,
  Locker,
  Radio,
  Spinner,
  Switch,
  Toast
])

App.config(function ($stateProvider) {
  $stateProvider
    .state('home', { url: '', template: '<div class="home-sample"><a class="btn" href="https://github.com/61qt/qt-angular-ui">Home Page</a></div>' })
    .state('alert', { url: '/alert/', template: '<alert-sample/>' })
    .state('calendar', { url: '/calendar/', template: '<calendar-sample/>' })
    .state('captcha', { url: '/captcha/', template: '<captcha-sample/>' })
    .state('checkbox', { url: '/checkbox/', template: '<checkbox-sample/>' })
    .state('cropper', { url: '/cropper/', template: '<cropper-sample/>' })
    .state('lazier', { url: '/lazier/', template: '<lazier-sample/>' })
    .state('locker', { url: '/locker/', template: '<locker-sample/>' })
    .state('radio', { url: '/radio/', template: '<radio-sample/>' })
    .state('spinner', { url: '/spinner/', template: '<spinner-sample/>' })
    .state('switch', { url: '/switch/', template: '<switch-sample/>' })
    .state('toast', { url: '/toast/', template: '<toast-sample/>' })
})

App.directive('navigation', ($compile, $state) => ({
  restrict: 'EA',
  replace: true,
  transclude: true,
  template: Tempalte,
  controller ($scope) {
    $scope.isOpen = false

    $scope.toggle = () => {
      $scope.isOpen = !$scope.isOpen
    }
  },
  link ($scope, $element) {
    let templates = map($state.get().splice(1), ({ name, url }) => {
      let nameName = name.substr(0, 1).toUpperCase() + name.substr(1)
      return `<a ui-sref="${name}" ng-click="toggle()">${nameName}</a>`
    })

    let $items = $compile(templates.join(''))($scope)
    $element.find('ng-transclude').append($items)
  }
}))

angular.element(() => angular.bootstrap(document, [App.name]))

export default App.name
