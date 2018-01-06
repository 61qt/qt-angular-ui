import './stylesheet.scss'
import isEmpty from 'lodash/isEmpty'
import defaults from 'lodash/defaults'
import isFunction from 'lodash/isFunction'
import angular from 'angular'
import imagePlaceholder from './placeholder'
import Template from './template.pug'

const App = angular.module('QtNgUi.Lazier', [])

class Service {
  constructor () {
    this.defaultSettings = {
      placeholder: imagePlaceholder,
      errorholder: imagePlaceholder
    }
  }

  configure (options) {
    this.defaultSettings = defaults(options, this.defaultSettings)
  }

  $get () {
    let openScopes = []
    let $window = angular.element(window)

    $window.on('scroll', () => {
      for (let i = 0, l = openScopes.length; i < l; i++) {
        let ret = openScopes[i].onload(function (error, imageSrc, scope) {
          error && openScopes.push(scope)
        })

        if (ret) {
          openScopes.splice(i, 1)

          i--
          l--
        }
      }
    })

    $window.triggerHandler('scroll')

    return {
      settings: this.defaultSettings,
      bind ($scope) {
        openScopes.push($scope)
        $window.triggerHandler('scroll')
      }
    }
  }
}

const Component = ($lazier) => ({
  restrict: 'AE',
  transclude: true,
  replace: true,
  template: Template,
  require: ['^?ngModel'],
  scope: {
    imageSrc: '=?ngModel'
  },
  link ($scope, $element, $attrs) {
    $scope.state = 'idle'
    $scope.finished = false

    $scope.errorholder = $attrs.errorholder || $lazier.settings.errorholder
    $scope.placeholder = $attrs.placeholder || $lazier.settings.placeholder
    $scope.imageSrc = $scope.imageSrc || $attrs.lazierSrc || ''

    if (isEmpty($scope.imageSrc)) {
      return false
    }

    $scope.onload = function (callback) {
      let element = $element[0]
      let { top, left } = element.getBoundingClientRect()

      if ($scope.finished) {
        return true
      }

      if (top > -element.clientHeight && top < window.innerHeight &&
       left > -element.clientWidth && left < window.innerWidth) {
        $scope.state = 'loading'

        let image = new Image()

        image.onload = function () {
          $scope.state = 'success'
          $scope.finished = true

          isFunction(callback) && callback(null, $scope.imageSrc, $scope)
          $scope.$digest()
        }

        image.onerror = function (error) {
          $scope.state = 'error'
          $scope.finished = true

          isFunction(callback) && callback(error, $scope.imageSrc, $scope)
          $scope.$digest()
        }

        image.src = $scope.imageSrc
        return true
      }

      return false
    }

    $lazier.bind($scope)
  }
})

App.provider('$lazier', Service)
App.directive('lazier', Component)

export default App.name
