import _         from 'lodash';
import fs        from 'fs-extra';
import path      from 'path';
import async     from 'async';
import pug       from 'pug';
import * as VARS from '../variables';
import PKG       from '../../package.json';

export function convert (file, output, options = {}, callback) {
  if (4 > arguments.length) {
    return convert(file, output, {}, options);
  }

  if (!_.isFunction(callback)) {
    throw new Error('callback is not provided');
  }

  let html = pug.renderFile(file, _.assign({}, options.data));
  let id   = file.replace(VARS.RESOURCE_PATH, '').replace('.jade', '.html');
  html = html2ng(PKG.name + id, html);

  fs.ensureDirSync(path.dirname(output));

  fs.writeFile(output, html, function (error) {
    if (error) {
      callback(error);
      return;
    }

    callback(null, {
      file : output,
      size : html.length,
    });
  });
}

function html2ng (file, html) {
  html = _.trim(html)
  .replace(/(["'`])/g, '\\$1')
  .replace(/ +/g, ' ')
  .replace(/\n/g, '');

  return [
    `export default angular.module('${file}', [])`,
    '.run([',
      '\'$templateCache\'',
      'function ($templateCache) {',
        `$templateCache.put('${file}', '${html}');`,
      '}',
    '])',
    '.name;',
  ].join('');
}