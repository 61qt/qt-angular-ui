import _                     from 'lodash';
import fs                    from 'fs-extra';
import path                  from 'path';
import webpack               from 'webpack';
import CleanWebpackPlugin    from 'clean-webpack-plugin';
import SvgStore              from 'webpack-svgstore-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import HtmlWebpackPlugin     from 'html-webpack-plugin';
import autoprefixer          from 'autoprefixer';
import ExtractTextPlugin     from 'extract-text-webpack-plugin';
import CopyWebpackPlugin     from 'copy-webpack-plugin';
import {
  CLIENT_DOMAIN,
  SERVER_DOMAIN,
  ASSETS_DOMAIN,
  UPLOAD_DOMAIN,

  PROJECT_NAME,

  RESOURCE_FOLDER_NAME,
  TEMPORARY_FOLDER_NAME,
  DEVELOP_FOLDER_NAME,
  DISTRICT_FOLDER_NAME,
  COVERAGE_FOLDER_NAME,

  ROOT_PATH,
  EXEC_PATH,
  DISTRICT_PATH,
  ENTRY_PATH,
}                            from './config';

/**
 * Entries definitions
 */
let entries = {};

/**
 * reolve path definitions
 */
let resolveModules = [
  path.join(EXEC_PATH, 'node_modules'),
  path.join(ROOT_PATH, 'node_modules'),
  path.join(ROOT_PATH, TEMPORARY_FOLDER_NAME),
  path.join(ROOT_PATH, RESOURCE_FOLDER_NAME),
];

/**
 * Plugins definitions
 */
let plugins = [
  /**
   * set environment variables
   * you can find out global variables in javascript
   *
   * if you want to set __VALUE_ equal 'string' (__VALUE__ = 'string')
   * yout muse define { __VALUE__ : '\"string\"' }
   */
  new webpack.DefinePlugin({
    __DEVELOP__       : !!process.env.DEVELOP,
    __PRODUCT__       : !!process.env.PRODUCT,
    __UNITEST__       : !!process.env.UNITEST,

    __CLIENT_DOMAIN__ : JSON.stringify(CLIENT_DOMAIN),
    __ASSETS_DOMAIN__ : JSON.stringify(ASSETS_DOMAIN),
    __UPLOAD_DOMAIN__ : JSON.stringify(UPLOAD_DOMAIN),
    __SERVER_DOMAIN__ : JSON.stringify(SERVER_DOMAIN),
  }),

  /**
   * Extract common modules
   * to reduce code duplication
   */
  new webpack.optimize.CommonsChunkPlugin({
    name    : 'vendor',
    chunks  : [],
    minChunks (module) {
      let folder = path.resolve(ROOT_PATH, RESOURCE_FOLDER_NAME);
      return module.resource && -1 === module.resource.indexOf(folder);
    },
  }),

  /**
   * Extract style file
   * Inline styles can be externally optimized for loading
   */
  new ExtractTextPlugin({
    filename: 'styles/[name].[contenthash].css',
    allChunks: true,
  }),

  /**
   * Copy files
   */
  new CopyWebpackPlugin([
    {
      from    : path.join(ROOT_PATH, RESOURCE_FOLDER_NAME, 'assets/panels/**'),
      to      : path.join(DISTRICT_PATH, 'assets/panels/'),
      flatten : true,
    }
  ]),

  /**
   * Clean generate folders
   * run it first to reset the project.
   */
  new CleanWebpackPlugin([
    TEMPORARY_FOLDER_NAME,
    DEVELOP_FOLDER_NAME,
    DISTRICT_FOLDER_NAME,
    COVERAGE_FOLDER_NAME,
  ],
  {
    root      : ROOT_PATH,
    verbose   : true,
    dry       : false,
  }),
];

// let Injector = injectScript(plugins);
let CallAfter = widthDone(plugins);

/**
 * Generate some compile tasks
 */
generateEnteries(plugins, entries);
generateFavicons(plugins);
// generateSVGSprites(plugins);

/**
 * some browser will request '/favicon.ico' file
 * wechat browser in ios reset title will also request '/favicon.ico'
 * (use iframe to request favicon.ico file)
 */
let faviconFile = path.join(DISTRICT_PATH, 'favicon.ico');
fs.ensureFileSync(faviconFile);

/**
 * loader and rules definitions
 */
