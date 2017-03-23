import _                 from 'lodash';
import fs                from 'fs-extra';
import path              from 'path';
import async             from 'async';
import { transformFile } from 'babel-core';

export function transform (file, output, options, callback) {
  if (4 > arguments.length) {
    return transform(file, output, {}, options);
  }

  if (!_.isFunction(callback)) {
    throw new Error('callback is not provided');
  }

  options = _.defaultsDeep(options, {
    presets: [
      require.resolve('babel-preset-es2015'),
      require.resolve('babel-preset-stage-0'),
    ],
  });

  transformFile(file, options, function (error, result) {
    if (error) {
      callback(error);
      return;
    }

    let { code } = result;
    fs.ensureDirSync(path.dirname(output));

    fs.writeFile(output, code, function () {
      if (error) {
        callback(error);
        return;
      }

      callback(null, {
        file : output,
        size : code.length,
      });
    });
  });
}
