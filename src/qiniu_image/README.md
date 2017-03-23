qt-angular-ui/src/qiniu_image
---

# 功能介绍
传入七牛 key ，输出能访问的七牛图片连接
未进行配置的单独化处理。

---

# 引入

```javascript
import angular from 'angular';
import qiniuImage from 'qt-angulat-ui/src/qiniu_image';

let app = angular.module('app', [
  qiniuImage,
]);
export default app.name;
```

# service 使用方式
无

# directive 使用方式
无

# filter 使用方式
## data
```javascript
{
  front_cover: 'FqVp3LQKM06AHYoZY5uiG_EPIYyv',
}
```
## template
```html
<img src='{{ front_cover | qiniuImage:{ width: 140, height: 140 } }}' />
```