let rules = [
  {
    test : /\.html$/,
    use  : [
      {
        loader: 'html-loader',
        options: {
          attrs: ['img:src', 'img:ng-src'],
        },
      },
    ],
  },
  {
    test : /\.jade$/,
    use  : [
      {
        loader: 'pug-loader',
      },
    ],
  },
  {
    test    : /\.css$/,
    enforce : 'pre',
    exclude : [/node_modules/],
    loader  : 'stylelint-loader',
    options : {
      configFile: backup(path.join(ROOT_PATH, '.stylelintrc'), path.join(EXEC_PATH, '.stylelintrc')),
    },
  },
  /**
   * As Jade/Pug will use require() to load public style
   * like bootstrap.css, so that we must provider a loader
   * to load the file.
   * At the same time, `ExtractTextPlugin` plugin do not
   * match .css file, because it will throw an error to
   * tell you no loader can load this file.
   *
   * Error:
   *   Module build failed:
   *   Error: "extract-text-webpack-plugin" loader is used
   *   without the corresponding plugin, refer to
   *   https://github.com/webpack/extract-text-webpack-plugin
   *   for the usage example
   */
  {
    test : /\.css$/,
    use  : {
      loader  : 'url-loader',
      options : {
        limit : 10000,
        name  : 'styles/[name].[hash].css',
      }
    },
  },
  /**
   * docs:
   * - https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/263
   */
  {
    test : /\.(sass|scss)$/,
    use  : ExtractTextPlugin.extract({
      fallback : 'style-loader',
      use      : [
        {
          loader  : 'css-loader',
          options : {
            sourceMap: true,
          },
        },
        {
          loader  : 'sass-loader',
          options : {
            includePaths : resolveModules,
            data         : [''].join('\n'),
          },
        },
        {
          loader  : 'postcss-loader',
          options : {
            plugins: [
              autoprefixer({
                browsers: [
                  'last 10 version',
                  'ie >= 9',
                ],
              }),
            ],
          },
        },
      ],
    }),
  },
  {
    test    : /\.js$/,
    enforce : 'pre',
    exclude : [/node_modules/],
    loader  : 'eslint-loader',
    options : {
      configFile: backup(path.join(ROOT_PATH, '.eslintrc'), path.join(EXEC_PATH, '.eslintrc')),
    },
  },
  {
    test : /\.js$/,
    use  : [
      {
        loader: 'ng-annotate-loader',
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
          presets: [
            require.resolve('babel-preset-es2015'),
            require.resolve('babel-preset-stage-0'),
          ],
        },
      },
    ],
  },
  /**
   * 少于 10K 图片用 base64
   * url-loader 依赖 file-loader
   */
  {
    test : /\.(jpe?g|png|gif)$/i,
    use  : [
      {
        loader  : 'url-loader',
        options : {
          limit : 10000,
          name  : 'panels/[name].[hash].[ext]',
        },
      },
    ],
  },
];

/**
 * Webpack Setting
 */
export default {
  entry   : entries,
  output  : {
    path        : DISTRICT_PATH,
    publicPath  : '/',
    filename    : '[name].js',
  },
  module: {
    rules: rules,
  },
  resolve: {
    modules: resolveModules,
  },
  resolveLoader: {
    modules: resolveModules,
  },
  plugins,
};

/**
 * Auto generate entries
 * Generate entries dependent on folder (src/entry/{folder})
 * And entry js file must be named 'index.js'
 */
export function generateEnteries (plugins, entries) {
  if (!_.isArray(plugins)) {
    throw new Error('Parameter plugins must be a array.');
  }

  if (!_.isObject(entries)) {
    throw new Error('Parameter entries must be a object.');
  }

  if (fs.existsSync(ENTRY_PATH) && fs.lstatSync(ENTRY_PATH).isDirectory()) {
    let modules = fs.readdirSync(ENTRY_PATH);

    if (0 === modules.length) {
      return false;
    }

    modules.forEach((name) => {
      let dir = path.join(ENTRY_PATH, name);

      if (fs.statSync(dir).isDirectory()) {
        let bootstrapFile = path.join(dir, 'index.js');

        if (fs.existsSync(bootstrapFile)) {
          entries[name] = bootstrapFile;

          /**
           * reanme entry html
           */
          let options = {
            filename: path.join(DISTRICT_PATH, `${name}.html`),
          };

          /**
           * use template when then template file exists
           */
          let tmplFile = path.join(ENTRY_PATH, `${name}/index.jade`);
          if (fs.existsSync(tmplFile)) {
            Object.assign(options, {
              template: tmplFile,
            });
          }

          /**
           * clean other static resources
           */
          Object.assign(options, {
            excludeChunks: _.without(modules, name),
          });

          let plugin = new HtmlWebpackPlugin(options);
          plugins.push(plugin);
        }
      }
    });

    return true;
  }

  return false;
}

