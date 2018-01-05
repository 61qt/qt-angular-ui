# Calendar

## 功能介绍
弹出一个提示框，设定时间之后消失。

## 引入

```javascript
import angular from 'angular'
import Calendar from 'qt-angulat-ui/Calendar'

const App = angular.module('app', [
  Calendar
])

export default App.name
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

### 使用模板

```html
<calendar-modal ng-model='isOpenCalendar'>
  <calendar ng-model='schooltimes' disabled></calendar>
</calendar-modal>
```
