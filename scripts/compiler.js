import _             from 'lodash';
import fs            from 'fs';
import path          from 'path';
import async         from 'async';
import { transform } from './libraries/babel2js';
import { compile }   from './libraries/style2css';
import { convert }   from './libraries/view2js';
import * as utils    from './libraries/utils';
import * as VARS     from './variables';

async.parallel([
  babel2js,
  scss2css,
],
function (error, stats) {
  stats = _.flatten(stats);
  console.log(error, stats);
});

function pug2js (callback) {
  if (!_.isFunction(callback)) {
    throw new Error('callback is not provided');
  }

  utils.findFiles(/\.jade$/, VARS.RESOURCE_PATH, function (error, files) {
    if (error) {
      callback(error);
      return;
    }

    files = filterPrivateFiles(files);

    let tasks = _.map(files, function (file) {
      let relative = file.replace(VARS.RESOURCE_PATH, '');
      let output   = path.join(VARS.DISTRICT_PATH, relative);
      output = output.replace('.jade', '.js');

      return function (callback) {
        convert(file, output, callback);
      };
    });

    async.parallel(tasks, callback);
  });
}

function babel2js (callback) {
  if (!_.isFunction(callback)) {
    throw new Error('callback is not provided');
  }

  fs.readdir(VARS.RESOURCE_PATH, function (error, files) {
    if (error) {
      callback(error);
      return;
    }

    let tasks = _.map(files, function (filename) {
      if ('_' === filename.charAt(0)) {
        return;
      }

      let entry = path.join(VARS.RESOURCE_PATH, filename, './index.js');
      if (!fs.existsSync(entry)) {
        console.log(`${entry} is not found`);
        return;
      }

      let relative = entry.replace(VARS.RESOURCE_PATH, '');
      let dirname  = path.dirname(relative);
      let output   = path.join(VARS.DISTRICT_PATH, dirname + '.js');

      return function (callback) {
        transform(entry, output, callback);
      };
    });

    tasks = _.filter(tasks);
    async.parallel(tasks, callback);
  });
}

function scss2css (callback) {
  if (!_.isFunction(callback)) {
    throw new Error('callback is not provided');
  }

  fs.readdir(VARS.RESOURCE_PATH, function (error, files) {
    if (error) {
      callback(error);
      return;
    }

    let tasks = _.map(files, function (filename) {
      if ('_' === filename.charAt(0)) {
        return;
      }

      let entry = path.join(VARS.RESOURCE_PATH, filename, './index.scss');
      if (!fs.existsSync(entry)) {
        console.log(`${entry} is not found`);
        return;
      }

      let relative = entry.replace(VARS.RESOURCE_PATH, '');
      let dirname  = path.dirname(relative);
      let output   = path.join(VARS.DISTRICT_PATH, dirname + '.css');

      return function (callback) {
        compile(entry, output, callback);
      };
    });

    tasks = _.filter(tasks);
    async.parallel(tasks, callback);
  });
}

function filterPrivateFiles (files) {
  return _.filter(files, function (file) {
    let name = path.basename(file);
    return '_' !== name.charAt(0);
  });
}
