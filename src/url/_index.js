import _       from 'lodash';
import angular from 'angular';

/**
 * parseUrl 解析URL地址，模拟 PHP parseUrl 方法
 */
angular.parseUrl = function (url) {
  let aoMatch = /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(url);

  let aoKeys = [
    'source', 'scheme', 'authority', 'userInfo',
    'user', 'pass', 'host', 'port', 'relative', 'path', 'directory',
    'file', 'query', 'fragment',
  ];

  let oURI = { url };

  for (let i = aoKeys.length; i --;) {
    if (aoMatch[i]) {
      oURI[aoKeys[i]] = aoMatch[i];
    }
  }

  let oDomain = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);

  if (oDomain) {
    let aoRootDomain = oDomain[1].split('.');
    let nLen = aoRootDomain.length;

    oURI.domain = oDomain[1];
    oURI.rootDomain = aoRootDomain.slice(nLen - 2, nLen).join('.');
  }

  if (oURI.scheme) {
    oURI.scheme = oURI.scheme.toLowerCase();
  }

  if (oURI.host) {
    oURI.host = oURI.host.toLowerCase();
  }

  return oURI;
};

/**
 * 将 GET 字符串解析成对象
 * a=1&b=2&c=3 -> parseObject(...) -> {a:1, b:2, c:3}
 */
angular.parseParameters = function (str) {
  if (!('string' === typeof str && 0 < str.length)) {
    return {};
  }

  let aoMatch = str.split('&');
  let oArgs   = {};

  for (let i = 0, len = aoMatch.length; i < len; i ++) {
    let param  = aoMatch[i].split('=');
    let key    = param[0];
    let value  = (param[1] || '').toString();
    oArgs[key] = decodeURIComponent(value);
  }

  return oArgs;
};

/**
 * 将对象解析成 GET 数据
 * {a:1,b:2,c:3} -> parseString(...) -> a=1&b=2&c=3
 */
angular.stringifyParameters = function (params) {
  return paramsToString(params, '').slice(0, -1).join('');
};

/**
 * 重定向
 * 当并发遇到 session 的时候, 会出现各种问题
 * 例如 ios 下 两个 window.location.href 会导致第二个跳转也生效
 * 但是却跳转到第一个 url 地址, 当两个 session 相同功能时, 后面的
 * session 会覆盖前面的 session, 因此并行跳转操作必须使用"加锁"处理
 */

angular.redirect = function (url, options = {}) {
  let that = angular.redirect;

  let parseUrl  = angular.parseUrl(document.location.href);
  let query     = angular.parseParameters(parseUrl.query);

  if (query) {
    options.parameters = _.merge(query, options.parameters);
  }

  let params = `?${angular.stringifyParameters(options.parameters)}`;

  _.defaults(options, {
    replace     : false,
    weight      : 0,
    delay       : 300,
    parameters  : params,
  });

  if (options.weight <= (_.isUndefined(that.weight) ? -1 : that.weight)) {
    return;
  }

  that.pid && clearTimeout(that.pid);

  /**
   * 设置权重
   */
  that.weight = options.weight;

  /**
   * 保存 timeout id
   */
  that.pid    = setTimeout(function () {
    true === options.replace
    ? window.location.replace(url)
    : window.location.href = url;
  }, options.delay);
};

function paramsToString (params, pre) {
  let arr = [];
  if (!angular.isObject(params)) {
    return;
  }

  for (let i in params) {
    let param = params[i];

    if (angular.isObject(param)) {
      arr = '' !== pre
      ? arr.concat(paramsToString(param, pre + '[' + i + ']'))
      : arr.concat(paramsToString(param, i));
    }
    else if (undefined !== param) {
      '' !== pre
      ? arr.push(pre, '[', i, ']', '=', param, '&')
      : arr.push(i, '=', param, '&');
    }
  }

  return arr;
}


export default angular.module('qtAngularUi.url', []);
