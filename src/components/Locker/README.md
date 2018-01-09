# 页面锁

## 功能介绍

锁住页面的操作，页面跳转时候会锁住，提交表单时候也会锁住。

- [事例](https://61qt.github.io/qt-angular-ui/sample/#!/locker/)
- [事例代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Locker/sample.js)
- [测试代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Locker/index.spec.js)

<iframe width="437" height="893" title="Locker" src="https://61qt.github.io/qt-angular-ui/sample/frame.html?q=https%3A%2F%2F61qt.github.io%2Fqt-angular-ui%2Fsample%2F%23!%2Flocker%2F" frameborder="no" allowtransparency="true" allowfullscreen="true" style="display:block;">
  <a href="https://61qt.github.io/qt-angular-ui/sample/#!/locker/">Sample</a>
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
