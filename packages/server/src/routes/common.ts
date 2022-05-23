import type { NextFunction, Request, Response } from 'express'
const express = require('express')
const {
    addProject,
    checkProject,
    delProject,
    getProjectList,
    updateProject
} = require('../controller/common')

const router = express.Router()

// 开启跨域访问
router.all('*', (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Content-Length, Authorization, Accept, Cache-Control'
    )
    res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, GET, DELETE, OPTIONS'
    )
    res.header('Access-Control-Allow-Credentials', 'true')
    next()
})

// 获取项目列表
router.get('/project/list', getProjectList)
// 添加项目
router.get('/project/add', addProject)
// 删除项目
router.get('/project/del', delProject)
// 更新项目
router.get('/project/update', updateProject)
// 检测项目
router.get('/project/check', checkProject)

module.exports = router
export {}
