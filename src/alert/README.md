qt-angular-ui/src/alert
---

# 功能介绍
基本上用于表单验证时候上面弹的提示框。
用于警告。一定时间后消失。

---

# 使用方式

```javascript
import angular from 'angular';
import alert from 'qt-angulat-ui/src/alert';

let app = angular.module('app', [
  alert,
]);

// service 使用方式
app.run(($alert) => {
  $alert.create('弹出一个 alert service 的例子。');
})
export default app.name;

```

```html
// directive 用法，不推荐。没啥效果。
<alert>弹出一个 alert service 的例子。</alert>
```
