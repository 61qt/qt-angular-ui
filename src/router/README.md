qt-angular-ui/src/router
---

# 功能介绍
监控 router 变化，删除 url 中的敏感信息。

---

# 引入

```javascript
import angular from 'angular';
import router from 'qt-angulat-ui/src/router';

let app = angular.module('app', [
  router,
]);
/**
 * 配置敏感字段
 * 因为部分敏感字段会通过 GET 形式返回给用户,
 * 但用户在不知情的情况下容易泄露自身信息, 因此
 * 设置部分敏感的 query 字段名, 当存在时立即清除
 */
app.constant('IGNORE_QUERY_KEYWORDS', ['token']);
export default app.name;
```

# service 使用方式
无

# directive 使用方式
无
