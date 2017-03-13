qt-angular-ui/src/lazier
---

# 功能介绍
图片延迟加载功能。

---

# 引入

```javascript
import angular from 'angular';
import lazier from 'qt-angulat-ui/src/lazier';

let app = angular.module('app', [
  lazier,
]);
export default app.name;
```

# service 使用方式
无

# directive 使用方式
restrict: A

## data
{
  img: 'http://wx1.sinaimg.cn/mw690/0066h8nRly1fdj3mibcynj30k00g177f.jpg',
}
```
## template

```html
.avatar(lazier, lazier-src='{{img}}')
```
