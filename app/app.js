"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createError_1 = __importDefault(require("createError"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookieParser_1 = __importDefault(require("cookieParser"));
const logger_1 = __importDefault(require("logger"));
var indexRouter = require('./routes/index'), cmdRouter = require('./routes/cmd'), commonRouter = require('./routes/common'), app = (0, express_1.default)();
// view engine setup
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use((0, logger_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookieParser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, './www')));
app.use('/', indexRouter);
app.use('/cmd', cmdRouter);
app.use('/common', commonRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, createError_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
