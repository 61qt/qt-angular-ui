import angular  from 'angular';
import Template from './modal.jade';

export default function ($rootScope, $timeout) {
  return {
    restrict   : 'E',
    replace    : true,
    transclude : true,
    template   : Template,
    require    : '?^ngModel',
    scope      : {
      isOpen: '=?ngModel',
    },
    link ($scope, $element, $attrs, ctrl, transclude) {
      $scope.isOpen = false;

      $element.find('section').append(transclude());

      $scope.$watch('isOpen', (isOpen) => {
        angular
        .element(document.body)
        .toggleClass('calendar-modal-open', isOpen);

        if (isOpen) {
          $element.removeClass('hide');
          $element[0].focus();

          $timeout(function () {
            $element.addClass('in');
          }, 10);
        }
        else {
          $element.removeClass('in');

          $timeout(function () {
            $element.addClass('hide');
          }, 350);
        }
      });
    }
  };
}
