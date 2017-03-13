export default function () {
  return {
    restrict : 'EA',
    require  : '^switch',
    link ($scope, $element, $attrs, ctrl) {
      let transcludeName = $attrs.switchTransclude;

      ctrl.transclude[transcludeName] = function (content) {
        $element.html(content);
      };
    },
  };
}
