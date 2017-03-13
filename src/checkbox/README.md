qt-angular-ui/src/checkbox
---

# 功能介绍
与 iphone 类似的 checkbox 组件。

---

# 引入

```javascript
import angular from 'angular';
import checkbox from 'qt-angulat-ui/src/checkbox';

let app = angular.module('app', [
  checkbox,
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

```html
<checkbox name='agreement' ng-model='isSelected' checked='checked'>
  已仔细阅读并同意
</checkbox>
```
