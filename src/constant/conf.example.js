import angular from 'angular';

export default angular.module('qtAngularUi.constantConfExample', [])
/**
 * 微信连登
 * 获取 ticket ，通过 ticket 获取一次性 token ，并将 token 直接写入 cookie 中
 */
.constant('USER_JWT_TOKEN', 'USER_JWT_TOKEN')
.constant('LOCALSTORAGE_PREFIX', 'LOCALSTORAGE')
.name;
