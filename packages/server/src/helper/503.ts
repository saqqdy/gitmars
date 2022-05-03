import type { Request, Response } from 'express'

export default function (req: Request, res: Response) {
    res.status(503).send({
        data: null,
        success: false,
        code: 0,
        msg: 'fail'
    })
}
