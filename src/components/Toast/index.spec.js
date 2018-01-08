/* eslint max-nested-callbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */

import angular from 'angular'
import 'angular-mocks'

import sinon from 'sinon'
import Toast from './index'
import { config as Config } from '../../controllers/FlashController'
import TransitionEnd from '../../share/transitionEnd'

describe('Toast 组件', function () {
  const { module, inject } = angular.mock
  const NEST_CONTENT = 'Message'

  beforeEach(function () {
    // 修改默认配置
    Config.displayClass = 'in-test'
    Config.animationClass = 'fade-test'
    Config.duration = 10
    Config.delay = 20

    // 初始化 Toast 组件
    module(Toast)

    // 清场
    document.body.innerHTML = ''
  })

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(Toast).to.be.a('string')
    })

    it('能进行初始化, 并且能自定义信息', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        let $toast = $compile(`<toast>${NEST_CONTENT}</toast>`)($scope)

        expect($toast.text()).to.equal(NEST_CONTENT)
      })
    })

    it('拥有自己的作用域', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        let $element = $compile(`<toast>${NEST_CONTENT}</toast>`)($scope)
        let $nestScope = angular.element($element[0].childNodes[0]).scope()

        expect($scope.$id).to.not.equal($nestScope.$id)
      })
    })

    it('应该拥有额定的结构', function () {
      inject(function ($rootScope, $compile) {
        let $element = $compile(`<toast>${NEST_CONTENT}</toast>`)($rootScope.$new())
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
        let $element = $compile(`<toast>${NEST_CONTENT}</toast>`)($rootScope.$new())
        angular.element(document.body).append($element)

        let dom = document.getElementsByClassName('toast')
        expect(dom.length).to.equal(1)
        expect(angular.element(dom).text()).to.equal(NEST_CONTENT)

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

  describe('Toast Service', function () {
    it('能淡入到 body 中', function (done) {
      inject(function ($toast) {
        $toast.create(NEST_CONTENT, Config)

        let dom = document.getElementsByClassName('toast')
        expect(dom.length).to.equal(1)
        expect(angular.element(dom).text()).to.equal(NEST_CONTENT)

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

    it('能同时触发', function () {
      inject(function ($toast) {
        $toast.create(NEST_CONTENT)
        $toast.create(NEST_CONTENT)

        let dom = document.getElementsByClassName('toast')
        expect(dom.length).to.equal(2)
      })
    })

    it('删除全部', function (done) {
      inject(function ($toast) {
        $toast.create(NEST_CONTENT)
        $toast.create(NEST_CONTENT)

        let dom = document.getElementsByClassName('toast')
        expect(dom.length).to.equal(2)

        $toast.removeAll()

        let checkEmpty = function () {
          let dom = document.getElementsByClassName('toast')
          expect(dom.length).to.equal(0)
          done()
        }

        let totalSpent = Config.padding + Config.duration + Config.delay + Config.duration + 10
        setTimeout(checkEmpty, totalSpent)
      })
    })

    it('能更改默认值', function (done) {
      module(function ($toastProvider) {
        $toastProvider.configure(Config)
      })

      inject(function ($toast) {
        $toast.create(NEST_CONTENT)

        let dom = document.getElementsByClassName('toast')
        expect(dom.length).to.equal(1)
        expect(angular.element(dom).text()).to.equal(NEST_CONTENT)

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
      inject(function ($toast, $timeout) {
        $toast.create(NEST_CONTENT, { delay: 0 })

        let dom = document.getElementsByClassName('toast')
        expect(dom.length).to.equal(1)

        let $scope = angular.element(dom[0].childNodes[0]).scope()
        expect($scope.delay).to.equal(Config.delay)
      })
    })
  })
})
