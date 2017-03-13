qt-angular-ui/src/captcha
---

# 功能介绍
验证码的通用组件。

---

# 引入

```javascript
import angular from 'angular';
import captcha from 'qt-angulat-ui/src/captcha';

let app = angular.module('app', [
  captcha,
])
.run(($uiCaptchaProvider) => {
  // 配置验证码的 url 。
  $uiCaptchaProvider.configure({
    captchaUrl: 'http://example.com/common/captcha',
  });
})
export default app.name;
```

# service 使用方式
无

# directive 使用方式
restrict: EA

## data
无

## template
```html
<captcha class="captcha"></captcha>
```
