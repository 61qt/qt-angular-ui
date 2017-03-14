import webpack           from 'webpack';
import WebpackMerger     from 'webpack-merge';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import webpackConfig     from './webpack.common.config.babel';
import {
  DISTRICT_PATH,
  DEVELOP_SERVER_PORT,
}                        from './config';

export default WebpackMerger(webpackConfig, {
  devtool : 'source-map',
  plugins : [
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    /**
     * BrowserSync Plugin
     * local test but weinre not support https
     * docs: https://www.browsersync.io
     */
    new BrowserSyncPlugin({
      host      : 'localhost',
      port      : DEVELOP_SERVER_PORT,
      open      : false,
      logLevel  : 'debug',
      server    : {
        baseDir : [DISTRICT_PATH],
      },
      ui: {
        port: DEVELOP_SERVER_PORT + 1,
        weinre: {
          port: DEVELOP_SERVER_PORT + 2,
        },
      },
    }),
  ],
});
