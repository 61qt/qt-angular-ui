/* eslint max-nested-callbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */

import defaults from 'lodash/defaults'
import angular from 'angular'
import 'angular-mocks'

import sinon from 'sinon'
import Toast, { DefaultSettings } from './index'
import TransitionEnd from '../../share/transitionEnd'

describe('Toast 组件', function () {
  const { module, inject } = angular.mock
  const Content = 'Message'
  const FakeSettings = defaults({
    displayClass: 'in-test',
    animationClass: 'fade-test',
    padding: 10,
    duration: 10,
    delay: 20
  }, DefaultSettings)

  beforeEach(function () {
    // 清场
    document.body.innerHTML = ''
    // 初始化 Toast 组件
    module(Toast)
  })

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(Toast).to.be.a('string')
    })

    it('能进行初始化, 并且能自定义信息', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        let $toast = $compile(`<toast>${Content}</toast>`)($scope)

        expect($toast.text()).to.equal(Content)
      })
    })

    it('拥有自己的作用域', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        let $element = $compile(`<toast>${Content}</toast>`)($scope)
        let $nestScope = angular.element($element[0].childNodes[0]).scope()

        expect($scope.$id).to.not.equal($nestScope.$id)
      })
    })

    it('应该拥有额定的结构', function () {
      inject(function ($rootScope, $compile) {
        let $element = $compile(`<toast>${Content}</toast>`)($rootScope.$new())
        let $scope = angular.element($element[0].childNodes[0]).scope()

        expect($scope.show).to.be.a('function')
        expect($scope.hide).to.be.a('function')
        expect($scope.dismiss).to.be.a('function')
        expect($scope.isOpen).to.be.a('boolean')
      })
    })
  })

  describe('触发流程', function () {
    it('能够自动完成淡入淡出', function (done) {
      inject(function ($rootScope, $compile) {
        let $newScope = $rootScope.$new()
        $newScope.options = FakeSettings

        let $element = $compile(`<toast toast-options="options">${Content}</toast>`)($newScope)
        angular.element(document.body).append($element)

        let dom = document.getElementsByClassName('toast')
        expect(dom.length).to.equal(1)
        expect(angular.element(dom).text()).to.equal(Content)

        let $scope = angular.element(dom[0].childNodes[0]).scope()
        sinon.spy($scope, 'dismiss')

        expect($scope.isOpen).to.be.false

        let afterDismiss = function () {
          let dom = document.getElementsByClassName('toast')
          expect($scope.dismiss.calledOnce).to.be.true
          expect(dom.length).to.equal(0)
          done()
        }

        let execDismiss = function () {
          expect($scope.isOpen).to.be.false
          expect(dom.length).to.equal(1)
          expect(angular.element(dom).hasClass(FakeSettings.animationClass)).to.be.false
          TransitionEnd(dom, afterDismiss)
        }

        let afterAnimation = function () {
          expect($scope.isOpen).to.be.true
          setTimeout(execDismiss, FakeSettings.delay)
        }

        let execAnimation = function () {
          expect($scope.isOpen).to.be.true
          expect(angular.element(dom).hasClass(FakeSettings.animationClass)).to.be.true
          TransitionEnd(dom, afterAnimation)
        }

        expect(dom.length).to.equal(1)
        expect(angular.element(dom).hasClass(FakeSettings.displayClass)).to.be.true
        setTimeout(execAnimation, FakeSettings.padding)
      })
    })
  })

  describe('全局服务', function () {
    it('能更改默认值', function () {
      let $toastProvider

      module(function (_$toastProvider_) {
        $toastProvider = _$toastProvider_
        $toastProvider.configure(FakeSettings)
      })

      inject(function ($toast) {
        $toast.create(Content)

        expect($toastProvider.defaultSettings.displayClass).to.equal(FakeSettings.displayClass)
        expect($toastProvider.defaultSettings.animationClass).to.equal(FakeSettings.animationClass)
        expect($toastProvider.defaultSettings.duration).to.equal(FakeSettings.duration)
        expect($toastProvider.defaultSettings.delay).to.equal(FakeSettings.delay)
      })
    })

    describe('服务运行', function () {
      beforeEach(function () {
        module(function ($toastProvider) {
          $toastProvider.configure(FakeSettings)
        })
      })

      it('能淡入到 body 中', function () {
        inject(function ($toast) {
          $toast.create(Content, FakeSettings)

          let dom = document.getElementsByClassName('toast')
          expect(dom.length).to.equal(1)
          expect(angular.element(dom).text()).to.equal(Content)
        })
      })

      it('能同时触发', function () {
        inject(function ($toast) {
          $toast.create(Content)
          $toast.create(Content)

          let dom = document.getElementsByClassName('toast')
          expect(dom.length).to.equal(2)
        })
      })

      it('删除全部', function (done) {
        inject(function ($toast) {
          $toast.create(Content)
          $toast.create(Content)

          let dom = document.getElementsByClassName('toast')
          expect(dom.length).to.equal(2)

          $toast.removeAll()

          let checkEmpty = function () {
            let dom = document.getElementsByClassName('toast')
            expect(dom.length).to.equal(0)
            done()
          }

          let totalSpent = FakeSettings.padding + FakeSettings.duration + FakeSettings.delay + FakeSettings.duration + 10
          setTimeout(checkEmpty, totalSpent)
        })
      })

      it('会过滤 delay 为 0 时的情况', function () {
        inject(function ($toast) {
          $toast.create(Content, { delay: 0 })

          let dom = document.getElementsByClassName('toast')
          expect(dom.length).to.equal(1)

          let $scope = angular.element(dom[0].childNodes[0]).scope()
          expect($scope.delay).to.equal(DefaultSettings.delay)
        })
      })
    })
  })
})
