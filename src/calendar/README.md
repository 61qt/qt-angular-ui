qt-angular-ui/src/calendar
---

# 功能介绍
弹出一个提示框，设定时间之后消失。

---

# 引入

```javascript
import angular from 'angular';
import calendar from 'qt-angulat-ui/src/calendar';

let app = angular.module('app', [
  calendar,
]);
export default app.name;

```

# service 使用方式
无

# directive 使用方式
restrict: E

## data

```javascript
{
  isOpenCalendar: false, // true
  schooltimes: ['2017-01-01', '2017-01-02', '2017-01-03', '2017-01-04', '2017-01-05', '2017-01-06', '2017-01-07', '2017-01-08'];
}
```
## template

```html
<calendar-modal ng-model='isOpenCalendar'>
  <calendar ng-model='schooltimes', disabled></calendar>
</calendar-modal>
```
