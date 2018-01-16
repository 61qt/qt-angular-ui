import isBoolean from 'lodash/isBoolean'
import isInteger from 'lodash/isInteger'
import isFunction from 'lodash/isFunction'
import TransitionEnd from '../share/transitionEnd'

export const config = {
  displayClass: 'in',
  animationClass: 'fade',
  duration: 260,
  padding: 10
}

export const FlashController = [
  '$scope',
  function ($scope) {
    this.$scope = $scope

    this.configure = function ($scope = this.$scope, $element, options) {
      this.$scope = this.$scope
      this.$element = $element

      if (isInteger(options.duration)) {
        $scope.duration = options.duration
      }

      if (options.displayClass) {
        $scope.displayClass = options.displayClass
      }

      if (options.animationClass) {
        $scope.animationClass = options.animationClass
      }
    }

    this.show = function ($scope = this.$scope, $element = this.$element, callback) {
      if ($scope.isOpen === true) {
        return
      }

      this.transitPromise && this.transitPromise.remove()

      setTimeout(() => {
        this.transitPromise = TransitionEnd($element, callback, $scope.duration)
        $element.addClass($scope.animationClass)
        $scope.isOpen = true
      }, 10)

      this.$element.addClass($scope.displayClass)
    }

    this.hide = function ($scope = this.$scope, $element = this.$element, callback, force) {
      if ($scope.isOpen === false && force !== true) {
        return
      }

      let afterFadeOut = () => {
        this.$element.removeClass($scope.displayClass)
        isFunction(callback) && callback()
      }

      this.transitPromise && this.transitPromise.remove()
      this.transitPromise = TransitionEnd(this.$element, afterFadeOut, $scope.duration)
      this.$element.removeClass($scope.animationClass)
      $scope.isOpen = false
    }

    this.dismiss = function ($scope = this.$scope, $element = this.$element, callback, force) {
      if (isBoolean(callback)) {
        return this.dismiss($scope, $element, null, callback)
      }

      this.destroying = true

      this.hide($scope, $element, function () {
        $element.remove()
        $scope.$destroy()

        isFunction(callback) && callback()
      }, force)
    }

    $scope.isOpen = false
    $scope.displayClass = config.dismiss
    $scope.animationClass = config.animationClass
    $scope.duration = config.duration
    $scope.padding = config.padding
  }
]
