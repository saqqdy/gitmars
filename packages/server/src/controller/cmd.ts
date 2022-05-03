import type { Request, Response } from 'express'
import error503 from '../helper/503'
import success from '../helper/200'
import cmd from '../service/cmd'

export async function enterDir(req: Request, res: Response) {
    const { dir } = req.query
    if (!dir) {
        error503(req, res)
        return
    }
    process.chdir(decodeURIComponent(req.query.dir as string))
    success(req, res, { data: true })
}

export async function getBranchList(req: Request, res: Response) {
    const { path, key, type, remote } = req.query
    const data = await cmd.getBranchList({ path, key, type, remote })
    success(req, res, { data })
}
export async function getCurrent(req: Request, res: Response) {
    const data = await cmd.getCurrent()
    success(req, res, { data })
}

export async function getStatus(req: Request, res: Response) {
    const data = await cmd.getStatus()
    success(req, res, { data })
}

export async function readFile(req: Request, res: Response) {
    const { path } = req.query
    const data = await cmd.readFile({ path })
    success(req, res, { data })
}

export default {
    enterDir,
    getCurrent,
    getBranchList,
    getStatus,
    readFile
}
