qt-angular-ui/src/switch
---

# 功能介绍
与 iphone 类似的 switch 组件。

---

# 引入

```javascript
import angular from 'angular';
import switch from 'qt-angulat-ui/src/switch';

let app = angular.module('app', [
  switch,
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
<switch class="form-control-switch" name='gender' ng-model='formData.gender' ng-true-value='1' ng-false-value='2'>
  <on>男</on>
  <off>女</off>
</switch>
```
