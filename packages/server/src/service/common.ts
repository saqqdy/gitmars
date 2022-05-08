// const { execSync } = require('child_process')
const sh = require('shelljs')
const { v4: uuidv4 } = require('uuid')
const db = require('../db')

function addProject({ name, path }: any) {
    return new Promise((resolve, reject) => {
        const id = uuidv4()
        try {
            db.get('projects').push({ id, name, path }).write()
        } catch (err) {
            reject(err)
        }
        resolve(true)
    })
}

function checkProject({ path }: any) {
    return new Promise((resolve, reject) => {
        let code = sh.test('-e', `${path}/.git`) ? 0 : 1
        try {
            if (code === 0 && db.get('projects').find({ path }).value()) {
                code = 2
            }
        } catch (err) {
            reject(err)
        }
        resolve(code)
    })
}

function delProject({ id }: any) {
    return new Promise((resolve, reject) => {
        try {
            db.get('projects').remove({ id }).write()
        } catch (err) {
            reject(err)
        }
        resolve(true)
    })
}

function getProjectList({ id }: any) {
    return new Promise((resolve, reject) => {
        let list = []
        try {
            if (id) {
                list = db.get('projects').find({ id }).value()
            } else {
                list = db.get('projects').value() || []
            }
        } catch (err) {
            reject(err)
        }
        resolve(list)
    })
}

function updateProject({ id, name, path }: any) {
    return new Promise((resolve, reject) => {
        try {
            db.get('projects').find({ id }).assign({ name, path }).write()
        } catch (err) {
            reject(err)
        }
        resolve(true)
    })
}

module.exports = {
    addProject,
    checkProject,
    delProject,
    getProjectList,
    updateProject
}
export {}
