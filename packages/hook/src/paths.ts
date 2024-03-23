import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const ROOT_PATH = resolve(__dirname, '..', '..')
export const SH_PATH = resolve(ROOT_PATH, 'sh')
