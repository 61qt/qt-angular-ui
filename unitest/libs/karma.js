import fs         from 'fs-extra';
import { Server } from 'karma';

export function run (file) {
  if (!fs.existsSync(file)) {
    throw new Error(`Config file ${file} is not provided.`);
  }

  new Server({ configFile: file }).start();
}
