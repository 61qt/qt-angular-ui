import webpack            from 'webpack';
import WebpackMerger      from 'webpack-merge';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin  from 'extract-text-webpack-plugin';
import {
  CLIENT_DOMAIN,
  SERVER_DOMAIN,
  ASSETS_DOMAIN,
  UPLOAD_DOMAIN,

  ROOT_PATH,

  TEMPORARY_FOLDER_NAME,
  DEVELOP_FOLDER_NAME,
  DISTRICT_FOLDER_NAME,
  COVERAGE_FOLDER_NAME,
}                         from './config';
import webpackConfig,
{ generateSprites }       from './webpack.common.config.babel';

/**
 * Entries definitions
 */
const entries = {
  'babel-polyfill': 'babel-polyfill',
};

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
    __DEVELOP__       : !!process.env.DEVELOP,
    __PRODUCT__       : !!process.env.PRODUCT,
    __UNITEST__       : !!process.env.UNITEST,

    __CLIENT_DOMAIN__ : JSON.stringify(CLIENT_DOMAIN),
    __ASSETS_DOMAIN__ : JSON.stringify(ASSETS_DOMAIN),
    __UPLOAD_DOMAIN__ : JSON.stringify(UPLOAD_DOMAIN),
    __SERVER_DOMAIN__ : JSON.stringify(SERVER_DOMAIN),
  }),

  /**
   * Extract style file
   * Inline styles can be externally optimized for loading
   */
  new ExtractTextPlugin({
    filename  : 'styles/[name].[contenthash].css',
    allChunks : true,
  }),

  /**
   * Clean generate folders
   * run it first to reset the project.
   */
  new CleanWebpackPlugin([
    DEVELOP_FOLDER_NAME,
    DISTRICT_FOLDER_NAME,
    COVERAGE_FOLDER_NAME,
  ],
  {
    root      : ROOT_PATH,
    verbose   : true,
    dry       : false,
  }),
];

/**
 * Generate some compile tasks
 */
generateSprites(plugins);

export default WebpackMerger({
  devtool       : 'inline-source-map',
  entry         : entries,
  output        : webpackConfig.output,
  module        : webpackConfig.module,
  resolve       : webpackConfig.resolve,
  resolveLoader : webpackConfig.resolveLoader,
  plugins       : plugins,
},
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
{
  module: {
    noParse: [
      /node_modules\/sinon\//,
    ],
  },
  resolve: {
    alias: {
      sinon: 'sinon/pkg/sinon.js',
    },
  },
},
/**
 * unitest setting
 */
{
  module: {
    rules: [
      {
        test    : /\.js$/,
        enforce : 'pre',
        loader  : 'istanbul-instrumenter-loader',
        include : webpackConfig.resolve.modules,
        exclude : [/node_modules/, new RegExp(TEMPORARY_FOLDER_NAME)],
      }
    ],
  },
});
