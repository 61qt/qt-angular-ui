qt-angular-ui/src/loghub
---

# 功能介绍
捕抓系统的错误，然后发回到 feedback 地址。

---

# 引入

```javascript
import angular from 'angular';
import loghub from 'qt-angulat-ui/src/loghub';

let app = angular.module('app', [
  loghub,
]);
export default app.name;
```

# service 使用方式
无

# directive 使用方式
无

# 其他使用方式
```
let errorRecord = angular.loghub.capture(new Error('例子错误'), 'error');
record.report();
record.print();
```
