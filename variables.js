import path from 'path'

export const rootDir = path.join(__dirname, '.')
export const srcDir = path.join(rootDir, './src')
export const distDir = path.join(rootDir, './libs')
export const coverageDir = path.join(rootDir, './coverage')
export const tmpDir = path.join(rootDir, './.temporary')
export const testDir = srcDir
