青藤网 angular ui 组件
---

# 简介

从青藤网的各个项目中抽出来的 angular 组件，发布到 github 及 npm 上，方便维护及其他同行使用。

# 编写规范

- 使用 ES6 语法

# 使用方式

## 代码编写

假如使用 toast 组件

```javascript
import angular from 'angular';
import toast from 'qt-angulat-ui/src/toast';

export default angular.module('app', [
  toast,
])
.name;
```

## 打包方式

使用 webpack 进行打包， `webpack.config.js` 片段

```
import ExtractTextPlugin     from 'extract-text-webpack-plugin';

module.exports = {
  module: {
    rules: [
    {
      test : /\.html$/,
      use  : [
        {
          loader: 'html-loader',
          options: {
            attrs: ['img:src', 'img:ng-src'],
          },
        },
      ],
    },
    {
      test : /\.jade$/,
      use  : [
        {
          loader: 'pug-loader',
        },
      ],
    },
    {
      test : /\.css$/,
      use  : {
        loader  : 'url-loader',
        options : {
          limit : 10000,
          name  : 'styles/[name].[hash].css',
        }
      },
    },
    {
      test : /\.(sass|scss)$/,
      use  : ExtractTextPlugin.extract({
        fallback : 'style-loader',
        use      : [
          {
            loader  : 'css-loader',
            options : {
              sourceMap: true,
            },
          },
          {
            loader  : 'sass-loader',
            options : {
              includePaths : ['/node_modules/'],
              data         : [].join('\n'),
            },
          },
        ],
      }),
    },
    {
      test : /\.js$/,
      use  : [
        {
          loader: 'ng-annotate-loader',
        },
        {
          loader: 'babel-loader',
          options: {
            presets: [
              require.resolve('babel-preset-es2015'),
              require.resolve('babel-preset-stage-0'),
            ],
          },
        },
      ],
    },
    {
      test : /\.(jpe?g|png|gif)$/i,
      use  : [
        {
          loader  : 'url-loader',
          options : {
            limit : 10000,
            name  : 'panels/[name].[hash].[ext]',
          },
        },
      ],
    },
  ]
  }
};
```
# 依赖
```
npm install
```