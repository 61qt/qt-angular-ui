import webpack           from 'webpack';
import WebpackMerger     from 'webpack-merge';
import webpackConfig     from './webpack.common.config.babel';
import { ASSETS_DOMAIN } from './config';

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

export default WebpackMerger(webpackConfig, {
  output: {
    filename   : '[name].[chunkhash].js',
    publicPath : ASSETS_DOMAIN ? `//${ASSETS_DOMAIN}/` : '/',
  },
  plugins: [
    new UglifyJsPlugin({
      sourceMap : false,
      mangle    : false,
      compress  : {
        warnings: false,
      },
      output: {
        comments: false
      },
    }),
  ],
});
