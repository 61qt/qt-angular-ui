qt-angular-ui/src/alert
---

# 功能介绍
基本上用于表单验证时候上面弹的提示框。
用于警告。一定时间后消失。

---

# 引入

```javascript
import angular from 'angular';
import alert from 'qt-angulat-ui/src/alert';

let app = angular.module('app', [
  alert,
]);

export default app.name;
```

# service 使用方式
app.run(($alert) => {
  $alert.create('弹出一个 alert service 的例子。');
})

# directive 使用方式
restrict: EA

## data

```javascript
{
  message: '弹出一个 alert service 的例子。'
}
```
## template

```html
<alert>{{message}}</alert>
```
