import _        from 'lodash';
import Template from './index.pug';

export default function ($lazier) {
  'ngInject';

  return {
    restrict   : 'AE',
    transclude : true,
    replace    : true,
    template   : Template,
    require    : ['^?ngModel'],
    scope      : {
      imageSrc: '=?ngModel',
    },
    link ($scope, $element, $attrs) {
      $scope.state = 'idle';
      $scope.finished = false;

      $scope.errorholder = $attrs.errorholder || $lazier.defaults.errorholder;
      $scope.placeholder = $attrs.placeholder || $lazier.defaults.placeholder;
      $scope.imageSrc    = $scope.imageSrc || $attrs.lazierSrc || '';

      if (_.isEmpty($scope.imageSrc)) {
        return false;
      }

      $scope.onload = function (callback) {
        let element       = $element[0];
        let { top, left } = element.getBoundingClientRect();

        if ($scope.finished) {
          return true;
        }

        if (top > -element.clientHeight && top < window.innerHeight
         && left > -element.clientWidth && left < window.innerWidth) {
          $scope.state = 'loading';

          let image = new Image();

          image.onload = function () {
            $scope.state = 'success';
            $scope.finished = true;

            _.isFunction(callback) && callback(null, $scope.imageSrc, $scope);

            $scope.$digest();
          };

          image.onerror = function (error) {
            $scope.state = 'error';
            $scope.finished = true;
            _.isFunction(callback) && callback(error, $scope.imageSrc, $scope);

            $scope.$digest();
          };

          image.src = $scope.imageSrc;
          return true;
        }

        return false;
      };

      $lazier.bind($scope);
    },
  };
}
