# 日历

## 功能介绍

弹出一个提示框，设定时间之后消失。

- [事例](https://61qt.github.io/qt-angular-ui/sample/#!/calendar/)
- [事例代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Calendar/sample.js)
- [测试代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Calendar/index.spec.js)

<iframe width="437" height="893" title="Calendar" src="https://61qt.github.io/qt-angular-ui/sample/frame.html?q=https%3A%2F%2F61qt.github.io%2Fqt-angular-ui%2Fsample%2F%23!%2Fcalendar%2F" frameborder="no" allowtransparency="true" allowfullscreen="true" style="display:block;">
  <a href="https://61qt.github.io/qt-angular-ui/sample/#!/calendar/">Sample</a>
</iframe>


## 引入

```javascript
import angular from 'angular'
import Calendar from 'qt-angulat-ui/Calendar'

const App = angular.module('app', [
  Calendar
])

export default App.name
```


### 使用模板

```html
<calendar-modal ng-model='isOpenCalendar'>
  <calendar ng-model='schooltimes' disabled></calendar>
</calendar-modal>
```


## 使用模式

```JSON
{
  restrict: EA
}
```


## 配置数据

```JSON
{
  isOpenCalendar: false,
  schooltimes: [
    '2017-01-01', '2017-01-02', '2017-01-03', '2017-01-04', '2017-01-05', '2017-01-06', '2017-01-07', '2017-01-08'
  ]
}
```
