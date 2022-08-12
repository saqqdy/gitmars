import { spawnSync } from '../spawn'
import { debug } from '../utils/debug'

/**
 * 同步远程版本
 */
function fetch(): void {
    debug('fetch', 'fetch success')
    spawnSync('git', ['fetch'])
}

export default fetch
