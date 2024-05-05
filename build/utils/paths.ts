import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const ROOT = resolve(__dirname, '..', '..')
export const BUILD = resolve(ROOT, 'build')
export const PACKAGE = resolve(ROOT, 'packages')
export const CORE = resolve(PACKAGE, 'core')
export const GITMARS = resolve(PACKAGE, 'gitmars')
export const DOCS = resolve(PACKAGE, 'docs')
