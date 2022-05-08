const { readFileSync } = require('fs')
const getCurrentBranch = require('@gitmars/core/lib/git/getCurrentBranch')
const searchBranches = require('@gitmars/core/lib/git/searchBranches')
const glob = require('@gitmars/core/lib/global')

function getBranchList({ path, key, type, remote }: any) {
    return new Promise((resolve, reject) => {
        let list = []
        try {
            list = searchBranches({ path, key, type, remote })
        } catch (err) {
            reject(err)
        }
        resolve(list)
    })
}

function getCurrent() {
    return new Promise((resolve, reject) => {
        let branch
        try {
            branch = getCurrentBranch()
        } catch (err) {
            reject(err)
        }
        resolve(branch)
    })
}

function getStatus() {
    return new Promise(resolve => {
        resolve(glob)
    })
}

function readFile({ path }: any) {
    return new Promise((resolve, reject) => {
        const type = (path as string).replace(/[\s\S]*\.([a-z]+)$/, '$1')
        let data
        try {
            data = readFileSync(path).toString()
        } catch (err) {
            reject(err)
        }
        if (type === 'json') data = JSON.parse(data)
        resolve(data)
    })
}

module.exports = {
    getCurrent,
    getBranchList,
    getStatus,
    readFile
}
export {}
