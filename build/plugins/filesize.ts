import type { Plugin } from 'rollup'
import filesize from 'rollup-plugin-filesize'
import { reporter } from '../utils/rollup'

export default filesize({ reporter }) as Plugin
