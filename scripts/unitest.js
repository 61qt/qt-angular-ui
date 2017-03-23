import _         from 'lodash';
import fs        from 'fs-extra'
import path      from 'path';
import * as VARS from './variables';

/**
 * Build unified entrance
 * Find out all files end in '.spec.js'
 * import these files to bootstrap (the unified entrance).
 * And karma will split different modules and sessions.
 *
 * * Because karma will watch file changed before read config
 * * so that it will trigger changed event when reading config file,
 * * and at this time, if we create or change any files, it will trigger
 * * karma processor or other plugin be exected.
 * * So it must be generated in other file and exec it before run karma.
 */

let testEntryFile = path.join(VARS.TEMPORARY_PATH, './bootstrap.spec.js');
let specFiles     = findFiles(VARS.UNITEST_PATH, /^[^\.]+\.spec\.js$/);
let depsSource    = specFiles.map(formatImport).join('');

fs.ensureDirSync(path.dirname(testEntryFile));
fs.writeFileSync(testEntryFile, depsSource);

/**
 * return file imported string
 */
function formatImport (file) {
  // return `import '${file}';\n`;
}

/**
 * find out scripts files
 */
function findFiles (dir, regexp, files = []) {
  fs
  .readdirSync(dir)
  .forEach((name) => {
    let file = path.join(dir, name);

    if (fs.statSync(file).isDirectory()) {
      findFiles(file, regexp, files);
    }
    else if (regexp instanceof RegExp) {
      regexp.test(name) && files.push(file);
    }
    else {
      files.push(file);
    }
  });

  return files;
}
