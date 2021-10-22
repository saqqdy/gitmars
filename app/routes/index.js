"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { exec } = require('child_process');
const { promisify } = require('util');
const promiseExec = promisify(exec);
router.get('/cwd', function (req, res) {
    const { pid } = req.query;
    promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then((newCwd) => {
        const cwd = typeof newCwd === 'string' ? newCwd.trim() : newCwd.stdout.trim();
        res.status(200).json({ data: cwd });
    });
});
// 接收git钩子发来的状态变化
router.get('/update', function (req, res) {
    const { pid } = req.query;
    promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then((newCwd) => {
        const cwd = typeof newCwd === 'string' ? newCwd.trim() : newCwd.stdout.trim();
        res.status(200).json({ data: cwd });
    });
});
module.exports = router;
