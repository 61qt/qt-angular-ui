/* eslint max-nested-callbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */

import defaults from 'lodash/defaults'
import forEach from 'lodash/forEach'
import angular from 'angular'
import 'angular-mocks'

import sinon from 'sinon'
import Alert, { DefaultSettings } from './index'
import TransitionEnd from '../../share/transitionEnd'

describe('Alert 组件', function () {
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
    // 初始化 Alert 组件
    module(Alert)
  })

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(Alert).to.be.a('string')
    })

    it('能进行初始化, 并且能自定义信息', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        let $alert = $compile(`<alert>${Content}</alert>`)($scope)

        expect($alert.text()).to.equal(Content)
      })
    })

    it('拥有自己的作用域', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        let $element = $compile(`<alert>${Content}</alert>`)($scope)
        let $nestScope = angular.element($element[0].childNodes[0]).scope()

        expect($scope.$id).to.not.equal($nestScope.$id)
      })
    })

    it('应该拥有额定的结构', function () {
      inject(function ($rootScope, $compile) {
        let $element = $compile(`<alert>${Content}</alert>`)($rootScope.$new())
        let $scope = angular.element($element[0].childNodes[0]).scope()

        expect($scope.type).to.be.a('string')
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

        let $element = $compile(`<alert alert-options="options">${Content}</alert>`)($newScope)
        angular.element(document.body).append($element)

        let dom = document.getElementsByClassName('alert')
        expect(dom.length).to.equal(1)
        expect(angular.element(dom).text()).to.equal(Content)

        let $scope = angular.element(dom[0].childNodes[0]).scope()
        sinon.spy($scope, 'dismiss')

        expect($scope.isOpen).to.be.false

        let afterDismiss = function () {
          let dom = document.getElementsByClassName('alert')
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
      let $alertProvider

      module(function (_$alertProvider_) {
        $alertProvider = _$alertProvider_
        $alertProvider.configure(FakeSettings)
      })

      inject(function ($alert) {
        $alert.create(Content)

        expect($alertProvider.defaultSettings.displayClass).to.equal(FakeSettings.displayClass)
        expect($alertProvider.defaultSettings.animationClass).to.equal(FakeSettings.animationClass)
        expect($alertProvider.defaultSettings.duration).to.equal(FakeSettings.duration)
        expect($alertProvider.defaultSettings.delay).to.equal(FakeSettings.delay)
      })
    })

    describe('服务运行', function () {
      beforeEach(function () {
        module(function ($alertProvider) {
          $alertProvider.configure(FakeSettings)
        })
      })

      it('能淡入到 body 中', function () {
        inject(function ($alert) {
          $alert.create(Content, FakeSettings)

          let dom = document.getElementsByClassName('alert')
          expect(dom.length).to.equal(1)
          expect(angular.element(dom).text()).to.equal(Content)
        })
      })

      it('能更改类型(用对象传参)', function () {
        inject(function ($rootScope, $alert) {
          forEach(['correct', 'error', 'info'], function (type) {
            $alert.create(Content, { type })
            $rootScope.$digest()

            let dom = document.getElementsByClassName('alert')
            expect(dom.length).to.equal(1)

            let scope = angular.element(dom[0].childNodes[0]).scope()
            expect(scope.type).to.equal(type)

            let tDom = document.getElementsByClassName(type)
            expect(tDom.length).to.equal(1)

            document.body.innerHTML = ''
          })
        })
      })

      it('能更改类型(用字符串传参)）', function () {
        inject(function ($alert) {
          forEach(['correct', 'info', 'error'], function (type) {
            $alert.create(Content, type)

            let dom = document.getElementsByClassName('alert')
            expect(dom.length).to.equal(1)

            let scope = angular.element(dom[0].childNodes[0]).scope()
            expect(scope.type).to.equal(type)

            let tDom = document.getElementsByClassName(type)
            expect(tDom.length).to.equal(1)

            document.body.innerHTML = ''
          })
        })
      })

      it('能同时触发', function () {
        inject(function ($alert) {
          $alert.create(Content)
          $alert.create(Content)

          let dom = document.getElementsByClassName('alert')
          expect(dom.length).to.equal(2)
        })
      })

      it('删除全部', function (done) {
        inject(function ($alert) {
          $alert.create(Content)
          $alert.create(Content)

          let dom = document.getElementsByClassName('alert')
          expect(dom.length).to.equal(2)

          $alert.removeAll()

          let checkEmpty = function () {
            let dom = document.getElementsByClassName('alert')
            expect(dom.length).to.equal(0)
            done()
          }

          let totalSpent = FakeSettings.padding + FakeSettings.duration + FakeSettings.delay + FakeSettings.duration + 10
          setTimeout(checkEmpty, totalSpent)
        })
      })

      it('会过滤 delay 为 0 时的情况', function () {
        inject(function ($alert) {
          $alert.create(Content, { delay: 0 })

          let dom = document.getElementsByClassName('alert')
          expect(dom.length).to.equal(1)

          let $scope = angular.element(dom[0].childNodes[0]).scope()
          expect($scope.delay).to.equal(DefaultSettings.delay)
        })
      })
    })
  })
})
