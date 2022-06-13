import type { Request, Response } from 'express'
const { join } = require('path')
// const config = require('../config')
const staticAssets = require('../helper/static-assets')

function index(path: string) {
    if (!path) path = join(process.cwd(), 'dist')
    return [
        staticAssets(path),
        (req: Request, res: Response) => {
            res.setHeader('Cache-Control', 'no-cache')
            // res.render(join(config.path.public, path, 'index.html'))
            res.render(join(path, 'index.html'))
        }
    ]
}

module.exports = {
    index
}
export {}
