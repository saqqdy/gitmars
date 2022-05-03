import { join } from 'path'
import config from '../config'
import staticAssets from '../helper/static-assets'

function index(path = '/') {
    return [
        staticAssets(join(config.path.public, path)),
        (req, res) => {
            res.setHeader('Cache-Control', 'no-cache')
            res.render(join(config.path.public, path, 'index.html'))
        }
    ]
}

export default {
    index
}
