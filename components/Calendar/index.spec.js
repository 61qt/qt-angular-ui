'use strict';

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

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

/**
 * $('a').click()无效的解决方法
 * @param {element} el
 * clickElement($('a')[0]);
 */
/* eslint max-nested-callbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */

var clickElement = function clickElement(el) {
  var ev = document.createEvent('MouseEvent');
  ev.initMouseEvent('click', true, true, window, null, 0, 0, 0, 0, false, false, false, false, 0, null);
  el.dispatchEvent(ev);
};

describe('Calendar 组件', function () {
  var _angular$mock = _angular2.default.mock,
      module = _angular$mock.module,
      inject = _angular$mock.inject;

  var template = '<calendar-modal ng-model = "isOpenCalendar"><calendar ng-model = "schooltimes"></calendar></calendar-modal>';
  var templateDisabled = '<calendar-modal ng-model = "isOpenCalendar"><calendar ng-model = "schooltimes" disabled></calendar></calendar-modal>';

  beforeEach(function () {
    // 初始化 Calendar 组件
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
        var $element = $compile(template)($rootScope.$new());
        var $modalScope = $element.children().scope();
        var $scope = {};
        var elems = $element.find('div');

        _angular2.default.forEach(elems, function (e) {
          var elem = _angular2.default.element(e);
          if (elem.hasClass('calendar')) {
            $scope = elem.children().scope();
          }
        });

        expect($modalScope.isOpen).to.be.false;
        expect($scope.selected).to.be.an('array');
      });
    });

    it('应该拥有额定的结构', function () {
      inject(function ($rootScope, $compile) {
        var $element = $compile(template)($rootScope.$new());
        var $modalScope = $element.children().scope();

        var watchIsOpen = (0, _find2.default)($modalScope.$$watchers, { exp: 'isOpen' });

        expect($modalScope.isOpen).to.be.a('boolean');
        expect(watchIsOpen.exp).to.be.a('string');

        var $scope = {};
        var elems = $element.find('div');

        _angular2.default.forEach(elems, function (e) {
          var elem = _angular2.default.element(e);

          if (elem.hasClass('calendar')) {
            $scope = elem.children().scope();
          }
        });

        expect($scope.selected).to.be.an('array');
        expect($scope.month).to.be.an('object');
        expect($scope.select).to.be.a('function');
        expect($scope.isSelected).to.be.a('function');
        expect($scope.focus).to.be.a('function');
        expect($scope.next).to.be.a('function');
        expect($scope.previous).to.be.a('function');
      });
    });
  });

  describe('触发流程', function () {
    it('能够打开和关闭', function () {
      inject(function ($rootScope, $compile, $timeout) {
        var $newScope = $rootScope.$new();
        $newScope.isOpenCalendar = false;
        var $element = $compile(template)($newScope);
        var $elementScope = $element.scope();
        var $scope = $element.children().scope();

        _angular2.default.element(document.body).append($element);

        expect($scope.isOpen).to.be.false;
        expect(_angular2.default.element(document.body).hasClass('calendar-modal-open')).to.be.false;

        // 打开
        $elementScope.isOpenCalendar = true;

        $elementScope.$digest();
        expect($scope.isOpen).to.be.true;
        expect(_angular2.default.element(document.body).hasClass('calendar-modal-open')).to.be.true;
        expect($element.hasClass('in')).to.be.false;
        expect($element.hasClass('hide')).to.be.false;

        $timeout.flush();
        expect($element.hasClass('in')).to.be.true;

        // 关闭
        // $('.calendar-backdrop').click();
        clickElement((0, _jquery2.default)('.calendar-modal>a.button')[0]);
        (0, _jquery2.default)('.calendar-modal>a.button').click();

        expect($elementScope.isOpenCalendar).to.be.false;
        expect($scope.isOpen).to.be.false;
        expect(_angular2.default.element(document.body).hasClass('calendar-modal-open')).to.be.false;
        expect($element.hasClass('in')).to.be.false;
        expect($element.hasClass('hide')).to.be.false;

        $timeout.flush();
        expect($element.hasClass('hide')).to.be.true;
      });
    });

    it('能够初始化激活的日期', function () {
      inject(function ($rootScope, $compile) {
        var $newScope = $rootScope.$new();
        $newScope.schooltimes = [new Date('2017-02-02')];
        var $element = $compile(template)($newScope);

        _angular2.default.element(document.body).append($element);

        var $scope = _angular2.default.element((0, _jquery2.default)('.calendar')[0].childNodes[0]).scope();

        expect($scope.selected).to.equal($newScope.schooltimes);
      });
    });

    it('能够初始化第一个月', function () {
      inject(function ($rootScope, $compile) {
        var $element = $compile(template)($rootScope.$new());

        _angular2.default.element(document.body).append($element);

        var $scope = _angular2.default.element((0, _jquery2.default)('.calendar')[0].childNodes[0]).scope();
        var month = (0, _moment2.default)();
        var date = month.clone();

        date.date(1).day(0).hour(0).minute(0).second(0).millisecond(0);

        for (var i = 0; i < 5; i++) {
          for (var j = 0; j < 7; j++) {
            expect($scope.weeks[i].days[j].name).to.equal(date.format('dd').substring(0, 1));
            expect($scope.weeks[i].days[j].number).to.equal(date.date());
            expect($scope.weeks[i].days[j].isCurrentMonth).to.equal(date.month() === month.month());
            expect($scope.weeks[i].days[j].isToday).to.equal(date.isSame(new Date(), 'day'));
            expect($scope.weeks[i].days[j].date.format()).to.equal(date.format());

            date = date.clone();
            date.add(1, 'd');
          }
        }
      });
    });

    it('能够选择日期', function () {
      inject(function ($rootScope, $compile) {
        var $newScope = $rootScope.$new();
        $newScope.schooltimes = [(0, _moment2.default)(new Date()).format('YYYY-MM-DD')];
        var $element = $compile(template)($newScope);

        _angular2.default.element(document.body).append($element);

        var $scope = _angular2.default.element((0, _jquery2.default)('.calendar')[0].childNodes[0]).scope();
        $scope.$digest();

        var $days = (0, _jquery2.default)('div.day');

        for (var i = 0; $days.length > i; i++) {
          var $dayScope = _angular2.default.element($days[i].childNodes[0]).scope();
          var date = $dayScope.day.date.format('YYYY-MM-DD');
          var index = $scope.selected.indexOf(date);

          if ($scope.isSelected($dayScope.day)) {
            expect(index).to.not.equal(-1);

            $days.eq(i).click();
            index = $scope.selected.indexOf(date);
            expect(index).to.equal(-1);
          } else {
            expect(index).to.equal(-1);

            $days.eq(i).click();
            index = $scope.selected.indexOf(date);
            expect(index).to.not.equal(-1);
          }
        }
      });
    });

    it('禁止选择日期', function () {
      inject(function ($rootScope, $compile) {
        var $newScope = $rootScope.$new();
        $newScope.schooltimes = [(0, _moment2.default)(new Date()).format('YYYY-MM-DD')];
        var $element = $compile(templateDisabled)($newScope);

        _angular2.default.element(document.body).append($element);

        var $scope = _angular2.default.element((0, _jquery2.default)('.calendar')[0].childNodes[0]).scope();
        $scope.$digest();

        var $days = (0, _jquery2.default)('div.day');

        for (var i = 0; $days.length > i; i++) {
          var $dayScope = _angular2.default.element($days[i].childNodes[0]).scope();
          var date = $dayScope.day.date.format('YYYY-MM-DD');
          var index = $scope.selected.indexOf(date);

          if ($scope.isSelected($dayScope.day)) {
            expect(index).to.not.equal(-1);

            $days.eq(i).click();
            index = $scope.selected.indexOf(date);
            expect(index).to.not.equal(-1);
          } else {
            expect(index).to.equal(-1);

            $days.eq(i).click();
            index = $scope.selected.indexOf(date);
            expect(index).to.equal(-1);
          }
        }
      });
    });

    it('能够跳转到某年', function () {
      inject(function ($rootScope, $compile) {
        var $element = $compile(template)($rootScope.$new());

        _angular2.default.element(document.body).append($element);

        var $scope = _angular2.default.element((0, _jquery2.default)('.calendar')[0].childNodes[0]).scope();
        var year = 2008;
        var month = $scope.month.clone();

        $scope.redirectYear(year);
        month.date(1).year(year);
        var date = month.clone();

        date.date(1).day(0).hour(0).minute(0).second(0).millisecond(0);

        for (var i = 0; i < 5; i++) {
          for (var j = 0; j < 7; j++) {
            expect($scope.weeks[i].days[j].name).to.equal(date.format('dd').substring(0, 1));
            expect($scope.weeks[i].days[j].number).to.equal(date.date());
            expect($scope.weeks[i].days[j].isCurrentMonth).to.equal(date.month() === month.month());
            expect($scope.weeks[i].days[j].isToday).to.equal(date.isSame(new Date(), 'day'));
            expect($scope.weeks[i].days[j].date.format()).to.equal(date.format());

            date = date.clone();
            date.add(1, 'd');
          }
        }
      });
    });

    it('能够跳转到某月份', function () {
      inject(function ($rootScope, $compile) {
        var $newScope = $rootScope.$new();
        $newScope.schooltimes = [new Date('2017-02-02')];
        var $element = $compile(template)($newScope);

        _angular2.default.element(document.body).append($element);

        var $scope = _angular2.default.element((0, _jquery2.default)('.calendar')[0].childNodes[0]).scope();
        var month = $scope.month.clone();

        $scope.redirectMonth(5);
        month.date(1).month(5);

        var date = month.clone();

        date.date(1).day(0).hour(0).minute(0).second(0).millisecond(0);

        for (var i = 0; i < 5; i++) {
          for (var j = 0; j < 7; j++) {
            expect($scope.weeks[i].days[j].name).to.equal(date.format('dd').substring(0, 1));
            expect($scope.weeks[i].days[j].number).to.equal(date.date());
            expect($scope.weeks[i].days[j].isCurrentMonth).to.equal(date.month() === month.month());
            expect($scope.weeks[i].days[j].isToday).to.equal(date.isSame(new Date(), 'day'));
            expect($scope.weeks[i].days[j].date.format()).to.equal(date.format());

            date = date.clone();
            date.add(1, 'd');
          }
        }
      });
    });

    it('能够跳转到指定日期', function () {
      inject(function ($rootScope, $compile) {
        var $newScope = $rootScope.$new();
        $newScope.schooltimes = [new Date('2017-02-02')];
        var $element = $compile(template)($newScope);

        _angular2.default.element(document.body).append($element);

        var $scope = _angular2.default.element((0, _jquery2.default)('.calendar')[0].childNodes[0]).scope();
        var month = (0, _moment2.default)('2008-01-02');
        var date = month.clone();

        expect($scope.focus('sdfa.,.9**-/,.-')).to.be.false;

        $scope.focus('2008-01-02');

        date.date(1).day(0).hour(0).minute(0).second(0).millisecond(0);

        for (var i = 0; i < 5; i++) {
          for (var j = 0; j < 7; j++) {
            expect($scope.weeks[i].days[j].name).to.equal(date.format('dd').substring(0, 1));
            expect($scope.weeks[i].days[j].number).to.equal(date.date());
            expect($scope.weeks[i].days[j].isCurrentMonth).to.equal(date.month() === month.month());
            expect($scope.weeks[i].days[j].isToday).to.equal(date.isSame(new Date(), 'day'));
            expect($scope.weeks[i].days[j].date.format()).to.equal(date.format());

            date = date.clone();
            date.add(1, 'd');
          }
        }
      });
    });

    it('能够跳转下个月', function () {
      inject(function ($rootScope, $compile) {
        var $newScope = $rootScope.$new();
        $newScope.schooltimes = [new Date('2017-02-02')];
        var $element = $compile(template)($newScope);

        _angular2.default.element(document.body).append($element);

        var $scope = _angular2.default.element((0, _jquery2.default)('.calendar')[0].childNodes[0]).scope();
        var month = $scope.month.clone();

        $scope.next();
        month.add(1, 'M');

        var date = month.clone();

        date.date(1).day(0).hour(0).minute(0).second(0).millisecond(0);

        for (var i = 0; i < 5; i++) {
          for (var j = 0; j < 7; j++) {
            expect($scope.weeks[i].days[j].name).to.equal(date.format('dd').substring(0, 1));
            expect($scope.weeks[i].days[j].number).to.equal(date.date());
            expect($scope.weeks[i].days[j].isCurrentMonth).to.equal(date.month() === month.month());
            expect($scope.weeks[i].days[j].isToday).to.equal(date.isSame(new Date(), 'day'));
            expect($scope.weeks[i].days[j].date.format()).to.equal(date.format());

            date = date.clone();
            date.add(1, 'd');
          }
        }
      });
    });

    it('能够跳转上个月', function () {
      inject(function ($rootScope, $compile) {
        var $newScope = $rootScope.$new();
        $newScope.schooltimes = [new Date('2017-02-02')];
        var $element = $compile(template)($newScope);

        _angular2.default.element(document.body).append($element);

        var $scope = _angular2.default.element((0, _jquery2.default)('.calendar')[0].childNodes[0]).scope();
        var month = $scope.month.clone();

        $scope.previous();
        month.subtract(1, 'M');

        var date = month.clone();

        date.date(1).day(0).hour(0).minute(0).second(0).millisecond(0);

        for (var i = 0; i < 5; i++) {
          for (var j = 0; j < 7; j++) {
            expect($scope.weeks[i].days[j].name).to.equal(date.format('dd').substring(0, 1));
            expect($scope.weeks[i].days[j].number).to.equal(date.date());
            expect($scope.weeks[i].days[j].isCurrentMonth).to.equal(date.month() === month.month());
            expect($scope.weeks[i].days[j].isToday).to.equal(date.isSame(new Date(), 'day'));
            expect($scope.weeks[i].days[j].date.format()).to.equal(date.format());

            date = date.clone();
            date.add(1, 'd');
          }
        }
      });
    });
  });
});