qt-angular-ui/src/utilitybar
---

# 功能介绍
统计触发器，每个页面使用一个，就能自动触发。

---

# 引入

```javascript
import angular from 'angular';
import utilitybar from 'qt-angulat-ui/src/utilitybar';

let app = angular.module('app', [
  utilitybar,
]);
export default app.name;
```

# service 使用方式
无

# directive 使用方式
restrict: EA

## data
无

## template

只有返回按钮的
```jade
utilitybar
```

自定义里面的按钮的。
```jade
utilitybar.classes-detail-utilitybar
  a.item(
    ng-click='goback()',
    role='button')
    i.sp.sp-menu-back
```
