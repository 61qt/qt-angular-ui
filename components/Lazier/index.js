import './stylesheet.scss'
import chunk from 'lodash/chunk'
import forEach from 'lodash/forEach'
import indexOf from 'lodash/indexOf'
import defaults from 'lodash/defaults'
import isFunction from 'lodash/isFunction'
import angular from 'angular'
import imagePlaceholder from './placeholder'
import Template from './template.pug'

const App = angular.module('QtNgUi.Lazier', [])

class Service {
  constructor () {
    this.list = []
    this.defaultSettings = {
      placeholder: imagePlaceholder,
      errorholder: imagePlaceholder
    }

    angular.element(window).on('scroll', this.scroll.bind(this))
  }

  configure (options) {
    this.defaultSettings = defaults(options, this.defaultSettings)
  }

  scroll () {
    forEach(chunk(this.list, 2), ([_, handle]) => {
      isFunction(handle) && handle()
    })
  }

  $get () {
    let list = this.list
    let settings = this.defaultSettings
    let scroll = this.scroll.bind(this)

    let onView = (scope, handle) => {
      offView(scope)

      handle = handle.bind(null, offView.bind(null, scope))
      list.push(scope, handle)
      this.scroll()
    }

    let offView = (scope) => {
      let index = indexOf(list, scope)
      index !== -1 && list.splice(index, 2)
    }

    return { settings, onView, offView, scroll }
  }
}

class Controller {
  constructor ($scope, $lazier) {
    this.$scope = $scope

    $scope.state = 'idle'
    $scope.finished = false

    let { errorholder, placeholder } = $lazier.settings
    $scope.errorholder = errorholder
    $scope.placeholder = placeholder
  }

  inScreen ($element) {
    let element = $element[0]
    let { top, left } = element.getBoundingClientRect()
    return top > -element.clientHeight && top < window.innerHeight && left > -element.clientWidth && left < window.innerWidth
  }

  load ($scope = this.$scope, $element, callback) {
    $scope.state = 'loading'

    let image = new window.Image()
    image.onload = function () {
      $scope.state = 'success'
      $scope.finished = true

      isFunction(callback) && callback(null, $scope.image)
    }

    image.onerror = function (error) {
      $scope.state = 'error'
      $scope.finished = true

      isFunction(callback) && callback(error)
    }

    image.src = $scope.image
  }
}

const Component = ($lazier) => ({
  restrict: 'EA',
  transclude: true,
  replace: true,
  template: Template,
  controller: Controller,
  controllerAs: '$ctrl',
  scope: {
    image: '=?ngSrc'
  },
  link ($scope, $element, $attrs, ctrl) {
    let { errorholder, placeholder } = $lazier.settings
    $scope.errorholder = $attrs.errorholder || errorholder
    $scope.placeholder = $attrs.placeholder || placeholder

    $scope.$watch('image', function (nextValue, prevValue) {
      $scope.state = 'idle'
      $scope.finished = false

      $lazier.onView($scope, function (done) {
        if ($scope.finished === true) {
          done(null)
          return
        }

        ctrl.inScreen($element) && ctrl.load($scope, $element, done)
      })
    })
  }
})

App.provider('$lazier', Service)
App.directive('lazier', Component)

export default App.name
