import './stylesheet.scss'

import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import isBoolean from 'lodash/isBoolean'
import angular from 'angular'
import Template from './template.pug'

const App = angular.module('QtNgUi.Radio', [])

const Controller = function ($scope) {
  'ngInject'

  $scope.checked = false
}

const Component = function ($rootScope) {
  'ngInject'

  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    controller: Controller,
    template: Template,
    require: ['^radio', '^?ngModel'],
    scope: {
      model: '=?ngModel',
      ngChecked: '=?ngChecked',
      ngDisabled: '=?ngDisabled',
      ngChange: '&'
    },
    link ($scope, $element, $attrs, ctrls) {
      let RadioCtrl = ctrls[0]

      $scope.attrId = $attrs.id
      $scope.attrName = $attrs.ngModel || `radio-${Date.now() + Math.round(Math.random() * 100)}`

      $scope.attrValue = $attrs.hasOwnProperty('value') ? $attrs.value : true
      $scope.attrNgTrueValue = $attrs.hasOwnProperty('ngTrueValue') ? $attrs.ngTrueValue : $scope.attrValue
      $scope.attrNgFalseValue = $attrs.hasOwnProperty('ngFalseValue') ? $attrs.ngFalseValue : false

      $scope.attrNgChecked = $attrs.ngChecked
      $scope.disabled = $attrs.hasOwnProperty('disabled')
      $scope.checked = isBoolean($scope.ngModel) ? $scope.ngModel : $attrs.hasOwnProperty('checked')

      $scope.stopPropagation = $attrs.hasOwnProperty('stopPropagation')
      $scope.preventDefault = $attrs.hasOwnProperty('preventDefault')

      $scope.toggle = (isCheck) => {
        isCheck = angular.isDefined(isCheck) ? !!isCheck : !$scope.checked
        $scope.checked = isCheck
      }

      $element
        .removeAttr('id')
        .on('click', (event) => {
          if ($scope.stopPropagation) {
            event.stopPropagation()
          }

          if ($scope.preventDefault) {
            event.preventDefault()
          }

          if ($scope.disabled) {
            event.preventDefault()
            event.stopPropagation()
            return false
          }

          $scope.toggle(true)
          RadioCtrl.toggle && RadioCtrl.toggle($scope.checked)

          $rootScope.$apply(() => {
            $scope.model = $scope.attrValue
          })
        })

      $scope.$watch('ngChecked', (isChecked) => {
        if (angular.isDefined(isChecked)) {
          $element.attr('checked', isChecked)
          $scope.toggle(!!isChecked)
          RadioCtrl.toggle(isChecked)
          $scope.model = $scope.checked ? $scope.attrNgTrueValue : $scope.attrNgFalseValue
        }
      })

      $scope.$watch('ngDisabled', function (isDisabled) {
        if (typeof isDisabled === 'boolean') {
          $scope.disabled = isDisabled
        }
      })

      $scope.$watch('model', (value) => {
        /* eslint eqeqeq: off */
        let isChecked = $scope.checked = value === true || value == $scope.attrNgTrueValue

        /**
         * 当不知道 model 为 true 或 false 的值时,
         * 重复设置一次 model 的相对 true/false 的值.
         * 会触发多一次 $watch 事件
         */
        if ($scope.attrNgTrueValue !== true && value === true) {
          $scope.model = $scope.attrNgTrueValue
        } else if ($scope.attrNgFalseValue !== false && value === false) {
          $scope.model = $scope.attrNgFalseValue
        }

        $element.attr('checked', isChecked)
        $scope.toggle(isChecked)

        /**
         * 这里不能触发 change 事件, 否则会再次触发关联者的再次 $digest
         */
        RadioCtrl.toggle(isChecked, false)
      })

      RadioCtrl.unchecked = function () {
        $element.removeAttr('checked')
      }

      if (angular.isUndefined($scope.model)) {
        $scope.model = $scope.checked ? $scope.attrNgTrueValue : $scope.attrNgFalseValue
      }
    }
  }
}

const Origin = function () {
  return {
    restrict: 'A',
    require: '^radio',
    link ($scope, $element, $attrs, ctrl) {
      ctrl.select = function (isChecked, trigger = true, force = false) {
        isChecked = !!isChecked

        if (force || isChecked !== $element.prop('checked')) {
          if ($scope.attrName) {
            let radioes = filter(document.getElementsByTagName('input'), function (input) {
              return input.type === 'radio' && input.name === $scope.attrName
            })

            forEach(radioes, function (radio) {
              if (radio !== $element[0]) {
                let $radio = angular.element(radio)

                $radio
                  .prop('checked', false)
                  .removeAttr('checked')

                trigger && $radio.triggerHandler('change')
              }
            })
          }

          $element
            .prop('checked', true)
            .attr('checked', true)

          trigger && $element.triggerHandler('change')
        }
      }

      ctrl.toggle = (isCheck) => {
        isCheck && ctrl.select()
      }

      $element
        .on('change', function () {
          let checked = !!angular.element(this).prop('checked')
          $scope.toggle(checked)
          checked === false && ctrl.unchecked()
        })
    }
  }
}

App.directive('radio', Component)
App.directive('radioOrigin', Origin)

export default App.name
