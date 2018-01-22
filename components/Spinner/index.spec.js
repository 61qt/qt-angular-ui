'use strict';

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

require('angular-mocks');

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Spinner 组件', function () {
  var _angular$mock = _angular2.default.mock,
      module = _angular$mock.module,
      inject = _angular$mock.inject;


  beforeEach(function () {
    // 初始化 Spinner 组件
    module(_index2.default);

    // 清场
    document.body.innerHTML = '';
  });

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(_index2.default).to.be.a('string');
    });

    it('能够进行初始化', function () {
      inject(function ($rootScope, $compile) {
        var $element = $compile('<spinner></spinner>')($rootScope.$new());
        expect($element.find('circle').length).to.equal(1);
      });
    });
  });
}); /* eslint max-nested-callbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */