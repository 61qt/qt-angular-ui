import fs from 'fs-extra'
import path from 'path'
import filter from 'lodash/filter'
import indexOf from 'lodash/indexOf'
import WebpackMerger from 'webpack-merge'
import { ResolveModules } from './webpack.common.config.babel'
import WebpackConf from './webpack.unitest.config.babel'
import { tmpDir, testDir, rootDir } from './variables'

WebpackConf.entry = {
  index: ['babel-polyfill']
}

/**
 * Filter CommonsChunkPlugin
 * docs: https://github.com/webpack-contrib/karma-webpack/issues/24
 */
WebpackConf.plugins = filter(WebpackConf.plugins, (plugin) => {
  let index = indexOf(['CommonsChunkPlugin', 'HtmlWebpackPlugin'], plugin.constructor.name)
  return index === -1
})

/**
 * Build unified entrance
 * Find out all files end in '.spec.js'
 * import these files to bootstrap (the unified entrance).
 * And karma will split different modules and sessions.
 */

let testEntryFile = path.join(tmpDir, './bootstrap.spec.js')
let specFiles = findFiles(testDir, /^[^.]+\.spec\.js$/)
let depsSource = specFiles.map(formatImport).join('')

fs.ensureDirSync(path.dirname(testEntryFile))
fs.writeFileSync(testEntryFile, depsSource)

export default function (config) {
  let karmaConf = {
    basePath: rootDir,
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      // testEntryFile,
      './src/components/Alert/index.spec.js'
    ],
    client: {
      chai: {
        includeStack: true
      }
    },
    preprocessors: {
      [testEntryFile]: [
        'webpack',
        'sourcemap'
      ],
      './src/**/*.spec.js': [
        'webpack',
        'sourcemap'
      ]
    },
    reporters: [
      'mocha'
    ],
    webpack: WebpackConf,
    webpackMiddleware: {
      // It suppress error shown in console, so it has to be set to false.
      quiet: false,
      // It suppress everything except error, so it has to be set to false as well
      // to see success build.
      noInfo: false,
      stats: {
        // only warning and error informations
        // docs: https://webpack.js.org/configuration/stats/
        colors: true,
        warnings: true,
        errors: true,
        errorDetails: true,

        version: false,
        assets: false,
        cached: false,
        cachedAssets: false,
        modules: false,
        moduleTrace: false,
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        children: false,
        hash: false,
        timings: false
      }
    },
    /**
     * in empty test folder, it will return
     * status 1 and throw error.
     * set 'failOnEmptyTestSuite' to false
     * will resolve this problem.
     */
    failOnEmptyTestSuite: false,
    autoWatch: false,
    singleRun: true,
    colors: true,
    logLevel: config.LOG_INFO,
    plugins: [
      'karma-phantomjs-launcher',
      'karma-webpack',
      'karma-chai',
      'karma-sinon',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-coverage-istanbul-reporter',
      'karma-sourcemap-loader'
    ]
  }

  if (process.env.COVERAGE) {
    karmaConf.reporters = [
      'mocha',
      'coverage-istanbul'
    ]

    karmaConf.coverageIstanbulReporter = {
      reports: ['lcov', 'text-summary'],
      fixWebpackSourcePaths: true
    }

    karmaConf.webpack = WebpackMerger(WebpackConf, {
      module: {
        rules: [
          {
            test: /\.js$/,
            enforce: 'post',
            include: ResolveModules,
            exclude: [
              /node_modules/,
              /\.spec\.js$/
            ],
            use: [
              {
                loader: 'istanbul-instrumenter-loader',
                query: {
                  esModules: true
                }
              }
            ]
          }
        ]
      }
    })
  }

  config.set(karmaConf)
}

/**
 * return file imported string
 */
function formatImport (file) {
  return `import '${file}';\n`
}

/**
 * find out scripts files
 */
function findFiles (dir, regexp, files = []) {
  fs.readdirSync(dir).forEach((name) => {
    let file = path.join(dir, name)

    if (fs.statSync(file).isDirectory()) {
      findFiles(file, regexp, files)
    } else if (regexp instanceof RegExp) {
      regexp.test(name) && files.push(file)
    } else {
      files.push(file)
    }
  })

  return files
}
