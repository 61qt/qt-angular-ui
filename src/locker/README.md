qt-angular-ui/src/locker
---

# 功能介绍
锁住页面的操作，页面跳转时候会锁住，提交表单时候也会锁住。

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
无 (不推荐)

# conf
非必要 conf
