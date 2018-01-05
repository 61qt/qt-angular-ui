# 页面锁

## 功能介绍

锁住页面的操作，页面跳转时候会锁住，提交表单时候也会锁住。

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
App.config(($lockerProvider) => {
  $lockerProvider.configure({
    enterClass: 'in',
    leaveClass: 'out',
    duringClass: 'fade',
    during: 500,
    content: '努力加载中'
  })
})
```

## 服务使用

```javascript
App.run(function ($document, $locker) {
  $document.ready(function () {
    $locker.show('弹出一个 locker service 的例子')
  })
})
```
