import fs            from 'fs-extra';
import path          from 'path';
import webpackConfig from './webpack.config.babel';
import * as VARS     from './variables';

/**
 * Build unified entrance
 * Find out all files end in '.spec.js'
 * import these files to bootstrap (the unified entrance).
 * And karma will split different modules and sessions.
 */

let testEntryFile = path.join(VARS.TEMPORARY_PATH, './bootstrap.spec.js');
let specFiles     = findFiles(VARS.UNITEST_PATH, /^[^\.]+\.spec\.js$/);
let depsSource    = specFiles.map(formatImport).join('');

fs.ensureDirSync(path.dirname(testEntryFile));
fs.writeFileSync(testEntryFile, depsSource);

/**
 * Karma Configuration
 */
module.exports = function (config) {
  config.set({
    captureConsole : true,
    basePath       : VARS.ROOT_PATH,
    browsers       : ['PhantomJS'],
    frameworks     : ['mocha', 'chai', 'sinon'],
    files          : [testEntryFile],
    client         : {
      chai: {
        includeStack: true,
      },
    },
    browserConsoleLogOptions: {
      level    : 'log',
      format   : '%b %T : %m',
      terminal : true,
    },
    reporters: [
      'mocha',
      'coverage',
    ],
    preprocessors: {
      [testEntryFile]: [
        'webpack',
        'sourcemap',
      ],
    },
    coverageReporter: {
      type : 'html',
      dir  : VARS.COVERAGE_PATH,
    },
    webpack           : webpackConfig,
    webpackMiddleware : {
      noInfo : false,
      stats  : true,
    },
    /**
     * in empty test folder, it will return
     * status 1 and throw error.
     * set 'failOnEmptyTestSuite' to false
     * will resolve this problem.
     */
    failOnEmptyTestSuite : false,
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

/**
 * return file imported string
 */
function formatImport (file) {
  return `import '${file}';\n`;
}

/**
 * find out scripts files
 */
function findFiles (dir, regexp, files = []) {
  fs
  .readdirSync(dir)
  .forEach((name) => {
    let file = path.join(dir, name);

    if (fs.statSync(file).isDirectory()) {
      findFiles(file, regexp, files);
    }
    else if (regexp instanceof RegExp) {
      regexp.test(name) && files.push(file);
    }
    else {
      files.push(file);
    }
  });

  return files;
}
