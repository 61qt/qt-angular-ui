/* eslint max-nested-callbacks: off */
/* eslint-env mocha */
/* global expect */

import angular    from 'angular';
import UIRouter   from 'angular-ui-router';
import 'angular-mocks';

import $          from 'jquery';
import Utilitybar from './index';

/**
 * $('a').click()无效的解决方法
 * @param {element} el
 * clickElement($('a')[0]);
 */
let clickElement = function (el) {
  let ev = document.createEvent('MouseEvent');
  ev.initMouseEvent('click', true, true, window, null, 0, 0, 0, 0, false, false, false, false, 0, null);
  el.dispatchEvent(ev);
};

describe('Utilitybar 组件', function () {
  const { module, inject } = angular.mock;

  /**
   * window.history.back() & window.location.replace() 在 phantomjs 中不作用
   * 重写方法用于测试
   */
  const ORIGIN   = window.location.origin;
  const HREF     = window.location.href;
  const GOBACK   = ORIGIN + '/goback';
  const GOBACKDT = ORIGIN + '/gobackdt';

  window.history.back = function () {
    window.history.replaceState(null, null, GOBACK);
  };

  window.location.replace = function (dt) {
    window.history.replaceState(null, null, dt);
  };

  beforeEach(function () {
    module(UIRouter);

    // 初始化 Utilitybar 组件
    module(Utilitybar);

    // url设置回默认值
    window.location.replace(HREF);

    // 清场
    document.body.innerHTML = '';
  });

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(Utilitybar).to.be.a('string');
    });

    it('能够进行初始化', function () {
      inject(function ($rootScope, $compile) {
        let $element = $compile('<utilitybar></utilitybar>')($rootScope.$new());

        expect($element.find('a').length).to.equal(1);
      });
    });

    it('拥有自己的作用域', function () {
      inject(function ($rootScope, $compile) {
        let $newScope = $rootScope.$new();
        let $element  = $compile('<utilitybar></utilitybar>')($newScope);
        let $scope    = $element.children().scope();

        expect($scope.$id).to.not.equal($newScope.$id);
      });
    });

    it('拥有固定的结构', function () {
      inject(function ($rootScope, $compile) {
        let $element = $compile('<utilitybar></utilitybar>')($rootScope.$new());
        let $scope   = $element.children().scope();

        expect($scope.toggle).to.be.a('function');
        expect($scope.goback).to.be.a('function');
      });
    });
  });

  describe('触发流程', function () {
    it('能够显示和隐藏', function () {
      inject(function ($rootScope, $compile) {
        let $newScope    = $rootScope.$new();
        $newScope.isOpen = true;
        let $element     = $compile('<utilitybar ng-model="isOpen"></utilitybar>')($newScope);
        let $scope       = $element.children().scope();

        angular.element(document.body).append($element);
        let $utilitybar = $('.utilitybar');

        $scope.$digest();
        expect($utilitybar.hasClass('active')).to.be.true;

        $scope.toggle(false);
        $scope.$digest();
        expect($utilitybar.hasClass('active')).to.be.false;

        // 非 Boolean 值无效
        $scope.toggle('true');
        $scope.$digest();
        expect($utilitybar.hasClass('active')).to.be.false;
      });
    });

    it('能够点击返回并有效返回', function () {
      module(function ($stateProvider) {
        $stateProvider
        .state('test', {
          url: '/?dt',
        });
      });

      inject(function ($rootScope, $compile, $state) {
        let $element  = $compile('<utilitybar></utilitybar>')($rootScope.$new());

        angular.element(document.body).append($element);
        expect(window.location.href).to.equal(HREF);

        let $goback = $('[ng-click="goback()"]');

        clickElement($goback[0]);
        expect(window.location.href).to.equal(GOBACK);

        $state.go('test', { dt: GOBACKDT });
        $rootScope.$digest();
        clickElement($goback[0]);
        expect(window.location.href).to.equal(GOBACKDT);
      });
    });

    it('能够嵌入内容，并可设置继承指令的scope或父的scope', function () {
      inject(function ($rootScope, $compile) {
        let $newScope    = $rootScope.$new();
        $newScope.test   = false;
        $newScope.goback = function () {
          window.location.replace(GOBACKDT);
        };

        let tmlp     = '<utilitybar><a class="go-origin" scope ng-click="goback()">test</a><a class="goback" ng-click="goback()"></a></utilitybar>';
        let $element = $compile(tmlp)($newScope);

        angular.element(document.body).append($element);
        expect(window.location.href).to.equal(HREF);

        let $goOrigin = $('.go-origin');
        let $goback   = $('.goback');

        clickElement($goOrigin[0]);
        expect(window.location.href).to.equal(GOBACKDT);

        clickElement($goback[0]);
        expect(window.location.href).to.equal(GOBACK);
      });
    });

    it('销毁时，最后一个继承它的isOpen', function () {
      inject(function ($rootScope, $compile) {
        let $newScope    = $rootScope.$new();
        $newScope.isOpen = true;
        let $element1    = $compile('<utilitybar ng-model = "isOpen"></utilitybar>')($newScope);
        let $element2    = $compile('<utilitybar></utilitybar>')($rootScope.$new());
        let $element3    = $compile('<utilitybar></utilitybar>')($rootScope.$new());
        let $scope1      = $element1.children().scope();
        let $scope2      = $element2.children().scope();
        let $scope3      = $element3.children().scope();

        expect($scope1.isOpen).to.be.true;
        expect($scope2.isOpen).to.be.undefined;
        expect($scope3.isOpen).to.be.undefined;

        $scope1.$destroy();
        expect($scope1.isOpen).to.be.true;
        expect($scope2.isOpen).to.be.undefined;
        expect($scope3.isOpen).to.be.true;
      });
    });
  });

  describe('服务', function () {
    it('配置某些页面隐藏', function () {
      module(function ($utilitybarProvider, $stateProvider) {
        $stateProvider
        .state('test', {
          template:'<utilitybar></utilitybar>',
        });

        $utilitybarProvider.configure({
          filterModules: [
            // 下面是 state 的名字
            'test',
          ],
        });
      });

      inject(function ($rootScope, $compile, $state) {
        let $uiview = $compile('<ui-view></ui-view>')($rootScope.$new());
        angular.element(document.body).append($uiview);

        $state.go('test');
        $rootScope.$digest();

        let utilitybar = $('.utilitybar');
        expect(utilitybar.hasClass('active')).to.be.false;
      });
    });
  });
});
