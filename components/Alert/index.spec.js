'use strict';

var _defaults = require('lodash/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

require('angular-mocks');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _transitionEnd = require('../../share/transitionEnd');

var _transitionEnd2 = _interopRequireDefault(_transitionEnd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Alert 组件', function () {
  var _angular$mock = _angular2.default.mock,
      module = _angular$mock.module,
      inject = _angular$mock.inject;

  var Content = 'Message';
  var FakeSettings = (0, _defaults2.default)({
    displayClass: 'in-test',
    animationClass: 'fade-test',
    padding: 10,
    duration: 10,
    delay: 20
  }, _index.DefaultSettings);

  beforeEach(function () {
    // 清场
    document.body.innerHTML = '';
    // 初始化 Alert 组件
    module(_index2.default);
  });

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(_index2.default).to.be.a('string');
    });

    it('能进行初始化, 并且能自定义信息', function () {
      inject(function ($rootScope, $compile) {
        var $scope = $rootScope.$new();
        var $alert = $compile('<alert>' + Content + '</alert>')($scope);

        expect($alert.text()).to.equal(Content);
      });
    });

    it('拥有自己的作用域', function () {
      inject(function ($rootScope, $compile) {
        var $scope = $rootScope.$new();
        var $element = $compile('<alert>' + Content + '</alert>')($scope);
        var $nestScope = _angular2.default.element($element[0].childNodes[0]).scope();

        expect($scope.$id).to.not.equal($nestScope.$id);
      });
    });

    it('应该拥有额定的结构', function () {
      inject(function ($rootScope, $compile) {
        var $element = $compile('<alert>' + Content + '</alert>')($rootScope.$new());
        var $scope = _angular2.default.element($element[0].childNodes[0]).scope();

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
      inject(function ($rootScope, $compile) {
        var $newScope = $rootScope.$new();
        $newScope.options = FakeSettings;

        var $element = $compile('<alert alert-options="options">' + Content + '</alert>')($newScope);
        _angular2.default.element(document.body).append($element);

        var dom = document.getElementsByClassName('alert');
        expect(dom.length).to.equal(1);
        expect(_angular2.default.element(dom).text()).to.equal(Content);

        var $scope = _angular2.default.element(dom[0].childNodes[0]).scope();
        _sinon2.default.spy($scope, 'dismiss');

        expect($scope.isOpen).to.be.false;

        var afterDismiss = function afterDismiss() {
          var dom = document.getElementsByClassName('alert');
          expect($scope.dismiss.calledOnce).to.be.true;
          expect(dom.length).to.equal(0);
          done();
        };

        var execDismiss = function execDismiss() {
          expect($scope.isOpen).to.be.false;
          expect(dom.length).to.equal(1);
          expect(_angular2.default.element(dom).hasClass(FakeSettings.animationClass)).to.be.false;
          (0, _transitionEnd2.default)(dom, afterDismiss);
        };

        var afterAnimation = function afterAnimation() {
          expect($scope.isOpen).to.be.true;
          setTimeout(execDismiss, FakeSettings.delay);
        };

        var execAnimation = function execAnimation() {
          expect($scope.isOpen).to.be.true;
          expect(_angular2.default.element(dom).hasClass(FakeSettings.animationClass)).to.be.true;
          (0, _transitionEnd2.default)(dom, afterAnimation);
        };

        expect(dom.length).to.equal(1);
        expect(_angular2.default.element(dom).hasClass(FakeSettings.displayClass)).to.be.true;
        setTimeout(execAnimation, FakeSettings.padding);
      });
    });
  });

  describe('全局服务', function () {
    it('能更改默认值', function () {
      var $alertProvider = void 0;

      module(function (_$alertProvider_) {
        $alertProvider = _$alertProvider_;
        $alertProvider.configure(FakeSettings);
      });

      inject(function ($alert) {
        $alert.create(Content);

        expect($alertProvider.defaultSettings.displayClass).to.equal(FakeSettings.displayClass);
        expect($alertProvider.defaultSettings.animationClass).to.equal(FakeSettings.animationClass);
        expect($alertProvider.defaultSettings.duration).to.equal(FakeSettings.duration);
        expect($alertProvider.defaultSettings.delay).to.equal(FakeSettings.delay);
      });
    });

    describe('服务运行', function () {
      beforeEach(function () {
        module(function ($alertProvider) {
          $alertProvider.configure(FakeSettings);
        });
      });

      it('能淡入到 body 中', function () {
        inject(function ($alert) {
          $alert.create(Content, FakeSettings);

          var dom = document.getElementsByClassName('alert');
          expect(dom.length).to.equal(1);
          expect(_angular2.default.element(dom).text()).to.equal(Content);
        });
      });

      it('能更改类型(用对象传参)', function () {
        inject(function ($rootScope, $alert) {
          (0, _forEach2.default)(['correct', 'error', 'info'], function (type) {
            $alert.create(Content, { type: type });
            $rootScope.$digest();

            var dom = document.getElementsByClassName('alert');
            expect(dom.length).to.equal(1);

            var scope = _angular2.default.element(dom[0].childNodes[0]).scope();
            expect(scope.type).to.equal(type);

            var tDom = document.getElementsByClassName(type);
            expect(tDom.length).to.equal(1);

            document.body.innerHTML = '';
          });
        });
      });

      it('能更改类型(用字符串传参)）', function () {
        inject(function ($alert) {
          (0, _forEach2.default)(['correct', 'info', 'error'], function (type) {
            $alert.create(Content, type);

            var dom = document.getElementsByClassName('alert');
            expect(dom.length).to.equal(1);

            var scope = _angular2.default.element(dom[0].childNodes[0]).scope();
            expect(scope.type).to.equal(type);

            var tDom = document.getElementsByClassName(type);
            expect(tDom.length).to.equal(1);

            document.body.innerHTML = '';
          });
        });
      });

      it('能同时触发', function () {
        inject(function ($alert) {
          $alert.create(Content);
          $alert.create(Content);

          var dom = document.getElementsByClassName('alert');
          expect(dom.length).to.equal(2);
        });
      });

      it('删除全部', function (done) {
        inject(function ($alert) {
          $alert.create(Content);
          $alert.create(Content);

          var dom = document.getElementsByClassName('alert');
          expect(dom.length).to.equal(2);

          $alert.removeAll();

          var checkEmpty = function checkEmpty() {
            var dom = document.getElementsByClassName('alert');
            expect(dom.length).to.equal(0);
            done();
          };

          var totalSpent = FakeSettings.padding + FakeSettings.duration + FakeSettings.delay + FakeSettings.duration + 10;
          setTimeout(checkEmpty, totalSpent);
        });
      });

      it('会过滤 delay 为 0 时的情况', function () {
        inject(function ($alert) {
          $alert.create(Content, { delay: 0 });

          var dom = document.getElementsByClassName('alert');
          expect(dom.length).to.equal(1);

          var $scope = _angular2.default.element(dom[0].childNodes[0]).scope();
          expect($scope.delay).to.equal(_index.DefaultSettings.delay);
        });
      });
    });
  });
}); /* eslint max-nested-callbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */