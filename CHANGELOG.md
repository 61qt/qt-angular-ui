# 前缀说明
U: 升级
A: 新增
F: fix bug

## 未知版本 (2017-03-23)
* `F` 修复 alert 配置的bug 。
* `A` calendar 组件，icon 替换成原生的 scss 写的 icon
* `FA` Captcha 组件，conf example 配置错误。增加未配置的警告。
* `FA` Cropper 修复背景 image 。loading 脱离 spinner 组件。脱离切割和上传完毕之后的配置。
* `A` Device 组件，补充文档的依赖。
* `A` 移除 localstorage conf example 对 url 组件的依赖。
* `FA` locker 组件，分离 conf 的配置。续额外引用 qt-angular-ui/src/locker/conf.example 。
* `A` loghub 增加使用说明 。

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
