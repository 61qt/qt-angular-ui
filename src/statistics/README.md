qt-angular-ui/src/statistics
---

# 功能介绍
页面统计 pv 和 uv 功能。
未进行配置的单独化处理。
和业务相关，后期可能删除。

---

# 引入

```javascript
import angular from 'angular';
import statistics from 'qt-angulat-ui/src/statistics';

let app = angular.module('app', [
  statistics,
]);
export default app.name;
```

# service 使用方式
无

# directive 使用方式
无

# 其他用法
angular.collect(type)

其中 type 可以为 UA , PV , USR 。