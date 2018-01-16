import defaults from 'lodash/defaults'
import angular from 'angular'
import Template from './template.pug'

const App = angular.module('QtNgUi.Captcha', [])

const confilt = function (captcha) {
  return captcha.replace(/\?([\w\W]+?)$/, '') + `?v=${Date.now()}`
}

const Service = function () {
  this.defaultSettings = { url: '' }

  this.configure = function (options) {
    this.defaultSettings = defaults({}, options, this.defaultSettings)
  }

  this.$get = function () {
    const ArrayProps = Array.prototype
    const defaultSettings = this.defaultSettings

    class Captcha {
      constructor (options) {
        ArrayProps.push.call(this)

        this.settings = defaults({}, options, defaultSettings)

        if (window.angular && window.angular.env && window.angular.env.QT_UI_LOG && !defaultSettings.url) {
          window.console.error('[qt-angular-ui]尚未进行 Captcha 的配置，请查看 qt-angular-ui/src/captcha/README.md 进行配置')
        }

        this.captcha = this.change()
      }

      $add (openScope) {
        ArrayProps.push.call(this, openScope)

        openScope.$on('$destroy', () => {
          let index = ArrayProps.indexOf.call(this, openScope)
          index !== -1 && ArrayProps.splice.call(this, index, 1)
        })
      }

      $change (captcha) {
        if (arguments.length > 0) {
          return captcha ? confilt(captcha) : ''
        }

        let opts = this.settings
        return opts.url ? confilt(opts.url) : ''
      }

      change () {
        this.captcha = this.$change()

        ArrayProps.forEach.call(this, (openScope) => {
          openScope.captcha = this.captcha
        })
      }
    }

    return new Captcha()
  }
}

const Captcha = [
  '$uiCaptcha',
  function ($uiCaptcha) {
    return {
      restrict: 'EA',
      replace: true,
      template: Template,
      scope: {
        captcha: '=?ngModel'
      },
      link ($scope, $element) {
        if (angular.isString($scope.captcha) && $scope.captcha) {
          $scope.captcha = $uiCaptcha.$change($scope.captcha)

          $scope.changeCaptcha = function () {
            $scope.captcha = $uiCaptcha.$change($scope.captcha)
          }
        } else {
          $uiCaptcha.$add($scope)
          $scope.captcha = $uiCaptcha.url

          $scope.changeCaptcha = function () {
            $uiCaptcha.change()
          }
        }

        $element.on('click', function () {
          $scope.changeCaptcha()
          $scope.$digest()
        })

        $scope.$on('captcha.change', function () {
          $scope.changeCaptcha()
        })

        $scope.changeCaptcha()
      }
    }
  }
]

App.provider('$uiCaptcha', Service)
App.directive('captcha', Captcha)

export default App.name
