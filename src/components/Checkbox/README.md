# 复选框

## 功能介绍

与 iphone 类似的 checkbox 组件

- [事例](https://61qt.github.io/qt-angular-ui/sample/#!/checkbox/)
- [事例代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Checkbox/sample.js)
- [测试代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Checkbox/index.spec.js)

<iframe width="437" height="893" title="Checkbox" src="https://61qt.github.io/qt-angular-ui/sample/frame.html?q=https%3A%2F%2F61qt.github.io%2Fqt-angular-ui%2Fsample%2F%23!%2Fcheckbox%2F" frameborder="no" allowtransparency="true" allowfullscreen="true" style="display:block;">
  <a href="https://61qt.github.io/qt-angular-ui/sample/#!/checkbox/">Sample</a>
</iframe>


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
