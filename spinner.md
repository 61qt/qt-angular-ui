# Spinner

## 功能介绍

一个简单的 loading 组件
未进行配置的单独化处理。

- [事例](https://61qt.github.io/qt-angular-ui/sample/#!/spinner/)
- [事例代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Spinner/sample.js)
- [测试代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Spinner/index.spec.js)

<iframe width="437" height="893" title="Locker" src="https://61qt.github.io/qt-angular-ui/sample/frame.html?q=https%3A%2F%2F61qt.github.io%2Fqt-angular-ui%2Fsample%2F%23!%2Fspinner%2F" frameborder="no" allowtransparency="true" allowfullscreen="true" style="display:block;">
  <a href="https://61qt.github.io/qt-angular-ui/sample/#!/spinner/">Sample</a>
</iframe>


## 引入

```javascript
import angular from 'angular'
import Spinner from 'qt-angulat-ui/Spinner'

let App = angular.module('app', [
  Spinner
])

export default App.name;
```


### 使用模板

```html
<spinner></spinner>
```


## 使用模式

```JSON
{
  restrict: E
}
```
