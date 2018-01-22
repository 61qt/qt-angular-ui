'use strict';

var _defaults = require('lodash/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

require('angular-mocks');

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint max-nested-callbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */

describe('Locker 组件', function () {
  var _angular$mock = _angular2.default.mock,
      module = _angular$mock.module,
      inject = _angular$mock.inject;

  var FakeSettings = (0, _defaults2.default)({
    displayClass: 'in-test',
    animationClass: 'fade-test',
    padding: 10,
    duration: 10,
    content: 'content-text'
  }, _index.DefaultSettings);

  beforeEach(function () {
    // 清场
    document.body.innerHTML = '';
    // 初始化 Locker 组件
    module(_index2.default);
  });

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(_index2.default).to.be.a('string');
    });

    it('拥有自己的作用域', function () {
      inject(function ($rootScope, $compile) {
        var $scope = $rootScope.$new();
        var $element = $compile('<locker/>')($scope);
        var $nestScope = _angular2.default.element($element[0].childNodes[0]).scope();

        expect($scope.$id).to.not.equal($nestScope.$id);
      });
    });

    it('应该拥有额定的结构', function () {
      inject(function ($rootScope, $compile) {
        var $element = $compile('<locker/>')($rootScope.$new());
        var $scope = _angular2.default.element($element[0].childNodes[0]).scope();

        expect($scope.isOpen).to.be.a('boolean');
        expect($scope.show).to.be.a('function');
        expect($scope.hide).to.be.a('function');
        expect($scope.dismiss).to.be.a('function');

        expect($scope.displayClass).to.be.a('string');
        expect($scope.animationClass).to.be.a('string');
        expect($scope.padding).to.be.a('number');
        expect($scope.duration).to.be.a('number');
        expect($scope.content).to.be.a('string');
      });
    });
  });

  describe('全局服务', function () {
    it('能更改默认值', function () {
      var $lockerProvider = void 0;

      module(function (_$lockerProvider_) {
        $lockerProvider = _$lockerProvider_;
        $lockerProvider.configure(FakeSettings);
      });

      inject(function ($locker) {
        $locker.show();

        expect($lockerProvider.defaultSettings.displayClass).to.equal(FakeSettings.displayClass);
        expect($lockerProvider.defaultSettings.animationClass).to.equal(FakeSettings.animationClass);
        expect($lockerProvider.defaultSettings.duration).to.equal(FakeSettings.duration);
      });
    });

    describe('服务运行', function () {
      beforeEach(function () {
        module(function ($lockerProvider) {
          $lockerProvider.configure(FakeSettings);
        });
      });

      it('能淡入到 body 中', function () {
        inject(function ($locker) {
          $locker.show(FakeSettings);

          var dom = document.getElementsByClassName('locker');
          expect(dom.length).to.equal(1);
        });
      });
    });
  });
});