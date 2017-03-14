import fs          from 'fs-extra';
import path        from 'path';
import webpackConf from './webpack.unitest.config.babel';
import {
  ROOT_PATH,
  UNITEST_FOLDER_NAME,
  TEMPORARY_FOLDER_NAME,
  COVERAGE_FOLDER_NAME,
}                  from './config';

console.log('ROOT_PATH', ROOT_PATH);

/**
 * Build unified entrance
 * Find out all files end in '.spec.js'
 * import these files to bootstrap (the unified entrance).
 * And karma will split different modules and sessions.
 */
let formatImport = function (file) {
  return `import '${file}';\n`;
};

let testEntryFile = path.join(ROOT_PATH, TEMPORARY_FOLDER_NAME, UNITEST_FOLDER_NAME, 'bootstrap.spec.js');
let testFolder    = path.join(ROOT_PATH, UNITEST_FOLDER_NAME);

fs.ensureDirSync(testFolder);

if (!fs.existsSync(testFolder)) {
  throw new Error(`Client test folder '${testFolder}' is not exists or no permission to create folder.`);
}

let specFiles  = findFiles(testFolder, /^[^\.]+\.spec\.js$/);
let depsSource = specFiles.map(formatImport).join('');

fs.ensureDirSync(path.dirname(testEntryFile));
fs.writeFileSync(testEntryFile, depsSource);

/**
 * Karma Configuration
 */
module.exports = function (config) {
  config.set({
    basePath   : ROOT_PATH,
    browsers   : ['PhantomJS'],
    frameworks : ['mocha', 'chai', 'sinon'],
    files      : [testEntryFile],
    client: {
      chai: {
        includeStack: true,
      },
    },
    reporters: [
      'mocha',
      'coverage',
    ],
    preprocessors: {
      [testEntryFile]: [
        'webpack',
      ],
      [`${testFolder}/**/*.spec.js`]: [
        'webpack',
        'sourcemap',
      ],
    },
    coverageReporter: {
      type : 'html',
      dir  : path.join(ROOT_PATH, COVERAGE_FOLDER_NAME),
    },
    webpack: webpackConf,
    webpackMiddleware: {
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
 * find out scripts files
 * @param  {String} dir    test folder
 * @param  {Regexp} regexp match regexp
 * @param  {Array}  files  output files variables
 * @return {Array}
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
