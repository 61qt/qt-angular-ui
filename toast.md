# 提示框

## 功能介绍

弹出一个提示框，设定时间之后消失。具体配置看 `config.js`

- [事例](https://61qt.github.io/qt-angular-ui/sample/#!/toast/)
- [事例代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Toast/sample.js)
- [测试代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Toast/index.spec.js)

<iframe width="437" height="893" title="Locker" src="https://61qt.github.io/qt-angular-ui/sample/frame.html?q=https%3A%2F%2F61qt.github.io%2Fqt-angular-ui%2Fsample%2F%23!%2Ftoast%2F" frameborder="no" allowtransparency="true" allowfullscreen="true" style="display:block;">
  <a href="https://61qt.github.io/qt-angular-ui/sample/#!/toast/">Sample</a>
</iframe>


## 引入

```javascript
import angular from 'angular'
import Toast from 'qt-angulat-ui/Toast'

let App = angular.module('app', [
  Toast
])

export default App.name;
```


## 服务使用

```javascript
App.run(function ($document, $alert) {
  $document.ready(function () {
    $toast.create('弹出一个 toast service 的例子')
  })
})
```


### 使用模板

```html
<toast>{{message}}</toast>
```


## 使用模式

```JSON
{
  restrict: EA
}
```


### 配置数据

```JSON
{
  message: '弹出一个 alert service 的例子'
}
```
