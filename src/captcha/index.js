import angular          from 'angular';
import CaptchaProvider  from './providor';
import CaptchaComponent from './component';

export default angular.module('qtAngularUi.captcha', [])
.provider('$uiCaptcha', CaptchaProvider)
.directive('captcha', CaptchaComponent)
.name;
