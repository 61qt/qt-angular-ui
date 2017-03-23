qt-angular-ui/src/device
---

# 功能介绍
图片上传功能

# 依赖

* [MobileDetect](https://www.npmjs.com/package/mobile-detect) ，需要写进 package 的依赖中。

---

# 引入

```javascript
import angular from 'angular';
import device from 'qt-angulat-ui/src/device';

let app = angular.module('app', [
  device,
]);
export default app.name;
```

# service 使用方式
无

# directive 使用方式
无

# 其他使用方式

## 判断是否微信
angular.device.is('WeChat')

## 判断是否奇怪的安卓手机
angular.device.is('BadAndroid')
