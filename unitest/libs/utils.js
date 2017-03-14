import _            from 'lodash';
import fs           from 'fs-extra';
import path         from 'path';
import async        from 'async';
import colors       from 'colors';
import handlebars   from 'handlebars';
import columnify    from 'columnify';
import OptionMerger from './option_merger';

const ingoreTrace = -1 === _.indexOf(process.argv, '--quiet');

/**
 * convert name
 * @param  {String} name
 * @return {Object}
 * @description
 * convert "-", "_", "camelName", "NAME", "name"
 * "-hyphen" for style class
 * "_underscore" for filename
 * "camelName" for javascript variables
 */
export function convertName (name) {
  let camelcase = name.replace(/[- _]([\w])/g, ($all, $1) => {
    return $1.toUpperCase();
  })
  .replace(/^[A-Z]/, ($all) => {
    return $all.toLowerCase();
  });

  let underscore = camelcase.replace(/[A-Z]/g, ($all) => {
    return `_${$all.toLowerCase()}`;
  });

  let hyphen = camelcase.replace(/[A-Z]/g, ($all) => {
    return `-${$all.toLowerCase()}`;
  });

  let blank = camelcase.replace(/[A-Z]/g, ($all) => {
    return ` ${$all.toLowerCase()}`;
  })
  .replace(/^[a-z]/, ($all) => {
    return $all.toUpperCase();
  });

  let upCamelcase = camelcase.replace(/^[a-z]/, ($all) => {
    return $all.toUpperCase();
  });

  return {
    camelcase,
    upCamelcase,
    underscore,
    hyphen,
    blank,
  };
}

/**
 * format size by unit
 * @param  {Number} bytes    size
 * @param  {Number} decimals
 * @return {String}
 */
export function formatBytes (bytes, decimals) {
  if (0 === bytes) {
    return '0 Bytes';
  }

  let k     = 1000;
  let dm    = decimals + 1 || 3;
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i     = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * print stats
 * @param  {Object} options setting
 */
export function trace (message) {
  ingoreTrace && console.log(message);
}

/**
 * build a class with some prototypes use for inherit
 * @param  {Object} proto prototypes
 * @return {Class}
 */
export function buildInheritance (proto) {
  let InhertClass = function () {};
  Object.assign(InhertClass.prototype, proto);
  return InhertClass;
}

/**
 * 复制并渲染
 * @param {Array}  files   文件集合
 * @param {Object} datas   渲染的数据
 * @param {String} fromDir 资源所在路径
 * @param {String} toDir   目标路径
 */
export function copyAndRender (fromDir = '', toDir = '', datas = {}, callback) {
  /* istanbul ignore if */
  if (!_.isFunction(callback)) {
    throw new Error('Callback is not provided.');
  }

  let files = fs.readdirSync(fromDir);

  if (_.isEmpty(files)) {
    callback(null, []);
    return;
  }

  let tasks = _.map(files, function (filename) {
    return function (callback) {
      let file = path.join(fromDir, filename);

      /**
       * 判断文件目录是否为文件夹, 如果为文件夹则创建文件夹并将
       * 里面的文件全部复制到目标相应目录
       * 这里使用地推方法, 当所有文件都复制完毕会退出递归
       */
      if (fs.statSync(file).isDirectory()) {
        let targetDir = path.join(toDir, filename);

        fs.ensureDir(targetDir, function (error) {
          if (error) {
            callback(error);
            return;
          }

          copyAndRender(file, targetDir, datas, callback);
        });

        return;
      }

      let targetFile = path.join(toDir, filename);

      /**
       * 模板文件不是 handlebars 文件则退出,
       * 目前暂只支持 handlebars 的模板引擎.
       */
      if ('.hbs' !== path.extname(file)) {
        /**
         * 如果目标文件已经存在, 则退出不做任何操作,
         * 因此请确定文件是否存在, 若存在则无办法继续执行复制.
         */
        if (fs.existsSync(targetFile)) {
          callback(null);
          return;
        }

        fs.copy(file, targetFile, function (error) {
          if (error) {
            callback(error);
            return;
          }

          callback(null, { assets: targetFile, size: fs.statSync(targetFile).size });
        });

        return;
      }

      let doneFile = targetFile.replace(/\.hbs$/, '');

      /**
       * 如果目标文件已经存在, 则退出不做任何操作,
       * 因此请确定文件是否存在, 若存在则无办法继续执行复制.
       */
      if (fs.existsSync(doneFile)) {
        callback(null);
        return;
      }

      /**
       * 编译文件并保存到相应的文件目录
       */
      let template = fs.readFileSync(file, 'utf-8');
      let compile  = handlebars.compile(template);
      let source   = compile(datas);

      fs.writeFileSync(doneFile, source);
      callback(null, { assets: doneFile, size: source.length });
    };
  });

  async.parallel(tasks, function (error, stats) {
    if (error) {
      callback(error);
      return;
    }

    stats = _.flattenDeep(stats);
    stats = _.filter(stats);

    callback(null, stats);
  });
}

/**
 * Print results
 * @param  {Array}  stats   result set
 * @param  {Object} options columnify setting
 */
export function printStats (stats, options) {
  /* istanbul ignore if */
  if (_.isEmpty(stats)) {
    trace(colors.yellow('Generate completed but nothing to be generated.'));
    return false;
  }

  options = _.defaultsDeep(options, {
    headingTransform (heading) {
      return (heading.charAt(0).toUpperCase() + heading.slice(1)).white.bold;
    },
    config: {
      assets: {
        align: 'right',
        dataTransform (file) {
          file = file.replace(OptionMerger.ROOT_PATH + '/', '');
          return colors.green(file).bold;
        },
      },
      size: {
        align: 'right',
        dataTransform (size) {
          return formatBytes(size);
        },
      },
      domain: {
        align: 'right',
        dataTransform (domain) {
          domain = _.isArray(domain) ? domain.join(',') : domain;
          domain = colors.green(domain);
          return colors.bold(domain);
        },
      },
      proxy: {
        align: 'right',
      },
      entries: {
        align: 'left',
        dataTransform (entries) {
          entries = _.isArray(entries) ? entries.join('|') : entries;
          entries = colors.green(entries);
          return colors.bold(entries);
        },
      },
    },
  });

  /* eslint no-console:off */
  trace(columnify(stats, options) + '\n');
  return true;
}
