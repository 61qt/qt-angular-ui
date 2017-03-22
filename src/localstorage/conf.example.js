import angular from 'angular';

export default angular.module('qtAngularUi.localStorageConfExample', [])
.config(function (localStorageServiceProvider, LOCALSTORAGE_PREFIX) {
  let uri = angular.parseUrl(document.location.href);

  localStorageServiceProvider
  .setPrefix(LOCALSTORAGE_PREFIX)
  .setStorageCookieDomain(uri.rootDomain)
  .setStorageCookie(30, '/')
  .setNotify(true, true)
  .setStorageType('localStorage');
})
.name;
