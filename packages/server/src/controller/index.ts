import type { Request, Response } from 'express'
import { join } from 'path'
import config from '../config'
import staticAssets from '../helper/static-assets'

function index(path = '/') {
    return [
        staticAssets(join(config.path.public, path)),
        (req: Request, res: Response) => {
            res.setHeader('Cache-Control', 'no-cache')
            res.render(join(config.path.public, path, 'index.html'))
        }
    ]
}

export default {
    index
}
