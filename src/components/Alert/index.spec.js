/* eslint max-nested-callbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */

import forEach from 'lodash/forEach'
import angular from 'angular'
import 'angular-mocks'

import sinon from 'sinon'
import $ from 'jquery'
import Alert from './index'
import { config as Config } from './constants'

describe('Alert 组件', function () {
  const { module, inject } = angular.mock
  const NEST_CONTENT = 'Message'

  beforeEach(function () {
    // 设置延迟消失时间为 0
    Config.during = 10
    Config.delay = 10

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
      this.timeout(1000)

      inject(function ($rootScope, $compile) {
        let $element = $compile(`<alert>${NEST_CONTENT}</alert>`)($rootScope.$new())
        let $scope = angular.element($element[0].childNodes[0]).scope()

        // 监听事件
        sinon.spy($scope, 'dismiss')
        sinon.spy($scope, 'hide')

        angular.element(document.body).append($element)

        expect($scope.isOpen).to.be.false
        expect(document.getElementsByClassName('alert').length).to.equal(1)

        let dismissCompleted = function () {
          expect(document.getElementsByClassName('alert').length).to.equal(0)

          done()
        }

        let hideCompleted = function () {
          expect($scope.dismiss.calledOnce).to.be.true
          expect($scope.hide.calledOnce).to.be.true
          expect($scope.isOpen).to.be.false

          setTimeout(dismissCompleted, Config.during)
        }

        let delayCompleted = function () {
          expect($scope.isOpen).to.be.true

          setTimeout(hideCompleted, Config.during)
        }

        let showCompleted = function () {
          expect($scope.isOpen).to.be.true

          setTimeout(delayCompleted, Config.delay)
        }

        // 开始淡入窗口
        setTimeout(showCompleted, 10)
      })
    })
  })

  describe('Alert Service', function () {
    it('能淡入到 body 中', function (done) {
      this.timeout(1000)

      inject(function ($alert, $timeout) {
        $alert.create(NEST_CONTENT, Config)

        let $jqAlert = $('.alert')
        let $scope = angular.element($jqAlert[0].childNodes[0]).scope()

        // 检查 DOM 节点
        expect($jqAlert.length).to.equal(1)
        expect($jqAlert.text()).to.equal(NEST_CONTENT)

        // 检查属性
        expect($scope.isOpen).to.be.false

        setTimeout(function () {
          expect($scope.isOpen).to.be.true

          setTimeout(function () {
            expect($scope.isOpen).to.be.false
            done()
          }, Config.during + Config.delay + 10)
        }, 1)
      })
    })

    it('能更改类型(用对象传参)', function () {
      inject(function ($alert) {
        forEach(['correct', 'error', 'info'], function (type) {
          $alert.create(NEST_CONTENT, { type })

          let $jqAlert = $(`.alert.${type}`)
          expect($jqAlert.length).to.equal(1)

          let scope = angular.element($jqAlert[0].childNodes[0]).scope()
          expect(scope.type).to.equal(type)
          expect($(`.alert.${type}`).length).to.equal(1)
        })
      })
    })

    it('能更改类型(用字符串传参)）', function () {
      inject(function ($alert) {
        forEach(['correct', 'info', 'error'], function (type) {
          $alert.create(NEST_CONTENT, type)

          let $jqAlert = $(`.alert.${type}`)
          expect($jqAlert.length).to.equal(1)

          let scope = angular.element($jqAlert[0].childNodes[0]).scope()
          expect(scope.type).to.equal(type)
          expect($(`.alert.${type}`).length).to.equal(1)
        })
      })
    })

    it('能同时触发', function () {
      inject(function ($alert) {
        $alert.create(NEST_CONTENT)
        $alert.create(NEST_CONTENT)

        expect(document.getElementsByClassName('alert').length).to.equal(2)
      })
    })

    it('删除全部', function (done) {
      this.timeout(1000)

      inject(function ($alert, $timeout) {
        $alert.removeAll()

        $alert.create(NEST_CONTENT)
        $alert.create(NEST_CONTENT)

        expect(document.getElementsByClassName('alert').length).to.equal(2)

        $alert.removeAll()

        setTimeout(function () {
          expect(document.getElementsByClassName('alert').length).to.equal(0)
          done()
        }, 10 + Config.during + Config.delay + Config.during)
      })
    })

    it('能更改默认值', function (done) {
      this.timeout(1000)

      module(function ($alertProvider) {
        $alertProvider.configure(Config)
      })

      inject(function ($alert, $timeout) {
        $alert.create(NEST_CONTENT)

        let $jqAlert = $('.alert')
        let $scope = angular.element($jqAlert[0].childNodes[0]).scope()

        // 监听 hide 事件
        sinon.spy($scope, 'dismiss')
        sinon.spy($scope, 'hide')

        expect(document.getElementsByClassName('alert').length).to.equal(1)

        let hideCompleted = function () {
          expect(document.getElementsByClassName('alert').length).to.equal(0)
          done()
        }

        let delayCompleted = function () {
          expect($jqAlert.hasClass(Config.fadeClass)).to.be.false
          setTimeout(hideCompleted, Config.during)
        }

        let showCompleted = function () {
          expect($jqAlert.hasClass(Config.openClass) && $jqAlert.hasClass(Config.fadeClass)).to.be.true
          setTimeout(delayCompleted, Config.delay)
        }

        let beforeShow = function () {
          expect($jqAlert.hasClass(Config.fadeClass)).to.be.true
          setTimeout(showCompleted, Config.during)
        }

        expect($jqAlert.hasClass(Config.openClass)).to.be.true
        setTimeout(beforeShow)
      })
    })

    it('会过滤 delay 为 0 时的情况', function () {
      inject(function ($alert, $timeout) {
        $alert.create(NEST_CONTENT, { delay: 0 })

        let $jqAlert = $('.alert')
        let $scope = angular.element($jqAlert[0].childNodes[0]).scope()

        expect($scope.delay).to.equal(10)
      })
    })
  })
})
