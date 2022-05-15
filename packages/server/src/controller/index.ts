import type { Request, Response } from 'express'
const { join } = require('path')
// const config = require('../config')
const staticAssets = require('../helper/static-assets')

function index(path = '/dist') {
    console.log(100, process.cwd(), path)
    return [
        staticAssets(join(process.cwd(), path)),
        (req: Request, res: Response) => {
            res.setHeader('Cache-Control', 'no-cache')
            // res.render(join(config.path.public, path, 'index.html'))
            res.render(join(process.cwd(), path, 'index.html'))
        }
    ]
}

module.exports = {
    index
}
export {}
