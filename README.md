[![GitHub version](https://badge.fury.io/gh/61qt%2Fqt-angular-ui.svg)](https://badge.fury.io/gh/61qt%2Fqt-angular-ui)
[![npm version](https://badge.fury.io/js/qt-angular-ui.svg)](https://badge.fury.io/js/qt-angular-ui)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

[![Build Status](https://travis-ci.org/61qt/qt-angular-ui.svg?branch=master)](https://travis-ci.org/61qt/qt-angular-ui)
[![codecov](https://codecov.io/gh/DavidKk/qt-angular-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/DavidKk/qt-angular-ui)
[![Dependency Status](https://dependencyci.com/github/61qt/qt-angular-ui/badge)](https://dependencyci.com/github/61qt/qt-angular-ui)

青藤网 angular ui 组件
---

## 简介

从青藤网的各个项目中抽出来的 angular 组件，发布到 github 及 npm 上，方便维护及其他同行使用。

## 文档

## 实例

## 使用

#### 普通导入

```javascript
const angular = require('angular')
const QtUI = require('qt-angulat-ui')
angular.module('app', QtUI)
```

#### Webpack 导入
```javascript
import angular from 'angular'
import Toast from 'qt-angulat-ui/Toast'

angular.module('app', [Toast])
```

### Wepback 配置

- 使用插件
  - [ng-annotate-loader](https://github.com/huston007/ng-annotate-loader)
  - [babel-loader](https://github.com/babel/babel-loader)
  - [pug-loader](https://github.com/pugjs/pug-loader)
  - [sass-loader](https://github.com/webpack-contrib/sass-loader)
  - [style-loader](https://github.com/webpack-contrib/style-loader)
  - [css-loader](https://github.com/webpack-contrib/css-loader)
- 实例
  - [配置文件](https://github.com/61qt/qt-angular-ui/blob/master/webpack.common.config.babel.js)

## 编写规范

- 使用 ES6 语法
- 代码格式使用 StandardJS

## 注意事项

目前部分项目正在迁移公用库，部分组件还没完善，依赖也还没增加完毕，因此可能直接调用整个库会使用不了。目前 1.* 系列版本，入门使用成本还是比较高。

## CHANGELOG
[点此查看CHANGELOG](https://github.com/61qt/qt-angular-ui/blob/master/CHANGELOG.md)
