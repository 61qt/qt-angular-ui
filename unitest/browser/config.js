import path       from 'path';
import * as PATHS from '../conf/config';

export const PROJECT_NAME     = 'test';
export const TEMPORARY_FOLDER = path.join(PATHS.EXEC_PATH, PATHS.TEMPORARY_FOLDER_NAME, 'test_browser');
export const PROJECT_FOLDER   = path.join(TEMPORARY_FOLDER, './project');
export const MODULE_FOLDER    = path.join(TEMPORARY_FOLDER, './module');
export const COMPONENT_FOLDER = path.join(TEMPORARY_FOLDER, './component');
