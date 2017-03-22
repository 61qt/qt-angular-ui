import angular from 'angular';
let parsedUrl = angular.parseUrl(window.location.href);

/* eslint no-undef:0 */
const UPLOAD_DOMAIN = 'undefined' === typeof __UPLOAD_DOMAIN__ ? '/' : `${parsedUrl.scheme}://${__UPLOAD_DOMAIN__}`;
const ASSETS_DOMAIN = 'undefined' === typeof __ASSETS_DOMAIN__ ? '/' : `${parsedUrl.scheme}://${__ASSETS_DOMAIN__}`;
const SERVER_DOMAIN = 'undefined' === typeof __SERVER_DOMAIN__ ? '/' : `${parsedUrl.scheme}://${__SERVER_DOMAIN__}`;

export default angular.module('qtAngularUi.serverConfExample', [])
/**
 * 设置 API 路径
 */
.constant('API_SERVER', {
  BACKEND: SERVER_DOMAIN,
})
/**
 * 七牛基础路径
 * Wiki: http://wiki.61qt.cn/pages/viewpage.action?pageId=3047467
 */
.constant('QINIU_SERVER', {
  IMAGE  : UPLOAD_DOMAIN,
  ASSETS : angular.env.DEVELOP ? window.location.origin : ASSETS_DOMAIN,
})
.name;