/**
 * auto split logo task
 * if logo file not exists, this task will not be executed.
 */
export function generateFavicons (plugins) {
  if (!_.isArray(plugins)) {
    throw new Error('Parameter plugins must be a array.');
  }

  const LOGO_FILE = path.join(ROOT_PATH, RESOURCE_FOLDER_NAME, 'assets/panels/logo.png');

  if (fs.existsSync(LOGO_FILE)) {
    let statsFile = 'favicon/iconstats.json';

    let plugin = new FaviconsWebpackPlugin({
      logo            : LOGO_FILE,
      prefix          : 'favicon/[hash]/',
      emitStats       : true,
      statsFilename   : statsFile,
      persistentCache : true,
      inject          : true,
      background      : '#fff',
      icons: {
        android       : true,
        appleIcon     : true,
        appleStartup  : false,
        coast         : false,
        favicons      : true,
        firefox       : true,
        opengraph     : false,
        twitter       : false,
        yandex        : false,
        windows       : false,
      },
    });

    plugins.push(plugin);

    /**
     * after compile, it will generate 'favicon.ico' file
     * and copy it to the root path.
     */
    CallAfter.add(() => {
      let sourceFile = path.join(DISTRICT_PATH, statsFile);
      if (!fs.existsSync(sourceFile)) {
        return;
      }

      let stats   = fs.readJsonSync(sourceFile);
      let favFile = path.join(DISTRICT_PATH, stats.outputFilePrefix, 'favicon.ico');

      fs.copySync(favFile, faviconFile);
    });

    return true;
  }

  return false;
}

/**
 * Auto concat svg sprite image
 * if the sprite folder (src/assets/sprites/svg/) not exists,
 * this task will not be excuted.
 */
