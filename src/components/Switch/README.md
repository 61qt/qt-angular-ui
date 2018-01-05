# 开关

## 功能介绍

与 iphone 类似的 switch 组件

## 引入

```javascript
import angular from 'angular'
import Switch from 'qt-angulat-ui/Switch'

let App = angular.module('app', [
  Switch
])

export default App.name;
```

### 使用模板

```html
<switch class="form-control-switch" name='gender' ng-model='gender' ng-true-value='1' ng-false-value='2'>
  <on>男</on>
  <off>女</off>
</switch>
```

## 使用模式

```JSON
{
  restrict: E
}
```
