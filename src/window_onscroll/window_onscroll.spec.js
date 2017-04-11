/* eslint max-nested-callbacks: off */
/* eslint-env mocha */
/* global expect */

import _              from 'lodash';
import angular        from 'angular';
import 'angular-mocks';

import WindowOnScroll from './index';

describe('WindowOnScroll 组件', function () {
  const { module, inject } = angular.mock;

  beforeEach(function () {
    // 初始化WindowOnScroll组件
    module(WindowOnScroll);

    // 清场
    document.body.innerHTML = '';
  });
});