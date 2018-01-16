import fs from 'fs-extra'
import path from 'path'
import pick from 'lodash/pick'
import assign from 'lodash/assign'
import Package from '../package.json'
import { distDir, rootDir } from '../variables'

let source = pick(Package, ['name', 'version', 'license', 'description', 'homepage', 'repository', 'dependencies'])
source = assign({ main: './index.js', style: './index.css' }, source)

fs.ensureDirSync(distDir)
fs.writeFileSync(path.join(distDir, './package.json'), JSON.stringify(source, null, 2))

fs.copySync(path.join(rootDir, './.travis.yml'), path.join(distDir, './.travis.yml'))
