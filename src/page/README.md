qt-angular-ui/src/page
---

# 功能介绍
配置页面的 title 及微信分享相关的信息。

---

# 引入

```javascript
import angular from 'angular';
import page from 'qt-angulat-ui/src/page';

let app = angular.module('app', [
  page,
]);
export default app.name;
```

# service 使用方式
```javascript
/**
 * 初始化微信配置
 */
mWechat
.ticket()
.then((response) => {
  let data = response;
  $page.wechat((sdk) => {
    sdk.config({
      debug     : false,
      appId     : data.appId,
      timestamp : data.timestamp + '',
      nonceStr  : data.nonceStr,
      signature : data.signature,
      jsApiList : [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone',
        'chooseWXPay',
      ],
    });

    sdk.ready(() => {
      sdk.showOptionMenu();
    });
  });
});

/**
 * 页面使用
 */
/**
 * 设置分享文案
 */
$page.configure({
  title            : '这是页面标题',
  description      : '这是页面描述',
  shareTitle       : '这是微信分享的标题',
  shareDescription      : '这是微信分享的描述',
  shareBanner      : 'http://wx1.sinaimg.cn/mw690/0066h8nRly1fdj3mibcynj30k00g177f.jpg', // 微信分享的头图
  success          : function () {
    console.log('分享成功的回调');
  },
});
```

# directive 使用方式
无
