# Captcha

## 功能介绍
验证码的通用组件

## 引入

```javascript
import angular from 'angular'
import Captcha from 'qt-angulat-ui/Captcha'

const App = angular.module('app', [
  Captcha
])

export default App.name
```

## 配置

```javascript
angular.module('app').config(function ($uiCaptchaProvider) {
  $uiCaptchaProvider.configure({ url: '/captch.png' })
})
```

### 使用模板

```html
<captcha class="captcha"></captcha>
```

## 使用模式

```JSON
{
  restrict: EA
}
```
