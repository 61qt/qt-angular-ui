# 单选框

## 功能介绍

美化之后的 radio 组件。绑定 change 触发事件

## 引入

```javascript
import angular from 'angular'
import Radio from 'qt-angulat-ui/Radio'

let App = angular.module('app', [
  Radio
])

export default App.name;
```

### 使用模板

```html
<radio name="gender" ng-model="gender" value="1" ng-change="checkSelect(gender)"></radio>
```

## 使用模式

```JSON
{
  restrict: E
}
```

### 配置数据

```JSON
{
  detail: {
    checked: false,
    id: 1,
  },
  checkSelect: (val) => {
    window.console.log(val);
  }
}
```
