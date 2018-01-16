import './stylesheet.scss'

import isArray from 'lodash/isArray'
import moment from 'moment'
import angular from 'angular'
import Template from './template.pug'
import ModalTemplate from './modal.pug'

const App = angular.module('QtNgUi.Calendar', [])

const _startTime = function (date) {
  return date
    .date(1)
    .day(0)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0)
}

const _buildMonth = function ($scope, month) {
  $scope.weeks = []

  let done = false
  let date = _startTime(month.clone())
  let monthIndex = date.month()
  let count = 0

  while (!done) {
    $scope.weeks.push({
      days: _buildWeek(date.clone(), month, $scope)
    })

    date.add(1, 'w')
    done = count++ > 2 && monthIndex !== date.month()
    monthIndex = date.month()
  }
}

const _buildWeek = function (date, month) {
  let days = []

  for (let i = 0; i < 7; i++) {
    days.push({
      name: date.format('dd').substring(0, 1),
      number: date.date(),
      isCurrentMonth: date.month() === month.month(),
      isToday: date.isSame(new Date(), 'day'),
      date: date
    })

    date = date.clone()
    date.add(1, 'd')
  }

  return days
}

const Calendar = function () {
  return {
    restrict: 'E',
    replace: true,
    template: Template,
    require: '?^ngModel',
    scope: {
      selected: '=?ngModel'
    },
    link ($scope, $element, $attrs) {
      let isDisabled = $attrs.hasOwnProperty('disabled')

      $scope.selected = isArray($scope.selected) ? $scope.selected : []
      $scope.month = $scope.selected[0] ? moment($scope.selected[0]) : moment()

      _buildMonth($scope, $scope.month)

      $scope.select = function (day) {
        if (isDisabled) {
          return
        }

        let date = day.date.format('YYYY-MM-DD')
        let index = $scope.selected.indexOf(date)

        index === -1
          ? $scope.selected.push(date)
          : $scope.selected.splice(index, 1)
      }

      $scope.isSelected = function (day) {
        let date = day.date.format('YYYY-MM-DD')
        return $scope.selected.indexOf(date) !== -1
      }

      $scope.redirectYear = function (number) {
        $scope.month.date(1).year(number)
        _buildMonth($scope, $scope.month)
      }

      $scope.redirectMonth = function (number) {
        $scope.month.date(1).month(number)
        _buildMonth($scope, $scope.month)
      }

      $scope.focus = function (date) {
        let month = moment(date)
        if (!month.isValid()) {
          return false
        }

        $scope.month = month.clone()
        _buildMonth($scope, $scope.month)
      }

      $scope.next = function () {
        $scope.month.add(1, 'M')
        _buildMonth($scope, $scope.month)
      }

      $scope.previous = function () {
        $scope.month.subtract(1, 'M')
        _buildMonth($scope, $scope.month)
      }
    }
  }
}

const Modal = [
  '$rootScope', '$timeout',
  function ($rootScope, $timeout) {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: ModalTemplate,
      require: '?^ngModel',
      scope: {
        isOpen: '=?ngModel'
      },
      link ($scope, $element, $attrs, ctrl, transclude) {
        $scope.isOpen = false

        $element.find('section').append(transclude())

        $scope.$watch('isOpen', (isOpen) => {
          angular
            .element(document.body)
            .toggleClass('calendar-modal-open', isOpen)

          if (isOpen) {
            $element.removeClass('hide')
            $element[0].focus()

            $timeout(() => $element.addClass('in'), 10)
          } else {
            $element.removeClass('in')
            $timeout(() => $element.addClass('hide'), 350)
          }
        })
      }
    }
  }
]

App.directive('calendar', Calendar)
App.directive('calendarModal', Modal)

export default App.name
