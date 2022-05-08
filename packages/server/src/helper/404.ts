import type { Request, Response } from 'express'

module.exports = function (req: Request, res: Response) {
    res.render('error', {
        code: req.query.code
    })
}
export {}
