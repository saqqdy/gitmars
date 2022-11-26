// import { sep } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import type { Request, Response } from 'express'
// import error503 from '#lib/helper/503'
import success from '#lib/helper/200'

const promiseExec = promisify(exec)

export async function getCwd(req: Request, res: Response) {
    const { pid } = req.query
    promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then((newCwd: any) => {
        const data = typeof newCwd === 'string' ? newCwd.trim() : newCwd.stdout.trim()
        success(req, res, { data })
    })
}
export async function getUpdate(req: Request, res: Response) {
    const { pid } = req.query
    promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then((newCwd: any) => {
        const data = typeof newCwd === 'string' ? newCwd.trim() : newCwd.stdout.trim()
        success(req, res, { data })
    })
}

export default {
    getCwd,
    getUpdate
}
