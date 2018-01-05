/* eslint max-nested-callbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */

import angular from 'angular'
import 'angular-mocks'

import Spinner from './index'

describe('Spinner 组件', function () {
  const { module, inject } = angular.mock

  beforeEach(function () {
    // 初始化 Spinner 组件
    module(Spinner)

    // 清场
    document.body.innerHTML = ''
  })

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(Spinner).to.be.a('string')
    })

    it('能够进行初始化', function () {
      inject(function ($rootScope, $compile) {
        let $element = $compile('<spinner></spinner>')($rootScope.$new())
        expect($element.find('circle').length).to.equal(1)
      })
    })
  })
})
