qt-angular-ui/src/cropper
---

# 功能介绍
图片上传功能

---

# 引入

```javascript
import angular from 'angular';
import QiniuUploader from 'qt-angular-ui/src/qiniu_uploader'
import cropper from 'qt-angulat-ui/src/cropper';

let app = angular.module('app', [
  QiniuUploader,
  cropper,
]);
export default app.name;
```

# service 使用方式
无

# directive 使用方式
restrict: A

## data
无

## template

```pug
cropper.file(
  required,
  ng-model='image'
  cropper-options='{\
    aspectRatio : 16/9,\
    viewMode    : 2,\
  }')
    img.photo(ng-src='{{ image | qiniuImage}}')
    .cropper-banner-container
      .cropper-banner
      p.tip-info 请上传一张荣誉证书（必填）

```
