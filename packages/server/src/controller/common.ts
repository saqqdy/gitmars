import { sep } from 'path'
import { execSync } from 'child_process'
import type { Request, Response } from 'express'
import error503 from '#lib/helper/503'
import success from '#lib/helper/200'
import common from '#lib/service/common'

export async function addProject(req: Request, res: Response) {
    // const cwd = process.cwd()
    let { path: dir = null } = req.body,
        url
    if (!dir) {
        error503(req, res)
        return
    }
    dir = dir.split(sep).join('/')
    // process.chdir(dir)
    try {
        url = execSync('git config --local --get remote.origin.url', {
            cwd: dir,
            stdio: 'pipe'
        })
    } catch (e) {
        console.info(e)
    }
    // Buffer to string
    if (typeof url !== 'string') url = url.toString()
    url = url.replace(/\s+$/g, '')

    const name = url
        ? url.replace(/^[\s\S]+\/([\w-]+)\.git$/, '$1')
        : dir.replace(/^[\s\S]+\/([\w-]+)$/, '$1')
    // process.chdir(cwd)
    const data = await common.addProject({ name, path: dir })
    success(req, res, { data })
}

export async function checkProject(req: Request, res: Response) {
    const { path } = req.query
    if (!path) {
        error503(req, res)
        return
    }
    const code = await common.checkProject({ path })
    let msg
    switch (code) {
        case 0:
            msg = '路径合法'
            break
        case 1:
            msg = '路径不是正确对的git项目路径'
            break
        case 2:
            msg = '项目路径已存在'
            break
        default:
            break
    }
    success(req, res, {
        data: {
            code,
            message: msg
        }
    })
}

export async function delProject(req: Request, res: Response) {
    const { id } = req.body
    if (!id) {
        error503(req, res)
        return
    }
    const data = await common.delProject({ id })
    success(req, res, { data })
}

export async function getProjectList(req: Request, res: Response) {
    const { id } = req.query
    const data = await common.getProjectList({ id })
    success(req, res, { data })
}

export async function updateProject(req: Request, res: Response) {
    const { id, name, path } = req.body
    if (!id) {
        error503(req, res)
        return
    }
    const data = await common.updateProject({ id, name, path })
    success(req, res, { data })
}

export default {
    addProject,
    checkProject,
    delProject,
    getProjectList,
    updateProject
}
