qt-angular-ui/src/cropper
---

# 功能介绍
图片上传功能

## 依赖

* [blueimp-canvas-to-blob](http://npmjs.com/package/blueimp-canvas-to-blob)
* qt-angular-ui/src/qiniu_uploader 组件，注意要手动引入这个组件。

---

# 引入

```javascript
import angular from 'angular';
import QiniuUploader from 'qt-angular-ui/src/qiniu_uploader'
import cropper from 'qt-angulat-ui/src/cropper';

let app = angular.module('app', [
  QiniuUploader,
  cropper,
])
.provider('cropperPromptInterceptor', function () {
  this.$get = function ($toast, $qiniuUploader) {
    'ngInject';

    return {
      notify (message) {
        $toast.create(message);
      },
      upload (file, options, callback) {
        return $qiniuUploader
        .uploadImage(file, options)
        .then((data) => {
          callback(null, data);
        })
        .catch((error) => {
          callback(error);
        });
      }
    };
  };
})
export default app.name;
```

其中必须配置 cropperPromptInterceptor ，包含两个操作；
一个是 upload ， 切割完毕之后的动作，无论结果如何都要进行 callback 回调， 成功 callback 的 data 回调参数，必须有一个 image 的属性， cropper 会在回调之后，将 ng-model 赋值为该值；
另外一个是 notify ，这个将会在失败的 callback 调用时候再次触发。具体就是为了兼容旧版本的接口，其实可以直接写进 upload 的失败 callback 的时候。

# service 使用方式
无

# directive 使用方式
restrict: A

## data
无

## template

```pug
cropper(
  required,
  ng-model='image'
  cropper-options='{\
    aspectRatio : 16/9,\
    viewMode    : 2,\
  }')
    img.photo(ng-src='{{ image | qiniuImage}}')
```


# todo
删除对 qiniu-uploader directive 的依赖。