import _                  from 'lodash';
import fs                 from 'fs-extra';
import path               from 'path';
import webpack            from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import * as VARS          from '../variables';
import * as PKG           from '../../package.json';

const entries = {
  blank: path.join(VARS.ROOT_PATH, './scripts/misc/blank.js'),
};

/**
 * reolve path definitions
 */
let resolveModules = [
  path.join(VARS.ROOT_PATH, './node_modules'),
  VARS.RESOURCE_PATH,
  VARS.TEMPORARY_PATH,
];

/**
 * loader and rules definitions
 */
let rules = [
  {
    test   : /\.(jpe?g|png|gif|s?css)$/i,
    loader : 'ignore-loader',
  },
  {
    test   : /\.jade$/,
    loader : 'pug-loader',
  },
  {
    test    : /\.js$/,
    enforce : 'pre',
    exclude : [/node_modules/],
    loader  : 'eslint-loader',
    options : {
      configFile: path.join(VARS.ROOT_PATH, '.eslintrc'),
    },
  },
  {
    test : /\.js$/,
    use  : [
      {
        loader: 'ng-annotate-loader',
      },
      /**
       * babel@6.0.0 break the .babelrc file
       * so configure presets below
       * docs:
       * - https://github.com/babel/babel-loader/issues/166
       */
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

/**
 * Plugins definitions
 */
const plugins = [
  /**
   * set environment variables
   * you can find out global variables in javascript
   *
   * if you want to set __VALUE_ equal 'string' (__VALUE__ = 'string')
   * yout muse define { __VALUE__ : '\"string\"' }
   */
  new webpack.DefinePlugin({
    __DEVELOP__ : !!process.env.DEVELOP,
    __PRODUCT__ : !!process.env.PRODUCT,
    __UNITEST__ : !!process.env.UNITEST,
  }),

  /**
   * Clean generate folders
   * run it first to reset the project.
   */
  new CleanWebpackPlugin([
    VARS.DISTRICT_PATH.replace(VARS.ROOT_PATH, ''),
    VARS.COVERAGE_PATH.replace(VARS.ROOT_PATH, ''),
  ],
  {
    root      : VARS.ROOT_PATH,
    verbose   : true,
    dry       : false,
  }),
];

export default {
  devtool       : 'inline-source-map',
  entry         : entries,
  output        : {
    path        : VARS.DISTRICT_PATH,
    publicPath  : '/',
    filename    : '[name].js',
  },
  module        : {
    rules: rules,
    noParse: [
      /node_modules\/sinon\//,
    ],
  },
  resolve: {
    modules: resolveModules,
    /**
     * Sinon setting
     *
     * UMD will make compiled occur some error
     * Error:
     * modules[moduleId].call is not a function
     * Issue: https://github.com/webpack/webpack/issues/304
     *
     * @todo 后面版本修复后删除
     */
    alias: {
      sinon: 'sinon/pkg/sinon.js',
    },
  },
  resolveLoader: {
    modules: resolveModules,
  },
  plugins: plugins,
};