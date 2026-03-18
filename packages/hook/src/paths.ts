import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const ROOT_PATH = resolve(__dirname, '..', '..')
export const SH_PATH = resolve(ROOT_PATH, 'sh')
