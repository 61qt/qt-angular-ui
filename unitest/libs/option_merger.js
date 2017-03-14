import _                    from 'lodash';
import fs                   from 'fs-extra';
import path                 from 'path';
import * as CONFIG          from '../conf/config';
import { buildInheritance } from './utils';

const Inheritance = buildInheritance(CONFIG);

export class OptionMerger extends Inheritance {
  constructor () {
    super();

    this.file = this.findRC();
  }

  readRC () {
    let file = this.file;
    return file ? fs.readJSONSync(file) : {};
  }

  updateRC (source) {
    let file = this.file;
    if (!file) {
      return false;
    }

    let originSource = fs.readJSONSync(file);
    source = _.defaultsDeep(source, originSource);

    fs.writeFileSync(file, JSON.stringify(source, null, 2));
  }

  findRC () {
    let file = path.join(CONFIG.ROOT_PATH, CONFIG.RC_FILE || '.ngwprc');
    if (fs.existsSync(file)) {
      return file;
    }

    return null;
  }
}

export default new OptionMerger();
