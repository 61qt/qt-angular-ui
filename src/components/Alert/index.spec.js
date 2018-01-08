/* eslint max-nested-callbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */

import forEach from 'lodash/forEach'
import angular from 'angular'
import 'angular-mocks'

import sinon from 'sinon'
import Alert from './index'
import { config as Config } from '../../controllers/FlashController'
import TransitionEnd from '../../share/transitionEnd'

describe('Alert 组件', function () {
  const { module, inject } = angular.mock
  const NEST_CONTENT = 'Message'

  beforeEach(function () {
    // 修改默认配置
    Config.displayClass = 'in-test'
    Config.animationClass = 'fade-test'
    Config.duration = 10
    Config.delay = 20

    // 初始化 Alert 组件
    module(Alert)

    // 清场
    document.body.innerHTML = ''
  })

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(Alert).to.be.a('string')
    })

    it('能进行初始化, 并且能自定义信息', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        let $alert = $compile(`<alert>${NEST_CONTENT}</alert>`)($scope)

        expect($alert.text()).to.equal(NEST_CONTENT)
      })
    })

    it('拥有自己的作用域', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        let $element = $compile(`<alert>${NEST_CONTENT}</alert>`)($scope)
        let $nestScope = angular.element($element[0].childNodes[0]).scope()

        expect($scope.$id).to.not.equal($nestScope.$id)
      })
    })

    it('应该拥有额定的结构', function () {
      inject(function ($rootScope, $compile) {
        let $element = $compile(`<alert>${NEST_CONTENT}</alert>`)($rootScope.$new())
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
        let $element = $compile(`<alert>${NEST_CONTENT}</alert>`)($rootScope.$new())
        angular.element(document.body).append($element)

        let dom = document.getElementsByClassName('alert')
        expect(dom.length).to.equal(1)
        expect(angular.element(dom).text()).to.equal(NEST_CONTENT)

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
          expect(angular.element(dom).hasClass(Config.animationClass)).to.be.false
          TransitionEnd(dom, afterDismiss)
        }

        let afterAnimation = function () {
          expect($scope.isOpen).to.be.true
          setTimeout(execDismiss, Config.delay)
        }

        let execAnimation = function () {
          expect($scope.isOpen).to.be.true
          expect(angular.element(dom).hasClass(Config.animationClass)).to.be.true
          TransitionEnd(dom, afterAnimation)
        }

        expect(dom.length).to.equal(1)
        expect(angular.element(dom).hasClass(Config.displayClass)).to.be.true
        setTimeout(execAnimation, Config.padding)
      })
    })
  })

  describe('Alert Service', function () {
    it('能淡入到 body 中', function (done) {
      inject(function ($alert) {
        $alert.create(NEST_CONTENT, Config)

        let dom = document.getElementsByClassName('alert')
        expect(dom.length).to.equal(1)
        expect(angular.element(dom).text()).to.equal(NEST_CONTENT)

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
          expect(angular.element(dom).hasClass(Config.animationClass)).to.be.false
          TransitionEnd(dom, afterDismiss)
        }

        let afterAnimation = function () {
          expect($scope.isOpen).to.be.true
          setTimeout(execDismiss, Config.delay)
        }

        let execAnimation = function () {
          expect($scope.isOpen).to.be.true
          expect(angular.element(dom).hasClass(Config.animationClass)).to.be.true
          TransitionEnd(dom, afterAnimation)
        }

        expect(dom.length).to.equal(1)
        expect(angular.element(dom).hasClass(Config.displayClass)).to.be.true
        setTimeout(execAnimation, Config.padding)
      })
    })

    it('能更改类型(用对象传参)', function () {
      inject(function ($rootScope, $alert) {
        forEach(['correct', 'error', 'info'], function (type) {
          $alert.create(NEST_CONTENT, { type })
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
          $alert.create(NEST_CONTENT, type)

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
        $alert.create(NEST_CONTENT)
        $alert.create(NEST_CONTENT)

        let dom = document.getElementsByClassName('alert')
        expect(dom.length).to.equal(2)
      })
    })

    it('删除全部', function (done) {
      inject(function ($alert) {
        $alert.create(NEST_CONTENT)
        $alert.create(NEST_CONTENT)

        let dom = document.getElementsByClassName('alert')
        expect(dom.length).to.equal(2)

        $alert.removeAll()

        let checkEmpty = function () {
          let dom = document.getElementsByClassName('alert')
          expect(dom.length).to.equal(0)
          done()
        }

        let totalSpent = Config.padding + Config.duration + Config.delay + Config.duration + 10
        setTimeout(checkEmpty, totalSpent)
      })
    })

    it('能更改默认值', function (done) {
      module(function ($alertProvider) {
        $alertProvider.configure(Config)
      })

      inject(function ($alert) {
        $alert.create(NEST_CONTENT)

        let dom = document.getElementsByClassName('alert')
        expect(dom.length).to.equal(1)
        expect(angular.element(dom).text()).to.equal(NEST_CONTENT)

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
          expect(angular.element(dom).hasClass(Config.animationClass)).to.be.false
          TransitionEnd(dom, afterDismiss)
        }

        let afterAnimation = function () {
          expect($scope.isOpen).to.be.true
          setTimeout(execDismiss, Config.delay)
        }

        let execAnimation = function () {
          expect($scope.isOpen).to.be.true
          expect(angular.element(dom).hasClass(Config.animationClass)).to.be.true
          TransitionEnd(dom, afterAnimation)
        }

        expect(dom.length).to.equal(1)
        expect(angular.element(dom).hasClass(Config.displayClass)).to.be.true
        setTimeout(execAnimation, Config.padding)
      })
    })

    it('会过滤 delay 为 0 时的情况', function () {
      inject(function ($alert, $timeout) {
        $alert.create(NEST_CONTENT, { delay: 0 })

        let dom = document.getElementsByClassName('alert')
        expect(dom.length).to.equal(1)

        let $scope = angular.element(dom[0].childNodes[0]).scope()
        expect($scope.delay).to.equal(Config.delay)
      })
    })
  })
})
