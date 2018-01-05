# 提示框

## 功能介绍

弹出一个提示框，设定时间之后消失。具体配置看 `config.js`

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
