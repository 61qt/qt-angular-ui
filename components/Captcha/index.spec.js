'use strict';

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

require('angular-mocks');

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var clickElement = function clickElement(el) {
  var event = document.createEvent('MouseEvent');
  event.initMouseEvent('click', true, true, window, null, 0, 0, 0, 0, false, false, false, false, 0, null);
  el.dispatchEvent(event);
}; /* eslint max-nested-acllbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */

describe('Captcha 组件', function () {
  var _angular$mock = _angular2.default.mock,
      module = _angular$mock.module,
      inject = _angular$mock.inject;

  var CAPTCHAURL = '//student-api.61qt.cn/common/captcha';
  var CAPTCHAURLREGEXP = new RegExp(CAPTCHAURL + '\\?v=');

  beforeEach(function () {
    /* eslint no-undef:0 */
    _angular2.default.env = {
      QT_UI_LOG: false

      // 初始化 Captcha 组件
    };module(_index2.default);

    // 清场
    document.body.innerHTML = '';
  });

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(_index2.default).to.be.a('string');
    });

    it('能进行初始化', function () {
      inject(function ($rootScope, $compile) {
        var $newSopen = $rootScope.$new();
        $newSopen.captcha = CAPTCHAURL;
        var $element = $compile('<captcha ng-model="captcha"></captcha>')($newSopen);
        var $scope = $element.children().scope();

        expect(CAPTCHAURLREGEXP.test($scope.captcha)).to.be.true;
      });
    });

    it('应该拥有额定的结构', function () {
      inject(function ($rootScope, $compile) {
        var $element = $compile('<captcha></captcha>')($rootScope.$new());
        var $scope = _angular2.default.element($element[0].childNodes[0]).scope();

        expect($scope.captcha).to.be.a('string');
        expect($scope.changeCaptcha).to.be.a('function');
        expect($scope.$$listenerCount['captcha.change']).to.be.a('number');
        expect($scope.$$listenerCount.$destroy).to.be.a('number');
      });
    });
  });

  describe('触发流程', function () {
    it('能够点击刷新图片验证码', function () {
      inject(function ($rootScope, $compile) {
        var $newSopen = $rootScope.$new();
        $newSopen.captcha = CAPTCHAURL;

        var $element = $compile('<captcha class="captcha" ng-model="captcha"></captcha>')($newSopen);
        var $scope = $element.children().scope();

        _angular2.default.element(document.body).append($element);
        $scope.$digest();

        var captcha = document.getElementsByClassName('captcha');
        var captchaImage = _angular2.default.element(captcha).find('img');
        var oldCaptcha = captchaImage.attr('src');

        expect(oldCaptcha).to.equal($scope.captcha);

        clickElement(captcha[0]);
        $scope.$digest();

        var newCaptcha = captchaImage.attr('src');
        expect(newCaptcha).to.equal($scope.captcha);
        expect(newCaptcha).to.not.equal(oldCaptcha);
      });
    });

    it('能够接收广播', function (done) {
      inject(function ($rootScope, $compile, $timeout) {
        var $newSopen = $rootScope.$new();
        $newSopen.captcha = CAPTCHAURL;

        var $element = $compile('<captcha class="captcha" ng-model="captcha"></captcha>')($newSopen);
        var $scope = $element.children().scope();
        var $parentScope = $element.scope();

        _angular2.default.element(document.body).append($element);

        var captcha = $scope.captcha;

        var broadcast = function broadcast() {
          $parentScope.$broadcast('captcha.change');

          expect(captcha).to.not.equal($scope.captcha);
          done();
        };

        $timeout.flush();
        setTimeout(broadcast, 1);
      });
    });
  });

  describe('服务', function () {
    it('能够配置', function () {
      module(function ($uiCaptchaProvider) {
        $uiCaptchaProvider.configure({
          url: CAPTCHAURL
        });
      });

      inject(function ($uiCaptcha) {
        expect($uiCaptcha.settings.url).to.equal(CAPTCHAURL);
      });
    });

    it('没配置提示', function () {
      /* eslint no-undef:0 */
      _angular2.default.env = {
        QT_UI_LOG: true
      };

      inject(function ($uiCaptcha) {
        expect($uiCaptcha.settings.url).to.equal('');
      });
    });

    it('刷新地址为空返回空值', function () {
      inject(function ($uiCaptcha) {
        expect($uiCaptcha.$change('')).to.equal('');
      });
    });
  });
});