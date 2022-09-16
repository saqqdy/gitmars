import type { Request, Response } from 'express'

interface ResponseData {
    data?: any
    msg?: 'success' | 'fail'
}

export default function (
    req: Request,
    res: Response,
    { data = true, msg = 'success' }: ResponseData
) {
    res.status(200).send({
        data,
        success: true,
        code: 1,
        msg
    })
}
