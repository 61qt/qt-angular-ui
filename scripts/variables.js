import path from 'path';

export let ROOT_PATH          = path.join(__dirname, '..');
export let RESOURCE_PATH      = path.join(ROOT_PATH, './src');
export let OUTPUT_PATH        = path.join(ROOT_PATH, './dist');
export let SCRIPT_SRC_PATH    = path.join(ROOT_PATH, './scripts');
export let SCRIPT_OUTPUT_PATH = path.join(ROOT_PATH, './scripts_dist');
export let COVERAGE_PATH      = path.join(ROOT_PATH, './coverage');
export let TEMPORARY_PATH     = path.join(ROOT_PATH, './.temporary');
export let UNITEST_PATH       = RESOURCE_PATH;
