import { resolve } from 'path'

export const ROOT = resolve(__dirname, '..', '..')
export const BUILD = resolve(ROOT, 'build')
export const PACKAGE = resolve(ROOT, 'packages')
export const CORE = resolve(PACKAGE, 'core')
export const GITMARS = resolve(PACKAGE, 'gitmars')
export const DOCS = resolve(PACKAGE, 'docs')

export const CORE_INPUT = resolve(CORE, 'src')
export const CORE_OUTPUT = resolve(CORE, 'lib')
export const GITMARS_INPUT = resolve(GITMARS, 'src')
export const GITMARS_OUTPUT = resolve(GITMARS, 'lib')
// export const DOCS_INPUT = resolve(DOCS, '.')
export const DOCS_OUTPUT = resolve(DOCS, 'dist')
