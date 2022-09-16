import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import type { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import express from 'express'
import cookieParser from 'cookie-parser'
// import logger from 'logger'
import indexRouter from '#lib/routes/index'
import cmdRouter from '#lib/routes/cmd'
import commonRouter from '#lib/routes/common'
import fallbackRouter from '#lib/routes/fallback'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()

// view engine setup
app.set('views', join(__dirname, 'views'))
app.set('view engine', 'hbs')

// app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use(
//     express.static(join(__dirname, './www'), {
//         maxAge: 0,
//         immutable: true
//     })
// )

app.use('/cmd', cmdRouter)
app.use('/common', commonRouter)
app.use('/', indexRouter)
app.use('/fallback', fallbackRouter)

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
    next(createError(404))
})

// error handler
app.use(function (err: any, req: Request, res: Response) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

export { app as default }
