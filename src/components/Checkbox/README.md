# Checkbox

## 功能介绍

与 iphone 类似的 checkbox 组件

## 引入

```javascript
import angular from 'angular'
import Checkbox from 'qt-angulat-ui/Checkbox'

let App = angular.module('app', [
  Checkbox
])

export default App.name;
```

### 使用模板

```html
<checkbox name='agreement' ng-model='isSelected' checked='checked'>已仔细阅读并同意</checkbox>
```

## 使用模式

```JSON
{
  restrict: EA
}
```
