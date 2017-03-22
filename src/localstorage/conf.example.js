import angular from 'angular';

export default angular.module('qtAngularUi.localStorageConfExample', [])
.config(function (localStorageServiceProvider) {
  let uri = angular.parseUrl(document.location.href);

  localStorageServiceProvider
  .setPrefix('SNG_USER')
  .setStorageCookieDomain(uri.rootDomain)
  .setStorageCookie(30, '/')
  .setNotify(true, true)
  .setStorageType('localStorage');
})
.name;
