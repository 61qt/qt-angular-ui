qt-angular-ui/src/tracker
---

# 功能介绍
统计触发器，每个页面使用一个，就能自动触发。

未进行配置的单独化处理。
和业务相关，后期可能删除。

---

# 引入

```javascript
import angular from 'angular';
import tracker from 'qt-angulat-ui/src/tracker';

let app = angular.module('app', [
  tracker,
]);
export default app.name;
```

# service 使用方式
无

# directive 使用方式
restrict: A

## data
无

## template

```html
<div tracker='searchbar:search'></div>
```

这样子会触发 searchbar 组件的 search 页面的 UV
