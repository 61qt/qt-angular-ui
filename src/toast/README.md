qt-angular-ui/src/toast
---

# 功能介绍
弹出一个提示框，设定时间之后消失。具体配置看 `config.js`。

---

# 使用方式

```javascript
import angular from 'angular';
import toast from 'qt-angulat-ui/src/toast';

let app = angular.module('app', [
  toast,
]);

// service 使用方式
app.run(($toast) => {
  $toast.create('弹出一个 toast service 的例子。');
})
export default app.name;

```

```html
// directive 用法，不推荐。没啥效果。
<toast>弹出一个 toast service 的例子。</toast>
```
