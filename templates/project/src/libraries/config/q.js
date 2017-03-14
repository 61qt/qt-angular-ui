import _       from 'lodash';
import angular from 'angular';

export default angular.module('library.config.q', [])
/**
 * 在 AngularJS@1.5.9 (或某些 beta版本) 中, $q.reject 没有定义 catch
 * 方法会出现 'Possibly unhandled rejection: {}' 错误
 * 可以通过设置 '$qProvider.errorOnUnhandledRejections(false)'
 * 忽略该报错
 *
 * 已知错误的版本
 * - ^1.5.8
 * - 1.5.5-pre-release
 *
 * issue:
 * https://github.com/angular-ui/ui-router/issues/2889
 * https://github.com/angular-ui/ui-router/issues/2699
 */
.config(function ($qProvider) {
  'ngInject';

  /**
   * 因为在部分版本中没有该方法的存在,
   * 因此也需要确定该方法是否存在
   */
  if ($qProvider && _.isFunction($qProvider.errorOnUnhandledRejections)) {
    $qProvider.errorOnUnhandledRejections(false);
  }
})
.name;
