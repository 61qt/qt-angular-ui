qt-angular-ui/src/locker
---

# 功能介绍
弹出一个提示框，设定时间之后消失。具体配置看 `config.js`。

---

# 引入

```javascript
import angular from 'angular';
import locker from 'qt-angulat-ui/src/locker';

let app = angular.module('app', [
  locker,
]);
export default app.name;
```

# service 使用方式

app.run(($locker) => {
  $locker.show('弹出一个 locker service 的例子。');
})

# directive 使用方式
无