export function generateSVGSprites (plugins) {
  if (!_.isArray(plugins)) {
    throw new Error('Parameter plugins must be a array.');
  }

  const SPRITE_DIR         = path.join(RESOURCE_FOLDER_NAME, 'assets/sprites/svg');
  const SPRITE_CONFIG_FILE = path.join(SPRITE_DIR, 'svgstore.config.js');

  if (fs.existsSync(SPRITE_DIR) && fs.lstatSync(SPRITE_DIR).isDirectory() && fs.existsSync(SPRITE_CONFIG_FILE)) {
    Object.assign(entries, {
      svgstore: path.join(ROOT_PATH, SPRITE_CONFIG_FILE),
    });

    let plugin = new SvgStore({
      prefix      : 'sp-svg-',
      svgoOptions : {
        plugins: [
          { removeComments            : true },
          { removeMetadata            : true },
          { removeTitle               : true },
          { removeDesc                : true },
          { removeUselessDefs         : true },
          { removeXMLNS               : true },
          { minifyStyles              : true },
          { cleanupIDs                : true },
          { removeEmptyText           : true },
          { convertColors             : true },
          { convertPathData           : true },
          { convertTransform          : true },
          { removeUnknownsAndDefaults : true },
          { removeUnusedNS            : true },
          /**
           * svg in webkit old browser, it not support use (reference)
           * it must use '<use xlink:href="url#id"></use>'
           * and because svgo(https://github.com/svg/svgo) do not set
           * 'xmlns:xlink="http://www.w3.org/1999/xlink"', so it make
           * origin svg content with use tag lack 'namespace' 'prefix',
           * and it make svg display success.
           *
           * SVG 在 webkit 低版本浏览器中不支持内联 use
           * 必须使用 <use xlink:href="url#id"></use>
           * 又因为 svgo 并没有设置 xmlns:xlink="http://www.w3.org/1999/xlink"
           * 因此会使原本 svg 内含有 use 缺少 namespace prefix 的问题, 导致没法兼容加载,
           * 导致外部不能成功导入
           *
           * Error Code:
           * This page contains the following errors:
           * error on line 1 at column 15734: Namespace prefix xlink for href on use is not defined
           * Below is a rendering of the page up to the first error.
           *
           * Browser: Chrome 48.0.2564.23:
           * Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N)
           * AppleWebKit/537.36 (KHTML, like Gecko)
           * Chrome/48.0.2564.23
           * Mobile Safari/537.36
           * wechatdevtools/0.7.0
           * MicroMessenger/6.3.22
           * webview/0
           *
           * Docs : https://github.com/svg/svgo/blob/master/docs/how-it-works/en.md#3-plugins
           * API  : https://github.com/svg/svgo/blob/master/docs/how-it-works/en.md#32-api
           */
          {
            downwardCompatible: {
              type        : 'perItem',
              active      : true,
              description : 'Backward compatibility, <use> add attribute xmlns:xlink="http://www.w3.org/1999/xlink"',
              params      : {},
              fn (item) {
                if (item.isElem('use') && !hasAttr(item, 'xmlns:xlink')) {
                  setAttr(item, 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
                }
              }
            },
          },
        ],
      },
    });

    plugins.push(plugin);
    return true;
  }

  return false;

  function hasAttr (item, name) {
    let [prefix, local] = name.split(':');
    return -1 !== _.indexOf(item.attrs, { name, prefix, local });
  }

  function setAttr (item, name, value) {
    let [prefix, local] = name.split(':');
    item.attrs[name] = { value, name, prefix, local };
  }
}

/**
 * Callback after webpack excutes
 */
export function widthDone (plugins) {
  if (!_.isArray(plugins)) {
    throw new Error('Parameter plugins must be a array.');
  }

  let instance = {
    _callbacks: [],
    add (callback) {
      _.isFunction(callback) && this._callbacks.push(callback);
    },
    done () {
      _.forEach(this._callbacks, function (callback) {
        callback();
      });
    },
  };

  plugins.push({
    apply (compiler) {
      compiler.plugin('done', instance.done.bind(instance));
    },
  });

  return instance;
}

/**
 * Inject script to entry html file
 */
export function injectScript (plugins) {
  if (!_.isArray(plugins)) {
    throw new Error('Parameter plugins must be a array.');
  }

  let instance = {
    _injector  : [],
    _callbacks : [],
    inject (source) {
      if (!_.isString(source)) {
        return false;
      }

      let hash = mkhash(source);
      if (-1 !== _.indexOf(this._injector, { hash })) {
        return false;
      }

      let script = `!(function () {
        var id = 'webpack-${PROJECT_NAME}-v${hash}';
        if ('undefined' === typeof window || document.getElementById(id)) {
          return;
        }

        var node       = document.createElement('script');
        node.id        = id;
        node.innerHTML = '${source}';

        document.head.appendChild(node);
      })();`;

      this._injector.push({ hash, script });
    },
    after (callback) {
      _.isFunction(callback) && this._callbacks.push(callback);
    },
  };

  plugins.push({
    autoloadScript () {
      let scripts = [];

      _.forEach(instance._injector, function (injector) {
        scripts.push(injector.script);
      });

      return scripts.join('\n');
    },
    scriptTag (source) {
      let injector  = this.autoloadScript();
      return injector + source;
    },
    applyCompilation (compilation) {
      compilation.mainTemplate.plugin('startup', this.scriptTag.bind(this));
    },
    applyDone () {
      _.forEach(instance._callbacks, function (injector) {
        injector();
      });

      instance._callbacks.splice(0);
    },
    apply (compiler) {
      /**
       * sometimes it will trigger twice or more,
       * the core-code just exec once, see below function autoloadScript.
       */
      compiler.plugin('compilation', this.applyCompilation.bind(this));
      compiler.plugin('done', this.applyDone.bind(this));
    },
  });

  return instance;
}

/**
 * make hash code
 * See: http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery?answertab=active#tab-top
 */
function mkhash (string) {
  string = JSON.stringify(string);

  let hash = 0;
  if (0 === string.length) {
    return hash;
  }

  for (let i = 0, l = string.length; i < l; i ++) {
    let chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;

    /**
     * Convert to 32bit integer
     */
    hash |= 0;
  }

  return hash;
}

function backup (file, bkfile) {
  if (!fs.existsSync(file)) {
    return bkfile;
  }

  return file;
}
