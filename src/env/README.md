qt-angular-ui/src/env
---

# 功能介绍
图片上传功能

---

# 引入

```javascript
import angular from 'angular';
import env from 'qt-angulat-ui/src/env';

let app = angular.module('app', [
  env,
]);
export default app.name;
```

# service 使用方式
无

# directive 使用方式
无

# 其他使用方式

angular.env.DEVELOP
angular.env.PRODUCT
angular.env.UNITEST
angular.env.QT_UI_LOG

四个变量