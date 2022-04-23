import { default as _filesize } from 'rollup-plugin-filesize'
import type { Plugin } from 'rollup'
import { reporter } from '../utils/rollup'

const filesize: Plugin = _filesize({ reporter })

export default filesize
