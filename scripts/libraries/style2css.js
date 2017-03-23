import _         from 'lodash';
import fs        from 'fs-extra';
import path      from 'path';
import sass      from 'node-sass';
import async     from 'async';
import * as VARS from '../variables';

export function compile (file, output, options = {}, callback) {
  if (4 > arguments.length) {
    return compile(file, output, {}, options);
  }

  if (!_.isFunction(callback)) {
    throw new Error('callback is nor provided');
  }

  sass.render({
    file         : file,
    includePaths : _.concat(options.resolve || [], [
      path.join(VARS.ROOT_PATH, './node_modules'),
    ]),
  },
  function (error, result) {
    if (error) {
      callback(error);
      return;
    }

    let content  = result.css.toString();
    let filename = path.basename(output);

    output = output.replace(path.extname(filename), '.css');

    fs.ensureDirSync(path.dirname(output));

    fs.writeFile(output, content, function (error) {
      if (error) {
        callback(error);
        return;
      }

      callback(null, {
        file : output,
        size : content.length,
      });
    });
  });
}
