import angular from 'angular';

export default function () {
  return {
    restrict : 'A',
    scope    : false,
    link ($scope, $element, $attrs) {
      if (!angular.collect || 'function' !== typeof angular.collect) {
        console.warning('[tracker dependent]: angular.collect is not define');
        return;
      }
      $element.on('click', function () {
        let data = $attrs.tracker.split(':');
        angular.collect('UA')(data[0], data[1] || '');
      });
    },
  };
}
