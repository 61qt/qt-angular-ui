import _       from 'lodash';
import angular from 'angular';
import Conf from './conf';

export default angular.module('qtAngularUi.router', [
  Conf,
])
/**
 * 删除路径中敏感的 query 字段
 */
.run(function ($location, IGNORE_QUERY_KEYWORDS) {
  'ngInject';

  let uri    = angular.parseUrl(document.location.href);
  let params = angular.parseParameters(uri.query);

  $location
  .path(uri.path)
  .search(_.assign(params, _.zipObject(IGNORE_QUERY_KEYWORDS)))
  .replace();
})

/**
 * 为 $state 添加 before 事件
 * 主要用于权限校验来决定是否继续执行或调走
 * docs: https://github.com/angular-ui/ui-router/issues/1399
 */
.run(function ($rootScope, $injector, $q, $state) {
  'ngInject';

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (true === fromParams._skipBefore) {
      return;
    }

    let path     = toState.name.split('.');
    let promises = [];

    /**
     * 遍历所有父节点, 由第一个开始遍历
     * 同时收集所有异步验证返回的 promise
     */
    for (let i = 0, l = path.length; i < l; i ++) {
      let name = path.slice(0, i + 1).join('.');
      let item = $state.get(name);

      if (item && _.isFunction(item.before) || _.isArray(item.before)) {
        let result = $injector.invoke(item.before);

        if (false === result) {
          event.preventDefault();
        }
        else if (_.isObject(result) && _.isFunction(result.then)) {
          promises.push(result);
        }
      }
    }

    /**
     * 若捕抓到 promise 则等待所有 promise 完成后再
     * 执行跳转操作
     */
    if (0 < promises.length) {
      event.preventDefault();

      $q
      .all(promises)
      .then(function () {
        fromParams._skipBefore = true;
        $state.go(toState.name, toParams);
      });
    }
  });
})

.run(function ($rootScope) {
  'ngInject';

  $rootScope.$on('$stateNotFound', function (event, toState) {
    event.preventDefault();

    // 只进行手动的 state 跳转的处理，如果判断成立，那就是烂手机问题。
    if (undefined === toState.to) {
      return false;
    }

    let redirect = _.get(toState, 'toParams.otherwise');
    let url      = _.isEmpty(redirect) ? '/feat/error/?s=404&m=页面不存在' : redirect;
    angular.redirect(url);
  });

  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    event.preventDefault();

    try {
      /**
       * 标记该错误
       * 提交错误日志到线上
       */
      let record = angular.loghub.capture(error, 'error');

      if (record) {
        /**
         * 生产环境下, 友好报错
         */
        if (true === angular.env.PRODUCT) {
          record.report(function (error, source) {
            if (!error) {
              angular.redirect(`/feat/error/?s=500&m=程序错误&i=${encodeURIComponent(source)}`);
            }
          });
        }
        else {
          record.print();
        }
      }
    }
    catch (err) {
      /* eslint no-console:off */
      console.error(error);
    }
  });
})
.name;