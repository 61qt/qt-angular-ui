import _       from 'lodash';
import angular from 'angular';

export default angular.module('qtAngularUi.restangularConf', [])
/**
 * 配置 restangular
 * 该服务是类似 restjs 库编写
 * 这里主要设置默认头部信息和 token
 * 还有部分返回的操作信息, 主要为错误处理
 */
.config(function (RestangularProvider, API_SERVER) {
  'ngInject';

  /**
   * 设置默认路径
   */
  RestangularProvider.setBaseUrl(_.trimEnd(API_SERVER.BACKEND, '/'));

  /**
   * 设置 token
   * 这里要注意 restangular 并没有自动 inejct
   * 注入其他服务机制, 因此这里要手动创建 injector
   * 如果当前注入的 app 并不是绑定在 document 时,
   * 要主动更改注入的 DOM 节点, 否则无法创建当前
   * injector
   */
  RestangularProvider.setFullRequestInterceptor((element, operation, route, url, headers, params, httpConfig) => {
    let $injector = angular.element(document).injector();

    if ($injector) {
      if ($injector.has('$user')) {
        let $user = $injector.get('$user');
        let token = $user.getToken();
        let data  = {};

        /**
         * 设置 token
         * 前缀含有 Bearer
         */
        if (token) {
          data.Authorization = `Bearer ${token}`;
        }

        headers = _.assign(headers, data);
      }
    }

    /**
     * 其他配置不变, 返回
     */
    return {
      element    : element,
      params     : params,
      headers    : headers,
      httpConfig : httpConfig,
    };
  });

  /**
   * 设置默认错误处理
   */
  RestangularProvider.setErrorInterceptor((rejection, deferred) => {
    /**
     * 如果并没有 rejection 返回
     * 证明请求失败, 无法连接网络之类
     */
    if (!rejection) {
      _.assign(rejection, {
        msg: '无法连接网络, 请检查网络设置',
      });

      return deferred.reject(rejection);
    }

    /**
     * 开始进行全局拦截 http xhr 的请求提醒。
     * 强烈注意: 下面的操作中，不允许出现 return 跳出 responseError 函数的操作。确保 deferred.reject(rejection); 执行成功。
     */

    let response = rejection.data || {};
    let method   = (_.get(rejection, 'config.method') || '').toUpperCase();

    /**
     * 预先设定默认 message
     */

    /**
     * 权限不足
     */
    if (401 === rejection.status) {
      /**
       * 微信未授权
       * 重定向的URL为微信的授权地址
       * 其中包括 redirect_url 为授权后跳转到后端URL
       * 后端URL中含有一个 to 字段, 能自定义授权后后端跳转
       * 回全端的地址
       */
      if (1004 === response.code) {
        let fromUrl       = document.location.href;
        let $injector     = angular.element(document).injector();
        if ($injector.has('$location')) {
          let $location = $injector.get('$location');
          fromUrl       = $location.$$absUrl;
        }

        let encodeFromUrl = encodeURIComponent(fromUrl);

        let redirectUrl   = _.get(response, 'data.redirect');
        let redirectUri   = angular.parseUrl(redirectUrl);

        if (redirectUri.query) {
          let wechatParams = angular.parseParameters(redirectUri.query);
          wechatParams.to  = encodeFromUrl;

          angular.redirect(redirectUrl.replace(/\?(.*)$/, '?') + angular.stringifyParameters(wechatParams), { replace: true });

          _.assign(rejection, {
            msg: '微信未授权',
          });

          return deferred.reject(rejection);
        }

        _.assign(rejection, {
          msg: '权限不足',
        });

        angular.redirect(`${redirectUrl}?to=${encodeFromUrl}`, true);
        return deferred.reject(rejection);
      }

      _.assign(rejection, {
        msg: '登录超时，请重新登录',
      });
    }
    /**
     * 参数错误
     * 至拦截所有的修改数据的请求错误, 一般为表单提交的
     */
    else if (422 === rejection.status) {
      if (-1 !== ['POST', 'PUT', 'DELETE'].indexOf(method)) {
        if (!_.isEmpty(response.data)) {
          /* eslint no-unused-vars:off */
          for (let [name, msg] of Object.entries(response.data)) {
            if (_.isArray(msg) && 0 < msg.length) {
              _.assign(rejection, {
                msg: msg[0],
              });

              break;
            }

            if (_.isString(msg)) {
              _.assign(rejection, {
                msg: msg,
              });

              break;
            }
          }
        }
      }
      else if (-1 !== ['GET'].indexOf(method)) {
        _.assign(rejection, {
          msg: '未知错误:code:422,method:GET',
        });
      }
    }
    /**
     * 资源不存在
     */
    else if (404 === rejection.status) {
      if (-1 !== ['POST', 'PUT', 'DELETE'].indexOf(method)) {
        _.assign(rejection, {
          msg: '无法提交数据，请确认来源正确',
        });
      }
      else if (-1 !== ['GET'].indexOf(method)) {
        _.assign(rejection, {
          msg: '请求资源错误',
        });
      }
    }
    /**
     * 资源已经被删除
     */
    else if (410 === rejection.status) {
      _.assign(rejection, {
        msg: '当前资源已经被移除',
      });
    }
    /**
     * 服务器异常
     */
    else if (500 <= rejection.status && 600 > rejection.status) {
      _.assign(rejection, {
        msg: '服务器繁忙',
      });
    }
    /**
     * 其他情况
     */
    else {
      _.assign(rejection, {
        msg: response.msg || `网络错误:code:${rejection.status},method:${(method || '').toUpperCase()}`,
      });
    }

    return deferred.reject(rejection);
  });
})
.name;
