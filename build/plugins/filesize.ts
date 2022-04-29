import filesize from 'rollup-plugin-filesize'
import type { Plugin } from 'rollup'
import { reporter } from '../utils/rollup'

export default filesize({ reporter }) as Plugin
