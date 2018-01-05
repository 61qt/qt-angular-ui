import fs from 'fs-extra'
import path from 'path'
import map from 'lodash/map'
import filter from 'lodash/filter'
import indexOf from 'lodash/indexOf'
import webpack, { DefinePlugin } from 'webpack'
import WebpackMerger from 'webpack-merge'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import WebpackConfig from './webpack.common.config.babel'
import { srcDir, distDir, tmpDir } from './variables'

const { UglifyJsPlugin } = webpack.optimize

let bootFile = path.join(tmpDir, './bootstrap.spec.js')
let cmpDir = path.join(srcDir, './components')
let files = map(fs.readdirSync(cmpDir), (folderName) => path.join(cmpDir, folderName, '/index.js'))
let source = map(files, (file) => `import '${file}';`).join('\n')

fs.ensureFileSync(bootFile)
fs.writeFileSync(bootFile, source)

/**
 * Filter CommonsChunkPlugin
 * docs: https://github.com/webpack-contrib/karma-webpack/issues/24
 */
WebpackConfig.plugins = filter(WebpackConfig.plugins, (plugin) => {
  let index = indexOf(['CommonsChunkPlugin', 'HtmlWebpackPlugin'], plugin.constructor.name)
  return index === -1
})

export default WebpackMerger(WebpackConfig, {
  devtool: 'source-map',
  entry: {
    index: [
      'babel-polyfill',
      bootFile
    ]
  },
  output: {
    filename: '[name].js',
    umdNamedDefine: false
  },
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
    }),

    /**
     * Copy files
     */
    new CopyWebpackPlugin([
      {
        context: srcDir,
        from: '+(components|share|stylesheets)/**',
        to: path.join(distDir, './')
      }
    ])
  ]
})
