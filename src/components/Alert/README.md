# 警告框

## 功能介绍

基本上用于表单验证时候上面弹的提示框。
用于警告。一定时间后消失。

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
