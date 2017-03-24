import fs        from 'fs-extra';
import path      from 'path';
import Coveralls from 'coveralls/lib/handleInput';

let folder  = path.join(__dirname, '../coverage/');
let file    = path.join(folder, './lcov.info');
let content = fs.readFileSync(file);

Coveralls(content, function (error) {
  if (error) {
    throw error;
  }
});
