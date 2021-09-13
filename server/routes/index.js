"use strict";
// var express = require('express'),
// 	router = express.Router()
// /* GET home page. */
// router.get('/', function (req, res, next) {
// 	res.render('index', { title: 'Express' })
// })
// module.exports = router
const express = require('express');
var router = express.Router();
const { exec } = require('child_process');
const { promisify } = require('util');
const promiseExec = promisify(exec);
router.get('/cwd', function (req, res) {
    const { pid } = req.query;
    promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then(newCwd => {
        // console.log(newCwd, newCwd.stdout)
        const cwd = typeof newCwd === 'string' ? newCwd.trim() : newCwd.stdout.trim();
        res.success(cwd);
    });
});
// 接收git钩子发来的状态变化
router.get('/update', function (req, res) {
    const { project } = req.query;
    promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then(newCwd => {
        // console.log(newCwd, newCwd.stdout)
        const cwd = typeof newCwd === 'string' ? newCwd.trim() : newCwd.stdout.trim();
        res.success(cwd);
    });
});
module.exports = router;
