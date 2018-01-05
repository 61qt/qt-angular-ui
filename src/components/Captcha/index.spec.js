/* eslint max-nested-acllbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */

import angular from 'angular'
import 'angular-mocks'

import $ from 'jquery'
import Captcha from './index'

/**
 * $('a').click()无效的解决方法
 * @param {element} el
 * clickElement($('a')[0]);
 */
let clickElement = function (el) {
  let ev = document.createEvent('MouseEvent')
  ev.initMouseEvent('click', true, true, window, null, 0, 0, 0, 0, false, false, false, false, 0, null)
  el.dispatchEvent(ev)
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
    it('能够点击刷新图片验证码', function () {
      inject(function ($rootScope, $compile) {
        let $newSopen = $rootScope.$new()
        $newSopen.captcha = CAPTCHAURL
        let $element = $compile('<captcha class="captcha" ng-model="captcha"></captcha>')($newSopen)
        let $scope = $element.children().scope()

        angular.element(document.body).append($element)
        $scope.$digest()
        let $Captcha = $('.captcha')
        let $img = $('.captcha>img')
        let oldCaptcha = $img.attr('src')

        expect(oldCaptcha).to.equal($scope.captcha)

        clickElement($Captcha[0])

        let newCaptcha = $img.attr('src')

        expect(newCaptcha).to.equal($scope.captcha)
        expect(newCaptcha).to.not.equal(oldCaptcha)
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
