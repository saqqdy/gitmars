import type { Request, Response } from 'express'
const { sep } = require('path')
const { exec, execSync } = require('child_process')
const { promisify } = require('util')
// const error503 = require('../helper/503')
const success = require('../helper/200')

const promiseExec = promisify(exec)

async function getCwd(req: Request, res: Response) {
    const { pid } = req.query
    promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then(
        (newCwd: any) => {
            const data =
                typeof newCwd === 'string'
                    ? newCwd.trim()
                    : newCwd.stdout.trim()
            success(req, res, { data })
        }
    )
}
async function getUpdate(req: Request, res: Response) {
    const { pid } = req.query
    promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then(
        (newCwd: any) => {
            const data =
                typeof newCwd === 'string'
                    ? newCwd.trim()
                    : newCwd.stdout.trim()
            success(req, res, { data })
        }
    )
}

module.exports = {
    getCwd,
    getUpdate
}
export {}
