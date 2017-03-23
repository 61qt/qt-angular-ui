import _       from 'lodash';

export default function () {
  let defaults = {
    captchaUrl: '',
  };

  this.configure = function (options) {
    defaults = _.assign({}, defaults, options);
  };

  this.$get = function () {
    let arrProto = Array.prototype;

    class Captcha {
      constructor (options) {
        arrProto.push.call(this);

        this.setting = _.assign({}, defaults, options);
        if (window.angular && window.angular.env && window.angular.env.QT_UI_LOG) {
          window.console.error('[qt-angular-ui]尚未进行 Captcha 的配置，请查看 qt-angular-ui/src/captcha/README.md 进行配置');
        }

        this.captcha = this.change();
      }

      $add (openScope) {
        arrProto.push.call(this, openScope);

        openScope.$on('$destroy', () => {
          let index = arrProto.indexOf.call(this, openScope);
          -1 !== index && arrProto.splice.call(this, index, 1);
        });
      }

      $change (captcha) {
        if (0 < arguments.length) {
          return captcha ? confilt(captcha) : '';
        }

        let opts = this.setting;
        return opts.captchaUrl ? confilt(opts.captchaUrl) : '';
      }

      change () {
        this.captcha = this.$change();

        arrProto.forEach.call(this, (openScope) => {
          openScope.captcha = this.captcha;
        });
      }
    }

    return new Captcha();
  };

  function confilt (captcha) {
    return captcha.replace(/\?([\w\W]+?)$/, '') + `?v=${Date.now()}`;
  }
}