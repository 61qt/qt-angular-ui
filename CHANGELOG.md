# 前缀说明
* U: 升级
* A: 新增
* F: fix bug
* TODO: 发现需要增加的功能

## 3.0.0 (2018-01-04)
* `U` 所有组件可以单独使用
* `U` 优化所有文件导入方式
* `U` 优化打包流程
* `U` 升级 webpack@^3.0.0

## 2.0.1 (2017-03-24)
* `F` 修复 restangular/conf.example Object.entries 的问题。

## 2.0.0 (2017-03-24)
* `F` 修复 alert 配置的bug 。
* `A` calendar 组件，icon 替换成原生的 scss 写的 icon
* `FA` Captcha 组件，conf example 配置错误。增加未配置的警告。
* `FA` Cropper 修复背景 image 。loading 脱离 spinner 组件。脱离切割和上传完毕之后的配置。
* `TODO` 优化 Cropper ，移除 Cropper 对 qiniu_iploader 的依赖。
* `A` Device 组件，补充文档的依赖。
* `A` 移除 localstorage conf example 对 url 组件的依赖。
* `FA` locker 组件，分离 conf 的配置。需要额外引用 qt-angular-ui/src/locker/conf.example 。
* `A` loghub 增加使用说明 。
* `A` page 增加 conf 拦截分享时候的 imgUrl 和 link 的设置。需要额外引用 qt-angular-ui/src/page/conf.example 。
* `F` qiniu image readme fix 。
* `A` qiniu uploader readme add 。
* `F` toast configure 的 bug fix 。
* `A` 删除 validator 对 angular.noop 的依赖。
* `A` 增加了其他一堆说明，如：未进行配置的单独化处理；和业务相关，后期可能删除；之类的说明。
* `F` 同步状态，wechat 组件，不需要调用 $urlRouter.sync() 。
* `A` 增加部分测试方法和用例，测试框架初步。


## 1.3.2 (2017-03-22)

* `F` 修复  Restangular conf example 中 RestangularProvider.setFullRequestInterceptor 没法注入 injector 造成没法获取 token 的问题。

## 1.3.1 (2017-03-22)

* `F` wechat conf 中需要调用 $urlRouter.listen 和$urlRouter.sync;
* `A` url 中增加 ticket 为敏感字眼，同时删除。

## 1.3.0 (2017-03-22)

* `A` wechat conf 使用新的 ticket 方式进行授权，更新 wechat conf example。
* `F` fix px-to-rem mixin 方法不存在的问题。
* `F` fix calendar 选中的日期大小的问题。

## 1.2.1 (2017-03-22)

* `F` 修复 calendar scss 的编译问题。

## 1.2.0 (2017-03-22)

* `U` 升级因为 bourbon 升级了之后，部分 scss 方法无效的问题。

## 1.1.0 (2017-03-21)

* `A` 部分的 readme 和 conf example

## 1.0.0 (2017-03-21)

* `A` 第一个版本
