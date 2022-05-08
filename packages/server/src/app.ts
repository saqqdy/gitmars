import type { NextFunction, Request, Response } from 'express'
const { join } = require('path')
const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
// const logger = require('logger')
const indexRouter = require('./routes/index')
const cmdRouter = require('./routes/cmd')
const commonRouter = require('./routes/common')
const fallbackRouter = require('./routes/fallback')

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

module.exports = app
