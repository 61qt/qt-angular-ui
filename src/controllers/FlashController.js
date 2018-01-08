import isInteger from 'lodash/isInteger'
import isFunction from 'lodash/isFunction'
import TransitionEnd from '../share/transitionEnd'

export const config = {
  displayClass: 'in',
  animationClass: 'fade',
  duration: 260,
  delay: 2500,
  padding: 10
}

export class FlashController {
  constructor ($scope) {
    this.$scope = $scope

    $scope.isOpen = false
    $scope.displayClass = config.dismiss
    $scope.animationClass = config.animationClass
    $scope.duration = config.duration
    $scope.delay = config.delay
    $scope.padding = config.padding
  }

  configure ($scope = this.$scope, $element, options) {
    this.$scope = this.$scope
    this.$element = $element

    if (isInteger(options.duration)) {
      $scope.duration = options.duration
    }

    if (isInteger(options.delay) && options.delay > 0) {
      $scope.delay = options.delay
    }

    if (options.displayClass) {
      $scope.displayClass = options.displayClass
    }

    if (options.animationClass) {
      $scope.animationClass = options.animationClass
    }
  }

  show ($scope = this.$scope, $element = this.$element, callback) {
    if ($scope.isOpen === true) {
      return
    }

    setTimeout(() => {
      TransitionEnd($element, callback, $scope.duration)
      $element.addClass($scope.animationClass)
      $scope.isOpen = true
    }, 10)

    this.$element.addClass($scope.displayClass)
  }

  hide ($scope = this.$scope, $element = this.$element, callback) {
    if ($scope.isOpen === false) {
      return
    }

    let afterFadeOut = () => {
      this.$element.removeClass($scope.displayClass)
      isFunction(callback) && callback()
    }

    TransitionEnd(this.$element, afterFadeOut, $scope.duration)
    this.$element.removeClass($scope.animationClass)
    $scope.isOpen = false
  }

  dismiss ($scope = this.$scope, $element = this.$element, callback) {
    this.hide($scope, $element, function () {
      $element.remove()
      $scope.$destroy()

      isFunction(callback) && callback()
    })
  }
}
