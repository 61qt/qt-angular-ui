# 单选框

## 功能介绍

美化之后的 radio 组件。绑定 change 触发事件

- [事例](https://61qt.github.io/qt-angular-ui/sample/#!/radio/)
- [事例代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Radio/sample.js)
- [测试代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Radio/index.spec.js)

<iframe width="437" height="893" title="Locker" src="https://61qt.github.io/qt-angular-ui/sample/frame.html?q=https%3A%2F%2F61qt.github.io%2Fqt-angular-ui%2Fsample%2F%23!%2Fradio%2F" frameborder="no" allowtransparency="true" allowfullscreen="true" style="display:block;">
  <a href="https://61qt.github.io/qt-angular-ui/sample/#!/radio/">Sample</a>
</iframe>


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
