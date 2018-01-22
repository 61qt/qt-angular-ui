'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Name = undefined;

require('./stylesheet.scss');

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _module = require('../../share/module');

var _template = require('./template.pug');

var _template2 = _interopRequireDefault(_template);

var _modal = require('./modal.pug');

var _modal2 = _interopRequireDefault(_modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Name = exports.Name = 'QtNgUi.Calendar';
exports.default = Name;


if (!(0, _module.exists)(Name)) {
  var App = (0, _module.def)(Name, []);

  var _startTime = function _startTime(date) {
    return date.date(1).day(0).hour(0).minute(0).second(0).millisecond(0);
  };

  var _buildMonth = function _buildMonth($scope, month) {
    $scope.weeks = [];

    var done = false;
    var date = _startTime(month.clone());
    var monthIndex = date.month();
    var count = 0;

    while (!done) {
      $scope.weeks.push({
        days: _buildWeek(date.clone(), month, $scope)
      });

      date.add(1, 'w');
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }
  };

  var _buildWeek = function _buildWeek(date, month) {
    var days = [];

    for (var i = 0; i < 7; i++) {
      days.push({
        name: date.format('dd').substring(0, 1),
        number: date.date(),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), 'day'),
        date: date
      });

      date = date.clone();
      date.add(1, 'd');
    }

    return days;
  };

  var Calendar = function Calendar() {
    return {
      restrict: 'E',
      replace: true,
      template: _template2.default,
      require: '?^ngModel',
      scope: {
        selected: '=?ngModel'
      },
      link: function link($scope, $element, $attrs) {
        var isDisabled = $attrs.hasOwnProperty('disabled');

        $scope.selected = (0, _isArray2.default)($scope.selected) ? $scope.selected : [];
        $scope.month = $scope.selected[0] ? (0, _moment2.default)($scope.selected[0]) : (0, _moment2.default)();

        _buildMonth($scope, $scope.month);

        $scope.select = function (day) {
          if (isDisabled) {
            return;
          }

          var date = day.date.format('YYYY-MM-DD');
          var index = $scope.selected.indexOf(date);

          index === -1 ? $scope.selected.push(date) : $scope.selected.splice(index, 1);
        };

        $scope.isSelected = function (day) {
          var date = day.date.format('YYYY-MM-DD');
          return $scope.selected.indexOf(date) !== -1;
        };

        $scope.redirectYear = function (number) {
          $scope.month.date(1).year(number);
          _buildMonth($scope, $scope.month);
        };

        $scope.redirectMonth = function (number) {
          $scope.month.date(1).month(number);
          _buildMonth($scope, $scope.month);
        };

        $scope.focus = function (date) {
          var month = (0, _moment2.default)(date);
          if (!month.isValid()) {
            return false;
          }

          $scope.month = month.clone();
          _buildMonth($scope, $scope.month);
        };

        $scope.next = function () {
          $scope.month.add(1, 'M');
          _buildMonth($scope, $scope.month);
        };

        $scope.previous = function () {
          $scope.month.subtract(1, 'M');
          _buildMonth($scope, $scope.month);
        };
      }
    };
  };

  var Modal = ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: _modal2.default,
      require: '?^ngModel',
      scope: {
        isOpen: '=?ngModel'
      },
      link: function link($scope, $element, $attrs, ctrl, transclude) {
        $scope.isOpen = false;

        $element.find('section').append(transclude());

        $scope.$watch('isOpen', function (isOpen) {
          _angular2.default.element(document.body).toggleClass('calendar-modal-open', isOpen);

          if (isOpen) {
            $element.removeClass('hide');
            $element[0].focus();

            $timeout(function () {
              return $element.addClass('in');
            }, 10);
          } else {
            $element.removeClass('in');
            $timeout(function () {
              return $element.addClass('hide');
            }, 350);
          }
        });
      }
    };
  }];

  App.directive('calendar', Calendar);
  App.directive('calendarModal', Modal);
}