'use strict';

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

require('angular-mocks');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('checkbox 组件', function () {
  var _angular$mock = _angular2.default.mock,
      module = _angular$mock.module,
      inject = _angular$mock.inject;


  beforeEach(function () {
    // 初始化 checkbox 组件
    module(_index2.default);

    // 清场
    document.body.innerHTML = '';
  });

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(_index2.default).to.be.a('string');
    });

    it('能进行初始化', function () {
      inject(function ($rootScope, $compile) {
        var $element = $compile('<checkbox></checkbox>')($rootScope.$new());
        var $inputElement = $element.find('input');

        expect($inputElement.length).to.equal(1);
      });
    });

    it('拥有自己的作用域', function () {
      inject(function ($rootScope, $compile) {
        var $newScope = $rootScope.$new();
        var $element = $compile('<checkbox></checkbox>')($newScope);
        var $scope = $element.children().scope();

        expect($scope.$id).to.not.equal($newScope.$id);
      });
    });

    it('拥有固定的结构', function () {
      inject(function ($rootScope, $compile) {
        var $element = $compile('<checkbox id="#test" ng-checked="checked"></checkbox>')($rootScope.$new());
        var $scope = $element.children().scope();

        expect($scope.attrId).to.be.a('string');
        expect($scope.attrName).to.be.a('string');
        expect($scope.attrValue).to.be.a('boolean');
        expect($scope.attrNgTrueValue).to.be.a('boolean');
        expect($scope.attrNgFalseValue).to.be.a('boolean');
        expect($scope.attrNgChecked).to.be.a('string');
        expect($scope.disabled).to.be.a('boolean');
        expect($scope.checked).to.be.a('boolean');
        expect($scope.stopPropagation).to.be.a('boolean');
        expect($scope.preventDefault).to.be.a('boolean');
        expect($scope.model).to.be.a('boolean');
        expect($scope.toggle).to.be.a('function');
        expect($scope.ngChange).to.be.a('function');
        expect((0, _find2.default)($scope.$$watchers, { exp: 'model' })).to.be.an('object');
        expect((0, _find2.default)($scope.$$watchers, { exp: 'ngChecked' })).to.be.an('object');
        expect((0, _find2.default)($scope.$$watchers, { exp: 'ngDisabled' })).to.be.an('object');
      });
    });
  });

  describe('触发流程', function () {
    it('能够设置默认选中', function () {
      inject(function ($rootScope, $compile) {
        var $scope = $rootScope.$new();
        var vaule = '1';
        var $element = $compile('<checkbox ng-model=\'isSelected\' value=\'' + vaule + '\' checked></checkbox>')($scope);

        _angular2.default.element(document.body).append($element);
        $scope.$digest();
        expect($scope.isSelected).to.equal(vaule);
      });
    });

    it('能够用ng-checked更改选中', function () {
      inject(function ($rootScope, $compile) {
        var $scope = $rootScope.$new();
        var vaule = '1';
        var $element = $compile('<checkbox ng-model=\'isSelected\' value=\'' + vaule + '\' ng-checked=\'checked\'></checkbox>')($scope);

        expect($scope.isSelected).to.be.undefined;

        _angular2.default.element(document.body).append($element);

        $scope.checked = true;
        $scope.$digest();
        expect($scope.isSelected).to.equal(vaule);

        $scope.checked = false;
        $scope.$digest();
        expect($scope.isSelected).to.be.false;
      });
    });

    it('能够点击变更状态', function () {
      inject(function ($rootScope, $compile) {
        var $scope = $rootScope.$new();
        $scope.isSelected = false;
        var $element = $compile('<checkbox ng-model="isSelected"></checkbox>')($scope);

        _angular2.default.element(document.body).append($element);
        expect($scope.isSelected).to.be.false;

        var $checkbox = (0, _jquery2.default)('.checkbox');
        $checkbox.click();

        expect($scope.isSelected).to.be.true;
      });
    });

    it('能够禁止点击变更状态，并且能够去掉禁止', function () {
      inject(function ($rootScope, $compile) {
        var $scope = $rootScope.$new();
        $scope.isSelected = false;
        var $element = $compile('<checkbox ng-model="isSelected" ng-disabled="disabled" disabled></checkbox>')($scope);

        _angular2.default.element(document.body).append($element);
        expect($scope.isSelected).to.be.false;

        var $checkbox = (0, _jquery2.default)('.checkbox');
        $checkbox.click();

        expect($scope.isSelected).to.be.false;

        $scope.disabled = false;
        $scope.$digest();

        $checkbox.click();
        expect($scope.isSelected).to.be.true;
      });
    });

    it('能够多选一', function () {
      inject(function ($rootScope, $compile) {
        var ids = ['1', '2', '3'];
        var $scope = $rootScope.$new();
        var tmpl = '';

        for (var i = 0; ids.length > i; i++) {
          tmpl += '<checkbox ng-model=\'selectedId\' value=\'' + ids[i] + '\'></checkbox>';
        }

        var $element = $compile(tmpl)($scope);
        _angular2.default.element(document.body).append($element);

        expect($scope.selectedId).to.be.undefined;

        var $checkbox = (0, _jquery2.default)('.checkbox');

        for (var _i = 0; $checkbox.length > _i; _i++) {
          $checkbox.eq(_i).click();
          expect($scope.selectedId).to.equal(ids[_i]);
        }
      });
    });

    it('自定义选中值', function () {
      inject(function ($rootScope, $compile) {
        var $scope = $rootScope.$new();
        var $element = $compile('<checkbox ng-model="trueValue" value="test" ng-true-value="1" ng-false-value="0"></checkbox>')($scope);

        _angular2.default.element(document.body).append($element);
        expect($scope.trueValue).to.be.undefined;

        var $checkbox = (0, _jquery2.default)('.checkbox');

        $checkbox.click();
        expect($scope.trueValue).to.equal('1');

        $checkbox.click();
        expect($scope.trueValue).to.equal('0');
      });
    });

    it('不阻止点击事件向父级广播', function () {
      inject(function ($rootScope, $compile) {
        var $scope = $rootScope.$new();
        $scope.propagation = false;
        var $element = $compile('<div ng-click="propagation=true"><checkbox></checkbox></div>')($scope);

        _angular2.default.element(document.body).append($element);

        var $checkbox = (0, _jquery2.default)('.checkbox');
        $checkbox.click();
        expect($scope.propagation).to.be.true;
      });
    });

    it('阻止点击事件向父级广播', function () {
      inject(function ($rootScope, $compile) {
        var $scope = $rootScope.$new();
        $scope.propagation = false;
        var tmpl = '<div ng-click="propagation=true"><checkbox stop-propagation prevent-default></checkbox></div>';
        var $element = $compile(tmpl)($scope);

        _angular2.default.element(document.body).append($element);

        var $checkbox = (0, _jquery2.default)('.checkbox');
        $checkbox.click();
        expect($scope.propagation).to.be.false;
      });
    });

    it('当model不为boolean类型时，而又给model值设为boolean类型', function () {
      inject(function ($rootScope, $compile) {
        var $scope = $rootScope.$new();
        var $element = $compile('<checkbox ng-model="selectedValue" value="1" ng-false-value="2"></checkbox>')($scope);

        _angular2.default.element(document.body).append($element);

        $scope.selectedValue = true;
        $scope.$digest();
        expect($scope.selectedValue).to.equal('1');

        $scope.selectedValue = false;
        $scope.$digest();
        expect($scope.selectedValue).to.equal('2');
      });
    });
  });
}); /* eslint max-nested-callbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */