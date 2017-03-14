import fs             from 'fs-extra';
import path           from 'path';
import async          from 'async';
import { Server }     from 'karma';
// import { initialize } from '../src/libs/initialization';
import {
  mkModule,
  mkComponent,
}                     from './libs/builder';
import * as CONF      from './browser/config';

fs.removeSync(CONF.TEMPORARY_FOLDER);

async.parallel([
  function (callback) {
    mkModule(CONF.PROJECT_NAME, {
      ignoreTrace : true,
      basePath    : '',
      distFolder  : CONF.MODULE_FOLDER,
    }, callback);
  },
  function (callback) {
    mkComponent(CONF.PROJECT_NAME, [], {
      ignoreTrace : true,
      basePath    : '',
      distFolder  : CONF.COMPONENT_FOLDER,
    }, callback);
  },
],
function (error) {
  if (error) {
    throw error;
  }

  let server = new Server({
    configFile: path.join(__dirname, './browser/karma.config'),
  },
  function (exitCode) {
    fs.removeSync(CONF.TEMPORARY_FOLDER);
    process.exit(exitCode);
  });

  server.start();
});
