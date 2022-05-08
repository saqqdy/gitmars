import type { Request, Response } from 'express'
const { sep } = require('path')
const { execSync } = require('child_process')
const error503 = require('../helper/503')
const success = require('../helper/200')
const common = require('../service/common')

async function addProject(req: Request, res: Response) {
    // const cwd = process.cwd()
    let { path: dir = null } = req.body
    if (!dir) {
        error503(req, res)
        return
    }
    dir = dir.split(sep).join('/')
    // process.chdir(dir)
    const url = execSync('git config --local --get remote.origin.url', {
        cwd: dir,
        stdio: 'inherit'
    }).stdout.replace(/\s+$/g, '')
    const name = url
        ? url.replace(/^[\s\S]+\/([\w-]+)\.git$/, '$1')
        : dir.replace(/^[\s\S]+\/([\w-]+)$/, '$1')
    // process.chdir(cwd)
    const data = await common.addProject({ name, path: dir })
    success(req, res, { data })
}

async function checkProject(req: Request, res: Response) {
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

async function delProject(req: Request, res: Response) {
    const { id } = req.body
    if (!id) {
        error503(req, res)
        return
    }
    const data = await common.delProject({ id })
    success(req, res, { data })
}

async function getProjectList(req: Request, res: Response) {
    const { id } = req.query
    let data = await common.getProjectList({ id })
    if (id) data = data?.[0] || null
    success(req, res, { data })
}

async function updateProject(req: Request, res: Response) {
    const { id, name, path } = req.body
    if (!id) {
        error503(req, res)
        return
    }
    const data = await common.updateProject({ id, name, path })
    success(req, res, { data })
}

module.exports = {
    addProject,
    checkProject,
    delProject,
    getProjectList,
    updateProject
}
export {}
