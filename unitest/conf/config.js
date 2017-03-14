// import _               from 'lodash';
// import fs              from 'fs-extra';
import path            from 'path';
import { name }        from '../../package';
// import { convertName } from '../libs/utils';

export let PROJECT_NAME          = name;

export let RESOURCE_FOLDER_NAME  = 'src';
export let LOGGER_FOLDER_NAME    = 'logs';
export let TEMPORARY_FOLDER_NAME = '.temporary';
export let DEVELOP_FOLDER_NAME   = '.dist';
export let DISTRICT_FOLDER_NAME  = 'dist';
export let UNITEST_FOLDER_NAME   = 'unitest';
export let COVERAGE_FOLDER_NAME  = 'coverage';
export let ENTRY_FOLDER_NAME     = 'app';

export let ROOT_PATH             = process.cwd();
export let EXEC_PATH             = path.join(__dirname, '../../');
export let DISTRICT_PATH         = path.join(ROOT_PATH, process.env.DEVELOP ? DEVELOP_FOLDER_NAME : DISTRICT_FOLDER_NAME);
export let ENTRY_PATH            = path.join(ROOT_PATH, RESOURCE_FOLDER_NAME, ENTRY_FOLDER_NAME);

export let DEVELOP_SERVER_PORT   = 50000;


export let MODULES               = [];