import _       from 'lodash';
import angular from 'angular';

export default angular.module('qtAngularUi.qiniu', [])
.filter('qiniuImage', (QINIU_SERVER) => {
  'ngInject';

  const THUMBNAIL_TEMPLATE = 'imageMogr2/thumbnail/<%= width %>x<%= height %>/gravity/Center/crop/<%= width %>x<%= height %>';

  return function (url, params = {}) {
    if (_.isString(url) && url) {
      /**
       * 图片地址有几种情况
       * + 图片地址为完整地址
       *  - 图片地址不含七牛地址
       *  - 图片地址含有七牛地址
       * + 图片地址不为完整地址
       */
      if (/^(\/\/|https?:\/\/)/.exec(url)) {
        /**
         * 当检车不到七牛地址
         */
        if (!url.match(QINIU_SERVER.IMAGE)) {
          if (_.isEmpty(params)) {
            return url;
          }

          /**
           * 设置了 params 参数
           * 判断是否已经存在 query 参数
           * 如果存在则合并否则直接添加在末尾
           */
          let uri = angular.parseUrl(url);
          if (_.isEmpty(uri.query)) {
            return `${url}?${angular.stringifyParameters(params)}`;
          }

          let query = angular.parseParameters(uri.query);
          return `${url.replace(/\?.*$/, '')}?${angular.stringifyParameters(_.assign(query, params))}`;
        }
      }
      else {
        /**
         * 检测不到到七牛地址, 而且不是完整图片地址
         * 则先添加七牛的地址
         */
        url = _.trimEnd(QINIU_SERVER.IMAGE, '/') + '/' + url;
      }

      /**
       * 统一处理在地址为七牛CDN地址时
       */

      /**
       * 没有任何参数传入, 可以直接返回 url
       * 此时无论任何情况 url 均带有前缀
       */
      if (_.isEmpty(params)) {
        return url;
      }

      /**
       * 因为七牛图片地址并不是 query 形式, 所以
       * 需要重新拼接 url 与 query
       */
      let render = _.template(THUMBNAIL_TEMPLATE);
      let query  = render(params);
      return `${url.replace(/\?.*$/, '')}?${query}`;
    }

    return '';
  };
})
.name;
