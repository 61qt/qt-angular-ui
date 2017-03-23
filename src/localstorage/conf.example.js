import angular from 'angular';

export default angular.module('qtAngularUi.localStorageConfExample', [])
.config(function (localStorageServiceProvider, LOCALSTORAGE_PREFIX) {
  let temp = location.host.split('.').reverse();
  let rootDomain = temp[1] + '.' + temp[0];

  localStorageServiceProvider
  .setPrefix(LOCALSTORAGE_PREFIX)
  .setStorageCookieDomain(rootDomain)
  .setStorageCookie(30, '/')
  .setNotify(true, true)
  .setStorageType('localStorage');
})
.name;
