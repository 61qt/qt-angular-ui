# 警告框

## 功能介绍

基本上用于表单验证时候上面弹的提示框。
用于警告。一定时间后消失。

- [事例](https://61qt.github.io/qt-angular-ui/sample/#!/alert/)
- [事例代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Alert/sample.js)
- [测试代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Alert/index.spec.js)

<iframe width="437" height="893" title="Alert" src="https://61qt.github.io/qt-angular-ui/sample/frame.html?q=https%3A%2F%2F61qt.github.io%2Fqt-angular-ui%2Fsample%2F%23!%2Falert%2F" frameborder="no" allowtransparency="true" allowfullscreen="true" style="display:block;">
  <a href="https://61qt.github.io/qt-angular-ui/sample/#!/alert/">Sample</a>
</iframe>


## 引入

```javascript
import angular from 'angular'
import Alert from 'qt-angulat-ui/Alert'

let App = angular.module('app', [
  Alert
])

export default App.name;
```


## 配置

```javascript
App.config(($alertProvider) => {
  $alertProvider.configure({
    delay: 1000,
    during: 1000
  })
})
```


## 服务使用

```javascript
App.run(function ($document, $alert) {
  $document.ready(function () {
    $alert.create('弹出一个 alert service 的例子')
  })
})
```


### 使用模板

```html
<alert>{{message}}</alert>
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
