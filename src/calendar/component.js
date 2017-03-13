import _        from 'lodash';
import moment   from 'moment';
import Template from './index.jade';

export default function () {
  return {
    restrict : 'E',
    replace  : true,
    template : Template,
    require  : '?^ngModel',
    scope    : {
      selected: '=?ngModel',
    },
    link ($scope, $element, $attrs) {
      let isDisabled = $attrs.hasOwnProperty('disabled');

      $scope.selected = _.isArray($scope.selected) ? $scope.selected : [];
      $scope.month    = $scope.selected[0] ? moment($scope.selected[0]) : moment();

      let start = $scope.month.clone();
      start.date(1);

      _removeTime(start.day(0));
      _buildMonth($scope, start, $scope.month);

      $scope.select = function (day) {
        if (isDisabled) {
          return;
        }

        let date  = day.date.format('YYYY-MM-DD');
        let index = $scope.selected.indexOf(date);

        -1 === index
        ? $scope.selected.push(date)
        : $scope.selected.splice(index, 1);
      };

      $scope.isSelected = function (day) {
        let date = day.date.format('YYYY-MM-DD');
        return -1 !== $scope.selected.indexOf(date);
      };

      $scope.focus = function (next) {
        _buildMonth($scope, next, $scope.month);
      };

      $scope.next = function () {
        let next = $scope.month.clone();
        _removeTime(next.month(next.month() + 1).date(1));

        $scope.month.month($scope.month.month() + 1);
        _buildMonth($scope, next, $scope.month);
      };

      $scope.previous = function () {
        let previous = $scope.month.clone();
        _removeTime(previous.month(previous.month() - 1).date(1));

        $scope.month.month($scope.month.month() - 1);
        _buildMonth($scope, previous, $scope.month);
      };
    }
  };

  function _removeTime (date) {
    return date
      .day(0)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);
  }

  function _buildMonth ($scope, start, month) {
    $scope.weeks = [];

    let done       = false;
    let date       = start.clone();
    let monthIndex = date.month();
    let count      = 0;

    while (!done) {
      $scope.weeks.push({
        days: _buildWeek(date.clone(), month, $scope),
      });

      date.add(1, 'w');
      done = 2 < count ++ && monthIndex !== date.month();
      monthIndex = date.month();
    }
  }

  function _buildWeek (date, month) {
    let days = [];

    for (let i = 0; 7 > i; i ++) {
      days.push({
        name           : date.format('dd').substring(0, 1),
        number         : date.date(),
        isCurrentMonth : date.month() === month.month(),
        isToday        : date.isSame(new Date(), 'day'),
        date           : date,
      });

      date = date.clone();
      date.add(1, 'd');
    }

    return days;
  }
}
