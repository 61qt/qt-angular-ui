/* eslint max-nested-acllbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */

import angular from 'angular'
import 'angular-mocks'

import Captcha from './index'

const clickElement = function (el) {
  let event = document.createEvent('MouseEvent')
  event.initMouseEvent('click', true, true, window, null, 0, 0, 0, 0, false, false, false, false, 0, null)
  el.dispatchEvent(event)
}

describe('Captcha 组件', function () {
  const { module, inject } = angular.mock
  const CAPTCHAURL = '//student-api.61qt.cn/common/captcha'
  const CAPTCHAURLREGEXP = new RegExp(CAPTCHAURL + '\\?v=')

  beforeEach(function () {
    /* eslint no-undef:0 */
    angular.env = {
      QT_UI_LOG: false
    }

    // 初始化 Captcha 组件
    module(Captcha)

    // 清场
    document.body.innerHTML = ''
  })

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(Captcha).to.be.a('string')
    })

    it('能进行初始化', function () {
      inject(function ($rootScope, $compile) {
        let $newSopen = $rootScope.$new()
        $newSopen.captcha = CAPTCHAURL
        let $element = $compile('<captcha ng-model="captcha"></captcha>')($newSopen)
        let $scope = $element.children().scope()

        expect(CAPTCHAURLREGEXP.test($scope.captcha)).to.be.true
      })
    })

    it('应该拥有额定的结构', function () {
      inject(function ($rootScope, $compile) {
        let $element = $compile('<captcha></captcha>')($rootScope.$new())
        let $scope = angular.element($element[0].childNodes[0]).scope()

        expect($scope.captcha).to.be.a('string')
        expect($scope.changeCaptcha).to.be.a('function')
        expect($scope.$$listenerCount['captcha.change']).to.be.a('number')
        expect($scope.$$listenerCount.$destroy).to.be.a('number')
      })
    })
  })

  describe('触发流程', function () {
    it('能够点击刷新图片验证码', function (done) {
      inject(function ($rootScope, $compile) {
        let $newSopen = $rootScope.$new()
        $newSopen.captcha = CAPTCHAURL

        let $element = $compile('<captcha class="captcha" ng-model="captcha"></captcha>')($newSopen)
        let $scope = $element.children().scope()

        angular.element(document.body).append($element)
        $scope.$digest()

        let captcha = document.getElementsByClassName('captcha')
        let captchaImage = angular.element(captcha).find('img')
        let oldCaptcha = captchaImage.attr('src')

        expect(oldCaptcha).to.equal($scope.captcha)

        clickElement(captcha[0])

        setTimeout(function () {
          let newCaptcha = captchaImage.attr('src')
          expect(newCaptcha).to.equal($scope.captcha)
          expect(newCaptcha).to.not.equal(oldCaptcha)
          done()
        }, 10)
      })
    })

    it('能够接收广播', function (done) {
      inject(function ($rootScope, $compile, $timeout) {
        let $newSopen = $rootScope.$new()
        $newSopen.captcha = CAPTCHAURL

        let $element = $compile('<captcha class="captcha" ng-model="captcha"></captcha>')($newSopen)
        let $scope = $element.children().scope()
        let $parentScope = $element.scope()

        angular.element(document.body).append($element)

        let captcha = $scope.captcha

        let broadcast = function () {
          $parentScope.$broadcast('captcha.change')

          expect(captcha).to.not.equal($scope.captcha)
          done()
        }

        $timeout.flush()
        setTimeout(broadcast, 1)
      })
    })
  })

  describe('服务', function () {
    it('能够配置', function () {
      module(function ($uiCaptchaProvider) {
        $uiCaptchaProvider.configure({
          url: CAPTCHAURL
        })
      })

      inject(function ($uiCaptcha) {
        expect($uiCaptcha.settings.url).to.equal(CAPTCHAURL)
      })
    })

    it('没配置提示', function () {
      /* eslint no-undef:0 */
      angular.env = {
        QT_UI_LOG: true
      }

      inject(function ($uiCaptcha) {
        expect($uiCaptcha.settings.url).to.equal('')
      })
    })

    it('刷新地址为空返回空值', function () {
      inject(function ($uiCaptcha) {
        expect($uiCaptcha.$change('')).to.equal('')
      })
    })
  })
})
