import fs from 'fs-extra'
import path from 'path'
import watch from 'watch'
import indexOf from 'lodash/indexOf'
import forEach from 'lodash/forEach'
import trimStart from 'lodash/trimStart'
import glob from 'glob'
import colors from 'colors'
import { srcDir, docsDir, rootDir } from '../variables'

const compDir = path.join(srcDir, './components')

const copyMarkdown = (file) => {
  let task = resolveCopyDir(file)

  if (task !== null) {
    let { file, dist } = task
    fs.copySync(file, dist)
    console.log(colors.gray(file), '=>', colors.gray(dist))
  }
}

const resolveCopyDir = (file) => {
  if (file.search(compDir) === 0) {
    let relativeDir = file.replace(compDir, '')
    relativeDir = trimStart(relativeDir, '/')

    if (path.basename(relativeDir) === 'README.md') {
      let folderName = path.dirname(relativeDir)
      let fileName = folderName.substr(0, 1).toLocaleLowerCase() + folderName.substr(1).replace(/([A-Z])/g, '-$1') + '.md'
      let dist = path.join(docsDir, fileName)

      return { file, dist }
    }
  }

  if (file.search(rootDir) === 0) {
    let relativeDir = file.replace(rootDir, '')
    relativeDir = trimStart(relativeDir, '/')

    if (indexOf(['README.md', 'CHANGELOG.md'], relativeDir) !== -1) {
      let dist = path.join(docsDir, relativeDir)
      return { file, dist }
    }
  }

  return null
}

fs.copySync(path.join(srcDir, './docs'), docsDir)
console.log('Docs generated to', colors.cyan.bold(docsDir))

if (process.env.development) {
  watch.watchTree(rootDir, {
    interval: 1,
    ignoreDirectoryPattern: /node_modules/
  }, function (file, nextStats, prevStats) {
    if (typeof file === 'object' && prevStats === null && nextStats === null) {
      let files = Object.keys(file)
      forEach(files, copyMarkdown)
      return
    }

    if (prevStats === null) {
      copyMarkdown(file)
      return
    }

    if (nextStats.nlink === 0) {
      let task = resolveCopyDir(file)
      task !== null && fs.unlinkSync(task.dist)
      return
    }

    copyMarkdown(file)
  })

  console.log(colors.blue.bold('Watch docs...'))
} else {
  glob('**/*.md', { ignore: 'node_modules/**/*' }, function (error, files) {
    if (error) {
      throw error
    }

    forEach(files, (file) => copyMarkdown(path.join(rootDir, file)))
    console.log(`✨  Docs is completed, you can view docs with ${colors.magenta.bold('docsify serve ./docs')}`)
  })
}
