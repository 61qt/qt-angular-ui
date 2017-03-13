export default function () {
  return {
    restrict : 'A',
    require  : '^checkbox',
    scope    : false,
    link ($scope, $element, $attrs, ctrl) {
      ctrl.select = function (isChecked, trigger = true, force = false) {
        isChecked = !!isChecked;

        if (force || isChecked !== $element.prop('checked')) {
          $element
          .prop('checked', isChecked)
          .attr('checked', isChecked);

          trigger && $element.triggerHandler('change');
        }
      };

      ctrl.toggle = function (isChecked, trigger, force) {
        ctrl.select(isChecked, trigger, force);
      };

      $element
      .on('change', function () {
        $scope.toggle(!!$element.prop('checked'));

        // 继承 ngChange
        $scope.ngChange && $scope.ngChange();
      });
    }
  };
}
