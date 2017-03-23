/* eslint max-nested-callbacks: off */
/* eslint-env mocha */
/* global expect */

import angular from 'angular';
import 'angular-mocks';

import $      from 'jquery';
import Alert  from './index';
import Config from './config';

describe('Alert 组件', function () {
  const NEST_CONTENT       = 'Message';
  // const CLASS_TYPE         = 'class-type';
  const { module, inject } = angular.mock;

  beforeEach(function () {
    // 设置延迟消失时间为 0
    Config.stayTime      = 0;
    Config.enterDuration = 0;
    Config.leaveDuration = 0;

    // 初始化 Alert 组件
    module(Alert);

    // 清场
    document.body.innerHTML = '';
  });

  describe('初始化', function () {
    it('会返回组件名称', function () {
      expect('Alert').to.be.a('string');
    });

    it('能够进行初始化, 并且能够自定义信息', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new();
        let $alert = $compile(`<alert>${NEST_CONTENT}</alert>`)($scope);

        expect($alert.text()).to.equal(NEST_CONTENT);
      });
    });

    it('能够淡入到 body 中', function (done) {
      this.timeout(10000);

      inject(function ($alert) {
        $alert.create(NEST_CONTENT);

        let $jqAlert = $('.alert');
        let $scope   = angular.element($jqAlert[0]).scope();

        // 检查 DOM 节点
        expect($jqAlert.length).to.equal(1);
        expect($jqAlert.text()).to.equal(NEST_CONTENT);

        // 检查属性
        expect($scope.isOpen).to.be.false;

        let showCompleted = function () {
          expect($scope.isOpen).to.be.true;
          done();
        };

        setTimeout(showCompleted, Config.stayTime + 10);
      });
    });

  });
});
