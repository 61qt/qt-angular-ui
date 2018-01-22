import fs from 'fs-extra'
import path from 'path'
import map from 'lodash/map'
import assign from 'lodash/assign'
import forEach from 'lodash/forEach'
import filter from 'lodash/filter'
import indexOf from 'lodash/indexOf'
import webpack, { DefinePlugin } from 'webpack'
import WebpackMerger from 'webpack-merge'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import WebpackConfig from './webpack.common.config.babel'
import { srcDir, tmpDir } from './variables'

const { UglifyJsPlugin } = webpack.optimize

let bootFile = path.join(tmpDir, './bootstrap.spec.js')
let cmpDir = path.join(srcDir, './components')
let files = []

forEach(fs.readdirSync(cmpDir), (folderName) => {
  let folder = path.join(cmpDir, folderName)
  if (fs.statSync(folder).isDirectory()) {
    let file = path.join(folder, '/index.js')
    fs.existsSync(file) && files.push(file)
  }
})

let source = map(files, (file) => `import '${file}';`).join('\n')

fs.ensureFileSync(bootFile)
fs.writeFileSync(bootFile, source)

let entries = {}

forEach(files, (file) => {
  let dirName = path.dirname(file)
  let folderName = path.basename(dirName)
  entries[folderName] = [file]
})

/**
 * Filter CommonsChunkPlugin
 * docs: https://github.com/webpack-contrib/karma-webpack/issues/24
 */
WebpackConfig.plugins = filter(WebpackConfig.plugins, (plugin) => {
  let index = indexOf(['CommonsChunkPlugin', 'HtmlWebpackPlugin', 'ExtractTextPlugin'], plugin.constructor.name)
  return index === -1
})

export default WebpackMerger(WebpackConfig, {
  devtool: 'source-map',
  entry: assign(entries, {
    index: [
      'babel-polyfill',
      bootFile
    ]
  }),
  output: {
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  externals: [
    {
      angular: 'angular'
    }
  ],
  module: {
    noParse: [
      /[/\\]node_modules[/\\]angular/
    ]
  },
  plugins: [
    /**
     * Define some global variables
     */
    new DefinePlugin({
      'process.env': {
        production: JSON.stringify(true)
      }
    }),

    /**
     * Extract style file
     * Inline styles can be externally optimized for loading
     */
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),

    /**
     * Compress js files
     */
    new UglifyJsPlugin({
      sourceMap: false,
      mangle: false,
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    })
  ]
})
