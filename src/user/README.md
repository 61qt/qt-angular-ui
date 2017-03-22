qt-angular-ui/src/user
---

# 功能介绍
使用 jwtToken 的 user 设置模块

---

# 引入

```javascript
import angular from 'angular';
import constant from 'qt-angulat-ui/src/constant';
import user from 'qt-angulat-ui/src/user';

let app = angular.module('app', [
  constant,
  user,
]);
export default app.name;
```

# service 使用方式
```
app.run(($user) => {
  console.log($user.getToken());
  console.log($user.checkAuth());
  console.log($user.checkAuth());
  console.log($user.unsetToken());
})
```

# directive 使用方式
无
