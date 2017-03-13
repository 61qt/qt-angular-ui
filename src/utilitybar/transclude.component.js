export default function () {
  return {
    restrict : 'EA',
    require  : '^utilitybar',
    link ($scope, $element, $attrs, ctrl) {
      ctrl.clean = function () {
        $element.html('');
      };

      ctrl.transclude = function (content) {
        $element.append(content);
      };
    },
  };
}
