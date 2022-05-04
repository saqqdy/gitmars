import { readFileSync } from 'fs'
import getCurrentBranch from '@gitmars/core/es/git/getCurrentBranch'
import searchBranches from '@gitmars/core/es/git/searchBranches'
import glob from '@gitmars/core/es/global'

function getBranchList({ path, key, type, remote }) {
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

function readFile({ path }) {
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

export default {
    getCurrent,
    getBranchList,
    getStatus,
    readFile
}
