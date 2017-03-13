qt-angular-ui/src/radio
---

# 功能介绍
美化之后的 radio 组件。绑定 change 触发事件。

---

# 引入

```javascript
import angular from 'angular';
import radio from 'qt-angulat-ui/src/radio';

let app = angular.module('app', [
  radio,
]);
export default app.name;
```

# service 使用方式
无

# directive 使用方式
restrict: EA

## data
{
  detail: {
    checked: false,
    id: 1,
  },
  checkSelect: (val) => {
    window.console.log(val);
  }
}

## template

```html
radio(name='child_id',
  ng-model='detail.checked',
  value='{{ detail.id }}',
  ng-change='checkSelect(detail.checked)')
```
