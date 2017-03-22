import angular from 'angular';

export default angular.module('qtAngularUi.restangularConfig', [])
/**
 * 配置 restangular
 * 该服务是类似 restjs 库编写
 * 这里主要设置默认头部信息和 token
 * 还有部分返回的操作信息, 主要为错误处理
 */
.config(function (RestangularProvider) {
  'ngInject';

  /**
   * 设置默认不开启内嵌方法
   * docs:
   * - https://github.com/mgonto/restangular#setplainbydefault
   */
  RestangularProvider.setPlainByDefault(true);

  /**
   * 设置默认头
   */
  RestangularProvider.setDefaultHeaders({
    'Content-Type'     : 'application/json',
    'X-Requested-With' : 'XMLHttpRequest',
  });

  RestangularProvider.setDefaultHttpFields({
    skipAuthorization : true,
    withCredentials   : true,
  });

  /**
   * 设置正常回调返回值
   * 直接无视 status 与 code
   * 直接返回数据字段
   */
  RestangularProvider.setResponseExtractor(function (response, operation) {
    if (200 === response.status_code && 0 === response.code) {
      let maindata = response.data || {};
      if ('getList' === operation) {
        let listdata = maindata.data || [];
        listdata.metadata = maindata;
        return listdata;
      }
      return maindata;
    }
    return response;
  });
})
.name;
