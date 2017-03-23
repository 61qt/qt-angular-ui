import _          from 'lodash';
import angular from 'angular';

export default function () {
  const META_NAMES = ['description', 'keywords', 'copyright'];

  let $metas = angular.element(document.head).find('meta');
  let datas  = Array.prototype.filter
  .call($metas, function (meta) {
    let name = angular.element(meta).attr('name');
    return -1 !== META_NAMES.indexOf(name);
  })
  .map(function (meta, name) {
    return {
      name  : name,
      value : angular.element(meta).attr('value'),
    };
  });

  let uri = angular.parseUrl(document.location.href);

  this.defaults = {
    name             : document.title,
    logo             : '',
    title            : document.title,
    description      : document.title,
    copyright        : uri.rootDomain,

    shareTitle       : document.title,
    shareDescription : document.title,
    shareLink        : '',
  };

  _.forEach(datas, function (item) {
    _.assign(this.defaults, {
      [item.name]: item.value,
    });
  });

  this.configure = (options) => {
    _.assign(this.defaults, options);
  };

  this.$get = ($q, pageInterceptor) => {
    'ngInject';

    let Page = {
      wechat: (callback) => {
        if (angular.device.is('WeChat') && angular.isFunction(callback)) {
          require.ensure([
            'weixin-js-sdk',
          ],
          (require) => {
            const sdk = require('weixin-js-sdk');
            callback(sdk);
          });
        }
      },

      defaults: (options) => {
        _.assign(this.defaults, options);
      },

      configure: (options) => {
        let setting = _.assign({}, this.defaults, options);

        /**
         * 设置标题描述等 meta
         * title可能是模板
         */
        document.title = _.template(setting.title)(this.defaults);
        angular.forEach(META_NAMES, (name) => {
          let $head  = angular.element(document.head);
          let $metas = $head.find('meta');
          let $meta  = Array.prototype.filter
            .call($metas, (meta) => {
              return name === angular.element(meta).attr('name');
            });

          if (0 === $meta.length) {
            $meta = angular.element(`<meta name="${name}" value="${_.template(setting[name])(this.defaults)}">`);
          }

          $head.prepend($meta);
        });

        if (angular.device.is('WeChat')) {
          Page.wechat((sdk) => {
            sdk.ready(() => {
              const WECHAT_SETTING = {
                title   : _.template(setting.shareTitle || setting.title)(this.defaults),
                desc    : _.template(setting.shareDescription || setting.description || setting.title)(this.defaults),
                imgUrl  : pageInterceptor.imgUrl(setting.shareBanner || setting.logo),
                link    : pageInterceptor.link(setting.shareLink || document.location.href || ''),
              };

              sdk.onMenuShareAppMessage(WECHAT_SETTING);
              sdk.onMenuShareQQ(WECHAT_SETTING);
              sdk.onMenuShareWeibo(WECHAT_SETTING);
              sdk.onMenuShareQZone(WECHAT_SETTING);
              sdk.onMenuShareTimeline(WECHAT_SETTING);
            });
          });

          /**
           * IOS下必须使用iframe 才能重写微信 title
           * 注意: nginx 配置可能为导致无线 iframe 嵌套问题
           * 因此保险做法是判断一下父窗口与子窗口的 location
           * 是否为相同
           */
          if (window === window.parent || window.location !== window.parent.location) {
            let $ref = angular.element(`<iframe
              src="/favicon.ico"
              sandbox="allow-forms allow-scripts"
              style="
                position: fixed !important;
                top: -999999px !important;
                left: -999999px !important;
                z-index: -100 !important;
                opacity: 0 !important;
                display: none !important;
                width: 0 !important;
                height: 0 !important;
                overflow: hidden !important;
              "></iframe>`);

            $ref
            .on('load', removeIframe)
            .on('unload', removeIframe);

            angular
            .element(document.body)
            .append($ref);

            setTimeout(removeIframe, 5000);

            function removeIframe () {
              /**
               * 加载进去因太快获取不了 title
               * 因此这里稍微做一下延迟
               */
              setTimeout(function () {
                $ref
                .off('load')
                .off('unload')
                .remove();
              }, 0);
            }
          }
        }
      },

      pay: (options) => {
        let deferred = $q.defer();

        if (angular.device.is('WeChat')) {
          Page.wechat((sdk) => {
            sdk.ready(() => {
              options.type = -1 === _.indexOf(['origin', 'swiftpass'], options.type) ? 'origin' : options.type;

              /**
               * 第三方支付
               */
              if ('swiftpass' === options.type) {
                window.WeixinJSBridge.invoke('getBrandWCPayRequest', {
                  appId     : options.appId,
                  timeStamp : (options.timestamp || options.timeStamp) + '',
                  nonceStr  : options.nonceStr,
                  package   : options.package,
                  signType  : options.signType,
                  paySign   : options.paySign,
                },
                function (res) {
                  if ('get_brand_wcpay_request:ok' === res.err_msg) {
                    deferred.resolve();
                  }
                  else {
                    deferred.reject();
                  }
                });
              }

              /**
               * 原生微信支付
               */
              if ('origin' === options.type) {
                sdk.chooseWXPay({
                  timestamp : (options.timestamp || options.timeStamp) + '',
                  nonceStr  : options.nonceStr,
                  package   : options.package,
                  signType  : options.signType,
                  paySign   : options.paySign,
                  success () {
                    deferred.resolve();
                  },
                  cancel () {
                    deferred.reject();
                  },
                });
              }
            });
          });
        }
        else {
          deferred.reject();
        }

        return deferred.promise;
      },
    };

    return Page;
  };
}
