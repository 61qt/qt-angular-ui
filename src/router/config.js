import angular from 'angular';

export default  angular.module('qtAngularUi.routerConf', [])
/**
 * 配置敏感字段
 * 因为部分敏感字段会通过 GET 形式返回给用户,
 * 但用户在不知情的情况下容易泄露自身信息, 因此
 * 设置部分敏感的 query 字段名, 当存在时立即清除
 */
.constant('IGNORE_QUERY_KEYWORDS', ['token', 'ticket'])
/**
 * 路由配置
 * 开启 html5 history 模式
 * 处理 otherwise 路径跳转
 */
.config(function ($locationProvider, $urlRouterProvider) {
  let location = document.location;

  /**
   * Lock UI-Router
   * As configure with ajax before parse url,
   * we must lock parsing first so that it can resolve
   * much async problems.
   *
   * Docs:
   * http://stackoverflow.com/questions/29012982/angularjs-ui-router-how-to-redirect-to-the-needed-state-after-adding-them-dy?answertab=active#tab-top
   */
  $urlRouterProvider.deferIntercept();

  /**
   * HTML5 Mode
   * Do not use hash.
   *
   * Docs:
   * https://docs.angularjs.org/api/ng/provider/$locationProvider
   */
  $locationProvider.html5Mode(true);

  /**
   * Auto add trailing slash after url.
   *
   * Example:
   * /path/to/url to be /path/to/url/
   */
  $urlRouterProvider.rule(function () {
    let path             = location.pathname;
    let hasTrailingSlash = '/' === path.substr(-1, 1);

    if (!hasTrailingSlash) {
      if (location.search) {
        let index = path.indexOf('?');
        let full  = location.href.replace(location.origin, '');

        return `${path}/${full.substr(index, full.length)}`;
      }

      return `${path}/`;
    }
  });

  /**
   * Configure not match url.
   */
  $urlRouterProvider.otherwise(() => {
    let fromPath = window.location.pathname;
    let fromName = fromPath.split('\/').splice(1, 1).pop();
    let toUrl    = location.href.replace(location.origin, '');
    let toPath   = location.pathname;
    let toName   = toPath.split('\/').splice(1, 1).pop();

    if (fromName === toName) {
      window.location.replace('/');
      return;
    }

    window.location.href = toUrl;
  });
})
.name;
