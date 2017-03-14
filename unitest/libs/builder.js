import _            from 'lodash';
import fs           from 'fs-extra';
import path         from 'path';
import async        from 'async';
import colors       from 'colors';
import {
  trace,
  convertName,
  copyAndRender,
}                   from './utils.js';
import {
  RESOURCE_FOLDER_NAME,
  ENTRY_FOLDER_NAME,
}                   from '../conf/config';
import OptionMerger from './option_merger';

/**
 * 生成模块
 * @param  {string}  name    模块名称
 * @param  {Object}  datas   数据
 * @param  {Boolean} isForce 是否强制
 * @return {Boolean}
 */
export function mkModule (name, options, callback) {
  /* istanbul ignore if */
  if (3 > arguments.length) {
    return mkModule(name, {}, options);
  }

  /* istanbul ignore if */
  if (!_.isFunction(callback)) {
    throw new Error('Callback is not provided.');
  }

  /**
   * 检查模板是否存在, 不存在则报错并退出
   * check moudle template exists and exist process when template not exists.
   */
  let templateDir = path.join(OptionMerger.EXEC_PATH, './templates/module');
  if (!fs.existsSync(templateDir)) {
    callback(new Error(`Module template is not found, see ${templateDir}`));
    return;
  }

  options = _.defaults(options, {
    ignoreExists : false,
    basePath     : process.cwd(),
    distFolder   : path.join(RESOURCE_FOLDER_NAME, ENTRY_FOLDER_NAME),
  });

  let names     = convertName(name);
  let filename  = names.underscore;
  let moduleDir = path.join(options.basePath, options.distFolder, filename);

  /**
   * 检查是否已经存在, 如果模块已经存在则直接退出
   * check module exists and exit process when file is exists.
   */
  if (fs.existsSync(moduleDir)) {
    true !== options.ignoreExists && trace(`Module ${colors.bold(name)} is already exists.`.yellow);
    callback(null);
    return;
  }

  /**
   * 复制并渲染模板文件
   * copy and render file with data.
   */
  fs.ensureDir(moduleDir, function (error) {
    if (error) {
      callback(error);
      return;
    }

    copyAndRender(templateDir, moduleDir, { names }, callback);
  });
}

/**
 * 创建模块与组件
 * @param  {String} argv 指令
 */
export function mkRoute (route, moduleName, options, callback) {
  if (!_.isFunction(callback)) {
    throw new Error('Callback is not provided.');
  }

  let routes = _.isArray(route) ? route : route.split('\/');
  let family = [moduleName];
  let tasks  = _.map(routes, function (name) {
    return function (callback) {
      mkComponent(name, family, options, function (error, stats) {
        if (error) {
          callback(error);
          return;
        }

        family.push(name);

        callback(null, stats);
      });
    };
  });

  async.series(tasks, function (error, stats) {
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
 * 创建组件
 * @param  {String} name   组件名称
 * @param  {Array}  family 模块关系
 * @param  {Object} datas  数据
 * @return {Boolean}
 */
export function mkComponent (name, family, options, callback) {
  /* istanbul ignore if */
  if (4 > arguments.length) {
    return mkComponent(name, family, {}, options);
  }

  /* istanbul ignore if */
  if (!_.isFunction(callback)) {
    throw new Error('Callback is not provided.');
  }

  /**
   * 检查模板是否存在, 不存在则报错并退出
   * check component template exists and exist process when template not exists.
   */
  let templateDir = path.join(OptionMerger.EXEC_PATH, './templates/component');
  if (!fs.existsSync(templateDir)) {
    callback(new Error(`Component template is not found, see ${templateDir}.`));
    return;
  }

  options = _.defaults(options, {
    ignoreExists : true,
    basePath     : process.cwd(),
    distFolder   : path.join(RESOURCE_FOLDER_NAME, ENTRY_FOLDER_NAME),
  });

  let names = convertName(name);
  let pwd   = _.map(family, function (name) {
    return `${name}/components/`;
  });

  let dist = path.join(options.basePath, options.distFolder, pwd.join('\/'), name);
  if (fs.existsSync(dist)) {
    true !== options.ignoreExists && trace(`Component ${colors.bold(name)} is already exists.`.yellow);
    callback(null);
    return;
  }

  /**
   * 复制并渲染模板文件
   * copy and render file with data.
   */
  fs.ensureDir(dist, function () {
    let nsNames = _.map(family, convertName);
    let ns      = {
      camelcase  : _.map(nsNames, 'camelcase').join('.'),
      underscore : _.map(nsNames, 'underscore').join('/'),
      hyphen     : _.map(nsNames, 'hyphen').join(' '),
      cssFamily  : _.map(nsNames, function ({ hyphen }) {
        return `${hyphen}-viewport`;
      }),
    };

    copyAndRender(templateDir, dist, { names, ns }, callback);
  });

  return;
}
