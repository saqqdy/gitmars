import type { Request, Response } from 'express'
const error503 = require('../helper/503')
const success = require('../helper/200')
const cmd = require('../service/cmd')

async function enterDir(req: Request, res: Response) {
    const { dir } = req.query
    if (!dir) {
        error503(req, res)
        return
    }
    process.chdir(decodeURIComponent(req.query.dir as string))
    success(req, res, { data: true })
}

async function getBranchList(req: Request, res: Response) {
    const { path, key, type, remote } = req.query
    const data = await cmd.getBranchList({ path, key, type, remote })
    success(req, res, { data })
}
async function getCurrent(req: Request, res: Response) {
    const data = await cmd.getCurrent()
    success(req, res, { data })
}

async function getStatus(req: Request, res: Response) {
    const data = await cmd.getStatus()
    success(req, res, { data })
}

async function readFile(req: Request, res: Response) {
    const { path } = req.query
    const data = await cmd.readFile({ path })
    success(req, res, { data })
}

module.exports = {
    enterDir,
    getCurrent,
    getBranchList,
    getStatus,
    readFile
}
export {}
