qt-angular-ui/src/core
---

# 功能介绍
fix angular 核心的 bug ，都在这里

## 烂手机的 input 不能触发的问题。

## module 加载的重复加载问题。

---

# 引入

```javascript
import angular from 'angular';
import core from 'qt-angulat-ui/src/core';

let app = angular.module('app', [
  core,
]);
export default app.name;
```

# service 使用方式
无

# directive 使用方式
无
