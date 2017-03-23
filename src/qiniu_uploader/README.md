qt-angular-ui/src/qiniu_uploader
---

# 功能介绍
传入七牛 key ，输出能访问的七牛图片连接
未进行配置的单独化处理。

---

# 引入

```javascript
import angular from 'angular';
import qiniuUploader from 'qt-angulat-ui/src/qiniu_uploader';

let app = angular.module('app', [
  qiniuUploader,
]);
export default app.name;
```

# service 使用方式
```javascript
app.run(($qiniuUploader) => {
  // 一个 html 的 file 值。
  let file = file;
  let options = {};
  $qiniuUploader
  .uploadImage(file, options)
  .then((data) => {
  })
  .catch((error) => {
  });
})
```
用于上传一个东西。

# directive 使用方式
```jade
qiniu-uploader.cropper-result(
  ng-file-select='onFileSelect($files)')
```

就是一个简单的选择文件的东西。
