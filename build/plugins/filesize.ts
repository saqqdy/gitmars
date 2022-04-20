import { default as _filesize } from 'rollup-plugin-filesize'
import { reporter } from '../utils/rollup'
import type { Plugin } from 'rollup'

const filesize: Plugin = _filesize({ reporter })

export default filesize
