import angular from 'angular';

export default angular.module('qtAngularUi.wechatConfExample', [])
/**
 * 微信连登
 * 获取 ticket ，通过 ticket 获取一次性 token ，并将 token 直接写入 cookie 中
 */
.run(function ($rootScope, $location, $user, $toast, Restangular, mUser) {
  'ngInject';

  if (!angular.device.is('WeChat')) {
    return false;
  }

  let uri    = angular.parseUrl(document.location.href);
  let params = angular.parseParameters(uri.query);
  /**
   * 微信自动连登
   * 必须重新获取用户信息
   * 否则 userInfo 可能失效
   */

  function showTicketError () {
    $toast.create('系统繁忙请刷新再试');
  }

  if (params.ticket) {

    mUser.ticketToken(params.ticket)
    .then((res) => {
      window.res = res;
      window.console.log(res);
      let token = res.token;
      if (!token) {
        showTicketError();
        return;
      }

      if (false === $user.setToken(token)) {
        showTicketError();
        return;
      }

      $rootScope.$broadcast('beginRrlRouterListen');
    })
    .catch(() => {
      $toast.create('密钥已经被使用过，请重新进行授权');
    });
  }

  /**
   * 请求 openid 与连登
   * 若 token 已经不合法了 则直接请求 openid
   * 若 openid 与 userid 同时都不存在则请求 openid
   */
  if (!$user.checkToken() || !$user.get('openid') && !$user.get('id')) {
    Restangular
    .all('wechat')
    .get('is_oauth')
    .catch(() => {
      $toast.create('正在为您的微信账号授权');
    });
  }
})
.name;
