/* eslint max-nested-callbacks: off */
/* eslint-env mocha */
/* global expect */

import angular from 'angular';
import 'angular-mocks';

import ConfExample from './conf.example';

describe('Constant 常量定义', function () {
  const { module, inject } = angular.mock;

  beforeEach(function () {
    module(ConfExample);
  });

  describe('检查常量', function () {
    it('检查常量的值', function () {
      inject(function (USER_JWT_TOKEN, LOCALSTORAGE_PREFIX) {
        expect(USER_JWT_TOKEN).to.equal('USER_JWT_TOKEN');
        expect(LOCALSTORAGE_PREFIX).to.equal('LOCALSTORAGE');
      });
    });
  });
});
