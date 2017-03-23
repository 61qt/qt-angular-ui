/* eslint max-nested-callbacks: off */
/* eslint-env mocha */
/* global expect */

import _          from 'lodash';
import angular    from 'angular';
import 'angular-mocks';

import sinon      from 'sinon';
import $          from 'jquery';
import Alert      from './index';
import Config     from './config';

describe('Alert 组件', function () {
  const NEST_CONTENT       = 'Message';
  const { module, inject } = angular.mock;

  beforeEach(function () {
    // 设置延迟消失时间为 0
    Config.during = 10;
    Config.delay  = 10;

    // 初始化 Alert 组件
    module(Alert);

    // 清场
    document.body.innerHTML = '';
  });

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(Alert).to.be.a('string');
    });

    it('能进行初始化, 并且能自定义信息', function () {
      inject(function ($rootScope, $compile) {
        let $scope = $rootScope.$new();
        let $alert = $compile(`<alert>${NEST_CONTENT}</alert>`)($scope);

        expect($alert.text()).to.equal(NEST_CONTENT);
      });
    });

    it('拥有自己的作用域', function () {
      inject(function ($rootScope, $compile) {
        let $scope     = $rootScope.$new();
        let $element   = $compile(`<alert>${NEST_CONTENT}</alert>`)($scope);
        let $nestScope = angular.element($element[0].childNodes[0]).scope();

        expect($scope.$id).to.not.equal($nestScope.$id);
      });
    });

    it('应该拥有额定的结构', function () {
      inject(function ($rootScope, $compile) {
        let $element = $compile(`<alert>${NEST_CONTENT}</alert>`)($rootScope.$new());
        let $scope   = angular.element($element[0].childNodes[0]).scope();

        expect($scope.type).to.be.a('string');
        expect($scope.show).to.be.a('function');
        expect($scope.hide).to.be.a('function');
        expect($scope.dismiss).to.be.a('function');
        expect($scope.isOpen).to.be.a('boolean');
      });
    });
  });

  describe('触发流程', function () {
    it('能够自动完成淡入淡出', function (done) {
      this.timeout(1000);

      inject(function ($rootScope, $compile, $timeout) {
        let $element = $compile(`<alert>${NEST_CONTENT}</alert>`)($rootScope.$new());
        let $scope   = angular.element($element[0].childNodes[0]).scope();

        angular.element(document.body).append($element);
        expect($scope.isOpen).to.be.false;
        expect(document.getElementsByClassName('alert').length).to.equal(1);

        let hideCompleted = function () {
          expect($scope.isOpen).to.be.false;
          expect(document.getElementsByClassName('alert').length).to.equal(0);

          done();
        };

        let delayCompleted = function () {
          expect($scope.dismiss.calledOnce).to.be.true;
          expect($scope.hide.called).to.be.true;
          expect($scope.isOpen).to.be.false;

          $timeout.flush();
          setTimeout(hideCompleted, Config.during);
        };

        let showCompleted = function () {
          expect($scope.isOpen).to.be.true;

          $timeout.flush();
          setTimeout(delayCompleted, Config.delay);
        };

        // 监听 hide 事件
        sinon.spy($scope, 'dismiss');
        sinon.spy($scope, 'hide');

        // 开始淡入窗口
        $timeout.flush();
        setTimeout(showCompleted, Config.during);
      });
    });
  });

  describe('服务', function () {
    it('能淡入到 body 中', function (done) {
      this.timeout(1000);

      inject(function ($alert, $timeout) {
        $alert.create(NEST_CONTENT, Config);

        let $jqAlert = $('.alert');
        let $scope   = angular.element($jqAlert[0].childNodes[0]).scope();

        // 检查 DOM 节点
        expect($jqAlert.length).to.equal(1);
        expect($jqAlert.text()).to.equal(NEST_CONTENT);

        // 检查属性
        expect($scope.isOpen).to.be.false;

        // FadeIn
        $timeout.flush();
        setTimeout(function () {
          expect($scope.isOpen).to.be.true;

          // FadeOut
          $timeout.flush();
          setTimeout(function () {
            expect($scope.isOpen).to.be.false;
            done();

          }, Config.during + Config.delay + 10);
        }, 1);
      });
    });

    it('能更改类型', function () {
      inject(function ($alert) {
        _.forEach(['correct', 'error', 'info'], function (type) {
          $alert.create(NEST_CONTENT, _.assign(Config, { type }));

          let $jqAlert = $(`.alert.${type}`);
          let scope    = angular.element($jqAlert[0].childNodes[0]).scope();

          expect(scope.type).to.equal(type);
          expect($(`.alert.${type}`).length).to.equal(1);
        });
      });
    });

    it('能同时触发', function () {
      inject(function ($alert) {
        $alert.create(NEST_CONTENT);
        $alert.create(NEST_CONTENT);

        expect(document.getElementsByClassName('alert').length).to.equal(2);
      });
    });
  });
});
