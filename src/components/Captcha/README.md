# 验证码

## 功能介绍

验证码的通用组件

- [事例](https://61qt.github.io/qt-angular-ui/sample/#!/captcha/)
- [事例代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Captcha/sample.js)
- [测试代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Captcha/index.spec.js)

<iframe width="437" height="893" title="Captcha" src="https://61qt.github.io/qt-angular-ui/sample/frame.html?q=https%3A%2F%2F61qt.github.io%2Fqt-angular-ui%2Fsample%2F%23!%2Fcaptcha%2F" frameborder="no" allowtransparency="true" allowfullscreen="true" style="display:block;">
  <a href="https://61qt.github.io/qt-angular-ui/sample/#!/captcha/">Sample</a>
</iframe>


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
