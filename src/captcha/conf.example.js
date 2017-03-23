import angular from 'angular';

export default angular.module('qtAngularUi.captchaConfExample', [])
.config(function ($uiCaptchaProvider) {

  let temp = location.host.split('.').reverse();
  let rootDomain = temp[1] + '.' + temp[0];
  $uiCaptchaProvider.configure({
    captchaUrl: `${location.protocol}//student-api.${rootDomain}/common/captcha`,
  });
})
.name;
