qt-angular-ui/src/rem
---

# 功能介绍
响应式计算 root element 的 font-size ，基础是 375px 宽度，为 16px;
按照线性比例计算。
每次缩放浏览器，都会看到 root element 的 font-size 进行了变化。

---

# 引入

```javascript
import angular from 'angular';
import rem from 'qt-angulat-ui/src/rem';

let app = angular.module('app', [
  rem,
]);
export default app.name;
```

# service 使用方式
无

# directive 使用方式
无
