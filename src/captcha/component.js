import angular  from 'angular';
import Template from './index.jade';

export default function ($uiCaptcha) {
  return {
    restrict    : 'EA',
    replace     : true,
    template    : Template,
    scope: {
      captcha: '=?ngModel',
    },
    link ($scope, $element) {
      if (angular.isString($scope.captcha) && $scope.captcha) {
        $scope.captcha = $uiCaptcha.$change($scope.captcha);

        $scope.changeCaptcha = function () {
          $scope.captcha = $uiCaptcha.$change($scope.captcha);
        };
      }
      else {
        $uiCaptcha.$add($scope);
        $scope.captcha = $uiCaptcha.captchaUrl;

        $scope.changeCaptcha = function () {
          $uiCaptcha.change();
        };
      }

      $element.on('click', function () {
        $scope.changeCaptcha();
        $scope.$digest();
      });

      $scope.$on('captcha.change', function () {
        $scope.changeCaptcha();
      });

      $scope.changeCaptcha();
    }
  };
}
