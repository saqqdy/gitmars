import type { Request, Response } from 'express'

export default function (path = '/app') {
    return function (req: Request, res: Response) {
        res.redirect(path)
    }
}
