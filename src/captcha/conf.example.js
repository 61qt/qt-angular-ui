import _ from 'lodash';
import angular from 'angular';

export default angular.module('qtAngularUi.captchaConfExample', [])
.config(function ($uiCaptchaProvider) {
  let uri = angular.parseUrl(document.location.href);

  $uiCaptchaProvider.configure({
    captchaUrl: `${_.trimEnd(`${uri.scheme}://student-api.${uri.rootDomain}`, '/')}/common/captcha`,
  });
})
.name;
