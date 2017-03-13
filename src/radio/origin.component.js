import _       from 'lodash';
import angular from 'angular';

export default function () {
  return {
    restrict  : 'A',
    require   : '^radio',
    link ($scope, $element, $attrs, ctrl) {
      ctrl.select = function (isChecked, trigger = true, force = false) {
        isChecked = !!isChecked;

        if (force || isChecked !== $element.prop('checked')) {
          if ($scope.attrName) {
            let radioes = _.filter(document.getElementsByTagName('input'), function (input) {
              return 'radio' === input.type && input.name === $scope.attrName;
            });

            _.forEach(radioes, function (radio) {
              if (radio !== $element[0]) {
                let $radio = angular.element(radio);

                $radio
                .prop('checked', false)
                .removeAttr('checked');

                trigger && $radio.triggerHandler('change');
              }
            });
          }

          $element
          .prop('checked', true)
          .attr('checked', true);

          trigger && $element.triggerHandler('change');
        }
      };

      ctrl.toggle = (isCheck) => {
        isCheck && ctrl.select();
      };

      $element
      .on('change', function () {
        let checked = !!angular.element(this).prop('checked');
        $scope.toggle(checked);
        false === checked && ctrl.unchecked();
      });
    },
  };
}
