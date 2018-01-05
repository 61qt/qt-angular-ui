# 延时加载图片

## 功能介绍

图片延迟加载功能

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
