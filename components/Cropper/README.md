# 图片剪切

## 功能介绍

图片上传功能

- [事例](https://61qt.github.io/qt-angular-ui/sample/#!/cropper/)
- [事例代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Cropper/sample.js)
- [测试代码](https://github.com/61qt/qt-angular-ui/blob/master/src/components/Cropper/index.spec.js)

<iframe width="437" height="893" title="Cropper" src="https://61qt.github.io/qt-angular-ui/sample/frame.html?q=https%3A%2F%2F61qt.github.io%2Fqt-angular-ui%2Fsample%2F%23!%2Fcropper%2F" frameborder="no" allowtransparency="true" allowfullscreen="true" style="display:block;">
  <a href="https://61qt.github.io/qt-angular-ui/sample/#!/cropper/">Sample</a>
</iframe>


## 依赖

- [blueimp-canvas-to-blob](https://github.com/riaan53/meteor-blueimp-canvas-to-blob)


## 引入

```javascript
import angular from 'angular'
import Cropper from 'qt-angulat-ui/Cropper'

let App = angular.module('app', [
  Cropper
])

export default App.name;
```


## 配置

其中必须配置 cropperPromptInterceptor, 包含两个函数:
  - upload: 切割完毕之后的动作，无论结果如何都要进行 callback 回调,  成功 callback 的 data 回调参数, 必须有一个 image 的属性,  cropper 会在回调之后, 将 ng-model 赋值为该值
  - notify: 这个将会在失败的 callback 调用时候再次触发, 具体就是为了兼容旧版本的接口，其实可以直接写进 upload 的失败 callback 的时候

```javascript
App.provider('cropperInterceptor', function () {
  this.$get = function ($toast, $qiniuUploader) {
    const notify = () => {
      alert(message)
    }

    const upload = (file, options, callback) => {
      return $qiniuUploader.upload(file, {}, options, (error, file) => {
        error ? callback(error) : callback(null, { image: file.key })
      })
    }

    return { notify, upload }
  }
})
```


### 使用模板

```html
<cropper required ng-model="image" cropper-options="{ aspectRatio: 16/9, viewMode: 2 }">
  <img class="photo" ng-src='{{ image | qiniuImage }}'>
</cropper>
```
