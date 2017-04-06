/* eslint max-nested-callbacks: off */
/* eslint-env mocha */
/* global expect */

import angular    from 'angular';
import 'angular-mocks';

import $          from 'jquery';
import Locker      from './index';
import Config     from './config';

describe('Locker 组件', function () {
  const NEST_CONTENT       = 'Message';
  const { module, inject } = angular.mock;

  beforeEach(function () {
    // 设置延迟消失时间为 0
    Config.during = 10;

    // 初始化 Locker 组件
    module(Locker);

    // 清场
    document.body.innerHTML = '';
  });

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(Locker).to.be.a('string');
    });

    it('能进行初始化', function () {
      inject(function ($rootScope, $compile) {
        let $element = $compile('<locker></locker>')($rootScope.$new());
        let $scope   = angular.element($element[0].childNodes[0]).scope();

        expect($scope.content).to.equal(Config.content);
      });
    });

    it('拥有自己的作用域', function () {
      inject(function ($rootScope, $compile) {
        let $scope     = $rootScope.$new();
        let $element   = $compile('<locker></locker>')($scope);
        let $nestScope = angular.element($element[0].childNodes[0]).scope();

        expect($scope.$id).to.not.equal($nestScope.$id);
      });
    });

    it('应该拥有额定的结构', function () {
      inject(function ($rootScope, $compile) {
        let $element = $compile('<locker></locker>')($rootScope.$new());
        let $scope   = angular.element($element[0].childNodes[0]).scope();

        expect($scope.isOpened).to.be.a('boolean');
        expect($scope.content).to.be.a('string');
        expect($scope.show).to.be.a('function');
        expect($scope.hide).to.be.a('function');
      });
    });
  });

  describe('触发流程', function () {
    it('能够显示与隐藏', function () {
      this.timeout(1000);

      inject(function ($rootScope, $compile, $timeout) {
        let $element = $compile('<locker></locker>')($rootScope.$new());
        let $scope   = angular.element($element[0].childNodes[0]).scope();

        angular.element(document.body).append($element);
        expect($scope.isOpened).to.be.false;
        expect(document.getElementsByClassName('locker').length).to.equal(1);

        $scope.show(NEST_CONTENT);
        $timeout.flush();

        expect($scope.isOpened).to.be.true;
        expect($scope.content).to.equal(NEST_CONTENT);
        expect($element.hasClass(Config.duringClass)).to.be.true;
        expect($element.hasClass(Config.enterClass)).to.be.true;

        $scope.hide();
        $timeout.flush();

        expect($scope.isOpened).to.be.false;
        expect($element.hasClass(Config.duringClass)).to.be.false;
        expect($element.hasClass(Config.enterClass)).to.be.false;
      });
    });
  });

  describe('服务', function () {
    it('能够显示与隐藏', function () {
      this.timeout(1000);

      inject(function ($locker, $timeout) {

        let $jqLocker = $('.locker');
        let $scope    = angular.element($jqLocker[0].childNodes[0]).scope();

        // 检查 DOM 节点
        expect($jqLocker.length).to.equal(1);

        // 检查属性
        expect($scope.isOpened).to.be.false;

        // FadeIn
        $scope.show(NEST_CONTENT);
        $timeout.flush();

        expect($scope.isOpened).to.be.true;
        expect($scope.content).to.equal(NEST_CONTENT);
        expect($jqLocker.hasClass(Config.duringClass)).to.be.true;
        expect($jqLocker.hasClass(Config.enterClass)).to.be.true;

        // out
        $scope.hide();
        $timeout.flush();

        expect($scope.isOpened).to.be.false;
        expect($jqLocker.hasClass(Config.duringClass)).to.be.false;
        expect($jqLocker.hasClass(Config.enterClass)).to.be.false;
      });
    });

    it('能同时触发', function () {
      inject(function ($locker) {
        $locker.show(NEST_CONTENT);
        $locker.show(NEST_CONTENT);

        expect(document.getElementsByClassName('locker').length).to.equal(1);
      });
    });
  });
});
