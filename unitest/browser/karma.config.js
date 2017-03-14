import path        from 'path';
import * as CONF   from './config';
import * as PATHS  from '../conf/config';
import webpackConf from './webpack.config';

module.exports = function (config) {
  let entryFile = path.join(__dirname, 'browser.spec.js');

  config.set({
    basePath   : CONF.TARGET_FOLDER,
    browsers   : ['PhantomJS'],
    frameworks : ['mocha', 'chai', 'sinon'],
    files      : [entryFile],
    client     : {
      captureConsole: true,
      chai: {
        includeStack: true,
      },
    },
    reporters: [
      'mocha',
      'coverage',
    ],
    preprocessors: {
      [entryFile]: [
        'webpack',
        'sourcemap',
      ],
    },
    coverageReporter: {
      type   : 'lcov',
      subdir : '.',
      dir    : path.join(PATHS.ROOT_PATH, PATHS.COVERAGE_FOLDER_NAME, 'browser'),
    },
    webpack: webpackConf,
    webpackMiddleware: {
      noInfo : false,
      stats  : true,
    },
    failOnEmptyTestSuite : false,
    colors               : true,
    autoWatch            : false,
    singleRun            : true,
    plugins              : [
      'karma-phantomjs-launcher',
      'karma-webpack',
      'karma-chai',
      'karma-sinon',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-sourcemap-loader',
      'karma-coverage',
    ],
  });
};
