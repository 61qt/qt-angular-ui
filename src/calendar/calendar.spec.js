/* eslint max-nested-callbacks: off */
/* eslint-env mocha */
/* global expect */

import _        from 'lodash';
import moment   from 'moment';
import angular  from 'angular';
import 'angular-mocks';

import $        from 'jquery';
import Calendar from './index';

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

describe('calendar 组件', function () {
  const { module, inject } = angular.mock;
  const template           = '<calendar-modal ng-model = "isOpenCalendar"><calendar ng-model = "schooltimes"></calendar></calendar-modal>';
  const templateDisabled   = '<calendar-modal ng-model = "isOpenCalendar"><calendar ng-model = "schooltimes" disabled></calendar></calendar-modal>';

  beforeEach(function () {
    // 初始化 Calendar 组件
    module(Calendar);

    // 清场
    document.body.innerHTML = '';
  });

  describe('结构规范', function () {
    it('会返回组件名称', function () {
      expect(Calendar).to.be.a('string');
    });

    it('能进行初始化', function () {
      inject(function ($rootScope, $compile) {
        let $element    = $compile(template)($rootScope.$new());
        let $modalScope = $element.children().scope();
        let $scope      = {};
        let elems       = $element.find('div');

        angular.forEach(elems, function (e) {
          let elem = angular.element(e);
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
        let $element    = $compile(template)($rootScope.$new());
        let $modalScope = $element.children().scope();

        let watchIsOpen = _.find($modalScope.$$watchers, { exp: 'isOpen' });

        expect($modalScope.isOpen).to.be.a('boolean');
        expect(watchIsOpen.exp).to.be.a('string');

        let $scope = {};
        let elems  = $element.find('div');

        angular.forEach(elems, function (e) {
          let elem = angular.element(e);

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
        let $newScope            = $rootScope.$new();
        $newScope.isOpenCalendar = false;
        let $element             = $compile(template)($newScope);
        let $elementScope        = $element.scope();
        let $scope               = $element.children().scope();

        angular.element(document.body).append($element);

        expect($scope.isOpen).to.be.false;
        expect(angular.element(document.body).hasClass('calendar-modal-open')).to.be.false;

        // 打开
        $elementScope.isOpenCalendar = true;

        $elementScope.$digest();
        expect($scope.isOpen).to.be.true;
        expect(angular.element(document.body).hasClass('calendar-modal-open')).to.be.true;
        expect($element.hasClass('in')).to.be.false;
        expect($element.hasClass('hide')).to.be.false;

        $timeout.flush();
        expect($element.hasClass('in')).to.be.true;

        // 关闭
        // $('.calendar-backdrop').click();
        clickElement($('.calendar-modal>a.button')[0]);
        $('.calendar-modal>a.button').click();

        expect($elementScope.isOpenCalendar).to.be.false;
        expect($scope.isOpen).to.be.false;
        expect(angular.element(document.body).hasClass('calendar-modal-open')).to.be.false;
        expect($element.hasClass('in')).to.be.false;
        expect($element.hasClass('hide')).to.be.false;

        $timeout.flush();
        expect($element.hasClass('hide')).to.be.true;
      });
    });

    it('能够初始化激活的日期', function () {
      inject(function ($rootScope, $compile) {
        let $newScope         = $rootScope.$new();
        $newScope.schooltimes = [new Date('2017-02-02')];
        let $element          = $compile(template)($newScope);

        angular.element(document.body).append($element);

        let $scope = angular.element($('.calendar')[0].childNodes[0]).scope();

        expect($scope.selected).to.equal($newScope.schooltimes);
      });
    });

    it('能够初始化第一个月', function () {
      inject(function ($rootScope, $compile) {
        let $element = $compile(template)($rootScope.$new());

        angular.element(document.body).append($element);

        let $scope = angular.element($('.calendar')[0].childNodes[0]).scope();
        let month  = moment();
        let date   = month.clone();

        date
        .date(1)
        .day(0)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);

        for (let i = 0; 5 > i; i ++) {
          for (let j = 0; 7 > j; j ++) {
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
        let $newScope         = $rootScope.$new();
        $newScope.schooltimes = [moment(new Date()).format('YYYY-MM-DD')];
        let $element          = $compile(template)($newScope);

        angular.element(document.body).append($element);

        let $scope = angular.element($('.calendar')[0].childNodes[0]).scope();
        $scope.$digest();

        let $days = $('div.day');

        for (let i = 0; $days.length > i; i ++) {
          let $dayScope  = angular.element($days[i].childNodes[0]).scope();
          let date       = $dayScope.day.date.format('YYYY-MM-DD');
          let index      = $scope.selected.indexOf(date);

          if ($scope.isSelected($dayScope.day)) {
            expect(index).to.not.equal(-1);

            $days.eq(i).click();
            index = $scope.selected.indexOf(date);
            expect(index).to.equal(-1);
          }
          else {
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
        let $newScope         = $rootScope.$new();
        $newScope.schooltimes = [moment(new Date()).format('YYYY-MM-DD')];
        let $element          = $compile(templateDisabled)($newScope);

        angular.element(document.body).append($element);

        let $scope = angular.element($('.calendar')[0].childNodes[0]).scope();
        $scope.$digest();

        let $days = $('div.day');

        for (let i = 0; $days.length > i; i ++) {
          let $dayScope = angular.element($days[i].childNodes[0]).scope();
          let date      = $dayScope.day.date.format('YYYY-MM-DD');
          let index     = $scope.selected.indexOf(date);

          if ($scope.isSelected($dayScope.day)) {
            expect(index).to.not.equal(-1);

            $days.eq(i).click();
            index = $scope.selected.indexOf(date);
            expect(index).to.not.equal(-1);
          }
          else {
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
        let $element = $compile(template)($rootScope.$new());

        angular.element(document.body).append($element);

        let $scope = angular.element($('.calendar')[0].childNodes[0]).scope();
        let year   = 2008;
        let month  = $scope.month.clone();

        $scope.redirectYear(year);
        month.date(1).year(year);
        let date = month.clone();

        date
        .date(1)
        .day(0)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);

        for (let i = 0; 5 > i; i ++) {
          for (let j = 0; 7 > j; j ++) {
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
        let $newScope         = $rootScope.$new();
        $newScope.schooltimes = [new Date('2017-02-02')];
        let $element          = $compile(template)($newScope);

        angular.element(document.body).append($element);

        let $scope = angular.element($('.calendar')[0].childNodes[0]).scope();
        let month  = $scope.month.clone();

        $scope.redirectMonth(5);
        month.date(1).month(5);

        let date = month.clone();

        date
        .date(1)
        .day(0)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);

        for (let i = 0; 5 > i; i ++) {
          for (let j = 0; 7 > j; j ++) {
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
        let $newScope         = $rootScope.$new();
        $newScope.schooltimes = [new Date('2017-02-02')];
        let $element          = $compile(template)($newScope);

        angular.element(document.body).append($element);

        let $scope = angular.element($('.calendar')[0].childNodes[0]).scope();
        let month  = moment('2008-01-02');
        let date   = month.clone();

        expect($scope.focus('sdfa.,.9**-/,.-')).to.be.false;

        $scope.focus('2008-01-02');

        date
        .date(1)
        .day(0)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);

        for (let i = 0; 5 > i; i ++) {
          for (let j = 0; 7 > j; j ++) {
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
        let $newScope         = $rootScope.$new();
        $newScope.schooltimes = [new Date('2017-02-02')];
        let $element          = $compile(template)($newScope);

        angular.element(document.body).append($element);

        let $scope = angular.element($('.calendar')[0].childNodes[0]).scope();
        let month  = $scope.month.clone();

        $scope.next();
        month.add(1, 'M');

        let date = month.clone();

        date
        .date(1)
        .day(0)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);

        for (let i = 0; 5 > i; i ++) {
          for (let j = 0; 7 > j; j ++) {
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
        let $newScope         = $rootScope.$new();
        $newScope.schooltimes = [new Date('2017-02-02')];
        let $element          = $compile(template)($newScope);

        angular.element(document.body).append($element);

        let $scope = angular.element($('.calendar')[0].childNodes[0]).scope();
        let month  = $scope.month.clone();

        $scope.previous();
        month.subtract(1, 'M');

        let date = month.clone();

        date
        .date(1)
        .day(0)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);

        for (let i = 0; 5 > i; i ++) {
          for (let j = 0; 7 > j; j ++) {
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
