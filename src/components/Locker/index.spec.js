/* eslint max-nested-callbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */

import defaults from 'lodash/defaults'
import angular from 'angular'
import 'angular-mocks'

import Locker, { DefaultSettings } from './index'

describe('Locker 组件', function () {
  const { module, inject } = angular.mock
  const FakeSettings = defaults({
    displayClass: 'in-test',
    animationClass: 'fade-test',
    padding: 10,
    duration: 10,
    content: 'content-text'
  }, DefaultSettings)

  beforeEach(function () {
    // 清场
    document.body.innerHTML = ''
    // 初始化 Locker 组件
    module(Locker)
  })

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(Locker).to.be.a('string')
    })

    it('拥有自己的作用域', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        let $element = $compile('<locker/>')($scope)
        let $nestScope = angular.element($element[0].childNodes[0]).scope()

        expect($scope.$id).to.not.equal($nestScope.$id)
      })
    })

    it('应该拥有额定的结构', function () {
      inject(function ($rootScope, $compile) {
        let $element = $compile('<locker/>')($rootScope.$new())
        let $scope = angular.element($element[0].childNodes[0]).scope()

        expect($scope.isOpen).to.be.a('boolean')
        expect($scope.show).to.be.a('function')
        expect($scope.hide).to.be.a('function')
        expect($scope.dismiss).to.be.a('function')

        expect($scope.displayClass).to.be.a('string')
        expect($scope.animationClass).to.be.a('string')
        expect($scope.padding).to.be.a('number')
        expect($scope.duration).to.be.a('number')
        expect($scope.content).to.be.a('string')
      })
    })
  })

  describe('全局服务', function () {
    it('能更改默认值', function () {
      let $lockerProvider

      module(function (_$lockerProvider_) {
        $lockerProvider = _$lockerProvider_
        $lockerProvider.configure(FakeSettings)
      })

      inject(function ($locker) {
        $locker.show()

        expect($lockerProvider.defaultSettings.displayClass).to.equal(FakeSettings.displayClass)
        expect($lockerProvider.defaultSettings.animationClass).to.equal(FakeSettings.animationClass)
        expect($lockerProvider.defaultSettings.duration).to.equal(FakeSettings.duration)
      })
    })

    describe('服务运行', function () {
      beforeEach(function () {
        module(function ($lockerProvider) {
          $lockerProvider.configure(FakeSettings)
        })
      })

      it('能淡入到 body 中', function () {
        inject(function ($locker) {
          $locker.show(FakeSettings)

          let dom = document.getElementsByClassName('locker')
          expect(dom.length).to.equal(1)
        })
      })
    })
  })
})
