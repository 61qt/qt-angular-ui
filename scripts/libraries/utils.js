import _    from 'lodash';
import fs   from 'fs-extra';
import path from 'path';

export function findFiles (regexp = /\.scss$/, folder, options, callback) {
  if (4 > arguments.length) {
    return findFiles(regexp, folder, {}, options);
  }

  if (!_.isString(folder)) {
    throw new Error('folder must be a string');
  }

  if (!_.isFunction(callback)) {
    throw new Error('callback is not provided');
  }

  if (!fs.existsSync(folder)) {
    callback(new Error('folder is not found'));
    return;
  }

  options = _.defaultsDeep(options, {
    ignore: [/node_modules/],
  });

  let pwd   = process.cwd();
  let files = [];

  _.forEach(fs.readdirSync(folder), function (filename) {
    let file     = path.join(folder, filename);
    let relative = file.replace(pwd, '');

    if (false === ignoreFile(relative, options.ignore)) {
      return;
    }

    if (fs.statSync(file).isDirectory()) {
      findFiles(regexp, file, options, function (error, subFiles) {
        if (subFiles) {
          files = files.concat(subFiles);
        }
      });
    }
    else if (regexp.test(filename)) {
      files.push(file);
    }
  });

  callback(null, files);
}

export function ignoreFile (group, filters) {
  for (let i = 0, l = filters.length; i < l; i ++) {
    if (filters[i].test(group)) {
      return false;
    }
  }

  return true;
}
