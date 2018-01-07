# 开关

## 功能介绍

与 iphone 类似的 switch 组件

- [事例](https://61qt.github.io/qt-angular-ui/sample/#!/switch/)
- [事例代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Switch/sample.js)
- [测试代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Switch/index.spec.js)

<iframe width="437" height="893" title="Locker" src="https://61qt.github.io/qt-angular-ui/sample/frame.html?q=https%3A%2F%2F61qt.github.io%2Fqt-angular-ui%2Fsample%2F%23!%2Fswitch%2F" frameborder="no" allowtransparency="true" allowfullscreen="true" style="display:block;">
  <a href="https://61qt.github.io/qt-angular-ui/sample/#!/switch/">Sample</a>
</iframe>


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
