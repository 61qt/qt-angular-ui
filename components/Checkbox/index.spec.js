/* eslint max-nested-callbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */

import find from 'lodash/find'
import angular from 'angular'
import 'angular-mocks'

import $ from 'jquery'
import Checkbox from './index'

describe('checkbox 组件', function () {
  const { module, inject } = angular.mock

  beforeEach(function () {
    // 初始化 checkbox 组件
    module(Checkbox)

    // 清场
    document.body.innerHTML = ''
  })

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(Checkbox).to.be.a('string')
    })

    it('能进行初始化', function () {
      inject(function ($rootScope, $compile) {
        let $element = $compile('<checkbox></checkbox>')($rootScope.$new())
        let $inputElement = $element.find('input')

        expect($inputElement.length).to.equal(1)
      })
    })

    it('拥有自己的作用域', function () {
      inject(function ($rootScope, $compile) {
        let $newScope = $rootScope.$new()
        let $element = $compile('<checkbox></checkbox>')($newScope)
        let $scope = $element.children().scope()

        expect($scope.$id).to.not.equal($newScope.$id)
      })
    })

    it('拥有固定的结构', function () {
      inject(function ($rootScope, $compile) {
        let $element = $compile('<checkbox id="#test" ng-checked="checked"></checkbox>')($rootScope.$new())
        let $scope = $element.children().scope()

        expect($scope.attrId).to.be.a('string')
        expect($scope.attrName).to.be.a('string')
        expect($scope.attrValue).to.be.a('boolean')
        expect($scope.attrNgTrueValue).to.be.a('boolean')
        expect($scope.attrNgFalseValue).to.be.a('boolean')
        expect($scope.attrNgChecked).to.be.a('string')
        expect($scope.disabled).to.be.a('boolean')
        expect($scope.checked).to.be.a('boolean')
        expect($scope.stopPropagation).to.be.a('boolean')
        expect($scope.preventDefault).to.be.a('boolean')
        expect($scope.model).to.be.a('boolean')
        expect($scope.toggle).to.be.a('function')
        expect($scope.ngChange).to.be.a('function')
        expect(find($scope.$$watchers, { exp: 'model' })).to.be.an('object')
        expect(find($scope.$$watchers, { exp: 'ngChecked' })).to.be.an('object')
        expect(find($scope.$$watchers, { exp: 'ngDisabled' })).to.be.an('object')
      })
    })
  })

  describe('触发流程', function () {
    it('能够设置默认选中', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        let vaule = '1'
        let $element = $compile(`<checkbox ng-model='isSelected' value='${vaule}' checked></checkbox>`)($scope)

        angular.element(document.body).append($element)
        $scope.$digest()
        expect($scope.isSelected).to.equal(vaule)
      })
    })

    it('能够用ng-checked更改选中', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        let vaule = '1'
        let $element = $compile(`<checkbox ng-model='isSelected' value='${vaule}' ng-checked='checked'></checkbox>`)($scope)

        expect($scope.isSelected).to.be.undefined

        angular.element(document.body).append($element)

        $scope.checked = true
        $scope.$digest()
        expect($scope.isSelected).to.equal(vaule)

        $scope.checked = false
        $scope.$digest()
        expect($scope.isSelected).to.be.false
      })
    })

    it('能够点击变更状态', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        $scope.isSelected = false
        let $element = $compile('<checkbox ng-model="isSelected"></checkbox>')($scope)

        angular.element(document.body).append($element)
        expect($scope.isSelected).to.be.false

        let $checkbox = $('.checkbox')
        $checkbox.click()

        expect($scope.isSelected).to.be.true
      })
    })

    it('能够禁止点击变更状态，并且能够去掉禁止', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        $scope.isSelected = false
        let $element = $compile('<checkbox ng-model="isSelected" ng-disabled="disabled" disabled></checkbox>')($scope)

        angular.element(document.body).append($element)
        expect($scope.isSelected).to.be.false

        let $checkbox = $('.checkbox')
        $checkbox.click()

        expect($scope.isSelected).to.be.false

        $scope.disabled = false
        $scope.$digest()

        $checkbox.click()
        expect($scope.isSelected).to.be.true
      })
    })

    it('能够多选一', function () {
      inject(function ($rootScope, $compile) {
        let ids = ['1', '2', '3']
        let $scope = $rootScope.$new()
        let tmpl = ''

        for (let i = 0; ids.length > i; i++) {
          tmpl += `<checkbox ng-model='selectedId' value='${ids[i]}'></checkbox>`
        }

        let $element = $compile(tmpl)($scope)
        angular.element(document.body).append($element)

        expect($scope.selectedId).to.be.undefined

        let $checkbox = $('.checkbox')

        for (let i = 0; $checkbox.length > i; i++) {
          $checkbox.eq(i).click()
          expect($scope.selectedId).to.equal(ids[i])
        }
      })
    })

    it('自定义选中值', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        let $element = $compile('<checkbox ng-model="trueValue" value="test" ng-true-value="1" ng-false-value="0"></checkbox>')($scope)

        angular.element(document.body).append($element)
        expect($scope.trueValue).to.be.undefined

        let $checkbox = $('.checkbox')

        $checkbox.click()
        expect($scope.trueValue).to.equal('1')

        $checkbox.click()
        expect($scope.trueValue).to.equal('0')
      })
    })

    it('不阻止点击事件向父级广播', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        $scope.propagation = false
        let $element = $compile('<div ng-click="propagation=true"><checkbox></checkbox></div>')($scope)

        angular.element(document.body).append($element)

        let $checkbox = $('.checkbox')
        $checkbox.click()
        expect($scope.propagation).to.be.true
      })
    })

    it('阻止点击事件向父级广播', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        $scope.propagation = false
        let tmpl = '<div ng-click="propagation=true"><checkbox stop-propagation prevent-default></checkbox></div>'
        let $element = $compile(tmpl)($scope)

        angular.element(document.body).append($element)

        let $checkbox = $('.checkbox')
        $checkbox.click()
        expect($scope.propagation).to.be.false
      })
    })

    it('当model不为boolean类型时，而又给model值设为boolean类型', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new()
        let $element = $compile('<checkbox ng-model="selectedValue" value="1" ng-false-value="2"></checkbox>')($scope)

        angular.element(document.body).append($element)

        $scope.selectedValue = true
        $scope.$digest()
        expect($scope.selectedValue).to.equal('1')

        $scope.selectedValue = false
        $scope.$digest()
        expect($scope.selectedValue).to.equal('2')
      })
    })
  })
})
