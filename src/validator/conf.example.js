import angular from 'angular';

export default angular.module('qtAngularUi.utilitybarConfExample', [])
.provider('validateInterceptor', function () {
  this.$get = function () {
    return {
      /**
       * 验证邮箱地址
       */
      email (value) {
        return /^([a-z0-9\+\_\-]+)(\.[a-z0-9\+\_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/.test(value) || 'regexp';
      },

      /**
       * 验证密码
       * 密码只能为英文字符而且必须大于6
       */
      password (value) {
        if (!/^[\s\w\.\,\@\\\|\+\"\'\<\>\?\[\]\-\/\#\!\$\%\^\&\*\;\:\{\}\=\-\_\`\~\(\)]+$/g.test(value)) {
          return 'regexp';
        }

        if (6 < value.length) {
          return 'length';
        }

        return true;
      },

      /**
       * 验证手机号
       */
      phone (value) {
        return /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/.test(value) || 'regexp';
      },

      /**
       * 验证数字
       */
      number (value) {
        return /^[0-9]+$/.test('' + value) || 'regexp';
      },

      /**
       * 验证时间
       */
      time (time) {
        return /^[0-9]{1,2}:[0-9]{1,2}/.test(time) || 'regexp';
      },

      /**
       * 验证地址
       */
      address (value) {
        if (4 > (value || '').length) {
          return 'length';
        }

        return true;
      },

      /**
       * 验证图片验证码
       * 图片验证码必须为4个英文字符
       */
      captcha (value) {
        let length = getEnLength(value);
        if (4 !== length) {
          return 'length';
        }

        return true;
      },

      /**
       * 验证手机验证码
       * 手机验证码必须为6个英文字符
       */
      verifyCode (value) {
        if (6 !== (value || '').length) {
          return 'length';
        }

        return true;
      },

      /**
       * 名称
       * 一般为人名验证10个中英文数字以内
       */
      nickname (value) {
        if (!/^[\u4E00-\uFA29a-zA-Z\d]+$/i.test(value)) {
          return 'regexp';
        }

        if (2 > (value || '').length || 20 < (value || '').length) {
          return 'length';
        }

        return true;
      },
    };
  };
})
.provider('validateAjaxInterceptor', function () {
  this.$get = function () {
    return {};
  };
})
.provider('validatorPromptInterceptor', function () {
  this.$get = function ($alert) {
    'ngInject';

    return {
      notify (type, dict) {
        $alert.create(dict[type] || '输入表单错误', 'error');
      },
    };
  };
})
.name;

/**
 * 获取字符串英文长度
 * 只获取英文部分
 */
function getEnLength (value) {
  let match = value && value.match(/[^\u4E00-\uFA29]/ig);
  return match ? match.length : 0;
}
