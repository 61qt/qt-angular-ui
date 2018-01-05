import path from 'path'
import { DefinePlugin } from 'webpack'
import WebpackMerger from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackConf from './webpack.common.config.babel'
import { srcDir, demoDir } from './variables'
import { name as Name } from './package.json'

export default WebpackMerger(WebpackConf, {
  devtool: 'source-map',
  entry: {
    index: path.join(srcDir, './index.js')
  },
  output: {
    path: demoDir,
    publicPath: `/${Name}/${path.basename(demoDir)}`,
    umdNamedDefine: false
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
      filename: path.join(demoDir, './index.html'),
      template: path.join(srcDir, './index.pug')
    })
  ]
})
