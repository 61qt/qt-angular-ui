qt-angular-ui/src/window_onscroll
---

# 功能介绍
window onScroll 事件

---

# 引入

```javascript
import angular from 'angular';
import windowOnscroll from 'qt-angulat-ui/src/window_onscroll';

let app = angular.module('app', [
  windowOnscroll,
]);
export default app.name;
```
---

# service 使用方式
- $windowOnscroll.bind($scope, fn); fn return true 可以结束bind
- $windowOnscroll.startScroll(); 开启全部已暂停的bind
- $windowOnscroll.stopScroll(); 暂停全部已开启的bind
- $windowOnscroll.removeAll(); 清空全部bind

---

# directive 使用方式
- restrict: A
- ( $window.scrollX范围：$attrs.startX, $attrs.endX ) && ( $window.scrollY范围：$attrs.startY, $attrs.endY ) 范围内$element增加class“ $attrs.activeClass || 'active' ”
