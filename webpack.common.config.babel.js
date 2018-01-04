import path from 'path'
import webpack from 'webpack'
import WebpackMerger from 'webpack-merge'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import autoprefixer from 'autoprefixer'
import { tmpDir, srcDir, distDir, coverageDir, rootDir } from './variables'

const { CommonsChunkPlugin } = webpack.optimize

/**
 * reolve path definitions
 */
export let ResolveModules = [
  path.join(rootDir, 'node_modules'),
  srcDir, tmpDir
]

/**
 * loader and rules definitions
 */
export let Rules = [
  {
    test: /\.pug$/,
    loader: 'pug-loader'
  },
  {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            minimize: true
          }
        }
      ]
    })
  },
  {
    test: /\.(sass|scss)$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            minimize: true
          }
        },
        {
          loader: 'sass-loader',
          options: {
            includePaths: ResolveModules
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: [
              autoprefixer({
                browsers: [
                  'last 10 version',
                  'ie >= 9'
                ]
              })
            ]
          }
        }
      ]
    })
  },
  {
    test: /\.js$/,
    use: [
      {
        loader: 'ng-annotate-loader',
        options: {
          es6: true
        }
      },
      /**
       * babel@6.0.0 break the .babelrc file
       * so configure presets below
       * docs:
       * - https://github.com/babel/babel-loader/issues/166
       */
      {
        loader: 'babel-loader',
        options: {
          babelrc: path.join(rootDir, './.babelrc')
        }
      }
    ],
    exclude: [/node_modules/]
  }
]

/**
 * Plugins definitions
 */
export let Plugins = [
  /**
   * Clean generate folders
   * run it first to reset the project.
   */
  new CleanWebpackPlugin([distDir, coverageDir], {
    root: '/',
    verbose: true,
    dry: false
  }),

  /**
   * Extract common modules
   * to reduce code duplication
   */
  new CommonsChunkPlugin({
    name: 'vendor',
    minChunks: (module) => /node_modules/.test(module.resource)
  }),

  /**
   * Extract style file
   * Inline styles can be externally optimized for loading
   */
  new ExtractTextPlugin({
    filename: 'styles/[name].[contenthash].css',
    allChunks: true
  })
]

export default WebpackMerger({
  devtool: 'inline-source-map',
  output: {
    path: distDir,
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    rules: Rules
  },
  resolve: {
    modules: ResolveModules
  },
  resolveLoader: {
    modules: ResolveModules
  },
  plugins: Plugins
})
