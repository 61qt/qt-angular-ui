import path from 'path'
import webpack from 'webpack'
import WebpackMerger from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackConf from './webpack.common.config.babel'
import { srcDir, distDir } from './variables'

const DefinePlugin = webpack.DefinePlugin

export default WebpackMerger(WebpackConf, {
  devtool: 'source-map',
  entry: {
    index: path.join(srcDir, './index.js')
  },
  devServer: {
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
    },
    hot: true,
    inline: true,
    disableHostCheck: true
  },
  plugins: [
    /**
     * Define some global variables
     */
    new DefinePlugin({
      'process.env': {
        development: JSON.stringify(true)
      }
    }),

    new HtmlWebpackPlugin({
      filename: path.join(distDir, './index.html'),
      template: path.join(srcDir, './index.pug')
    })
  ]
})
