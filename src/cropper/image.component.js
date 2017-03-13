export default function () {
  return {
    restrict : 'A',
    require  : '^cropper',
    scope    : true,
    link ($scope, $element, $attrs, ctrl) {
      $element.on('load', function () {
        ctrl.setupCropper(this);
      });
    },
  };
}
