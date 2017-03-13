qt-angular-ui/src/validator
---

# 功能介绍
表单校验触发器。

---

# 引入

```javascript
import angular from 'angular';
import validator from 'qt-angulat-ui/src/validator';

let app = angular.module('app', [
  validator,
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
<input
  validator
  type="date"
  class="form-control"
  required
  name='birthday'
  ng-model='birthday'
  vd-notify="{\
    required: '出生日期不能为空',\
  }"
  placeholder='请选择日期'>
```
