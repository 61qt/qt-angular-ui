// import fs                from 'fs-extra';
import path              from 'path';
import webpack           from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as CONF         from './config';
// import * as PATHS        from '../conf/config';

let nodeModulesFolder = path.join(__dirname, '../../node_modules');
let resolveModules    = [
  nodeModulesFolder,

  path.join(CONF.PROJECT_FOLDER, './src'),
  path.join(CONF.PROJECT_FOLDER, './src/assets'),
  path.join(CONF.PROJECT_FOLDER, './src/common'),
  path.join(CONF.PROJECT_FOLDER, './src/libraries'),

  CONF.TEMPORARY_FOLDER,
  CONF.PROJECT_FOLDER,
  CONF.MODULE_FOLDER,
  CONF.COMPONENT_FOLDER,
];

let plugins = [
  new webpack.DefinePlugin({
    __DEVELOP__ : !!process.env.DEVELOP,
    __PRODUCT__ : !!process.env.PRODUCT,
    __UNITEST__ : !!process.env.UNITEST,
  }),
  new ExtractTextPlugin({
    filename  : 'styles/[name].[contenthash].css',
    allChunks : true,
  }),
];

let rules = [
  {
    test : /\.jade$/,
    use  : [
      {
        loader: 'pug-loader',
      },
    ],
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
            module       : false,
            includePaths : resolveModules,
          },
        },
      ],
    }),
  },
  {
    test    : /\.js$/,
    enforce : 'pre',
    exclude : [/node_modules/],
    loader  : 'istanbul-instrumenter-loader',
    options : {
      /**
       * docs
       * - https://github.com/deepsweet/istanbul-instrumenter-loader/issues/33
       */
      esModules: true,
    },
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
];

export default {
  devtool: 'inline-source-map',
  entry: {
    'babel-polyfill': 'babel-polyfill',
  },
  output: {
    path       : CONF.TEMPORARY_FOLDER,
    publicPath : '/',
    filename   : '[name].js',
  },
  module: {
    rules   : rules,
    noParse : [
      /node_modules\/sinon\//,
    ],
  },
  resolve: {
    modules: resolveModules,
    alias: {
      sinon: 'sinon/pkg/sinon.js',
    },
  },
  resolveLoader: {
    modules: [nodeModulesFolder],
  },
  plugins: plugins,
};
