import type { Request, Response, NextFunction } from 'express'
import log4js from '../log/logger'
const logger = log4js.getLogger('website')

export interface ErrorType extends Error {
    status: number
}

export default function () {
    return [
        // 404 not found
        (req: Request, res: Response, next: NextFunction) => {
            // logger.error(404);
            const err = new Error('Not Found') as ErrorType
            err.status = 404
            next(err)
        },
        // error handler
        (err: ErrorType, req: Request, res: Response, next: NextFunction) => {
            res.locals.message = err.message
            res.locals.error = err
            // 如果是404，则不打印错误
            if (err.status !== 404) {
                logger.error(err)
            }
            res.status(err.status || 500)
            res.render('error', {
                title: err.status || 500,
                err
            })
        }
    ]
}
