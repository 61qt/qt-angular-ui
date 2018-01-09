# 延时加载图片

## 功能介绍

图片延迟加载功能

- [事例](https://61qt.github.io/qt-angular-ui/sample/#!/lazier/)
- [事例代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Lazier/sample.js)
- [测试代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Lazier/index.spec.js)

<iframe width="437" height="893" title="Lazier" src="https://61qt.github.io/qt-angular-ui/sample/frame.html?q=https%3A%2F%2F61qt.github.io%2Fqt-angular-ui%2Fsample%2F%23!%2Flazier%2F" frameborder="no" allowtransparency="true" allowfullscreen="true" style="display:block;">
  <a href="https://61qt.github.io/qt-angular-ui/sample/#!/lazier/">Sample</a>
</iframe>


## 引入

```javascript
import angular from 'angular'
import Lazier from 'qt-angulat-ui/Lazier'

let App = angular.module('app', [
  Lazier
])

export default App.name;
```


## 配置 

```javascript
angular.module('app').config(function ($lazierProvider) {
  $lazierProvider.configure({
    placeholder: '/placeholder.png',
    errorholder: '/placeholder.error.png'
  })
})
```


### 使用模板

```html
<lazier lazier-src='{{img}}'/></lazier>
<div lazier lazier-src='{{img}}'/></div>
```


## 使用模式

```JSON
{
  restrict: EA
}
```


### 配置数据

```JSON
{
  img: 'http://wx1.sinaimg.cn/mw690/0066h8nRly1fdj3mibcynj30k00g177f.jpg',
}
```
