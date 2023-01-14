import { readFileSync } from 'fs'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import searchBranches from '@gitmars/core/lib/git/searchBranches'
import glob from 'gitmars/lib/common/global'

export function getBranchList({ path, key, type, remote }: any) {
	return new Promise((resolve, reject) => {
		let list: string[] = []
		try {
			list = searchBranches({ path, key, type, remote })
		} catch (err) {
			reject(err)
		}
		resolve(list)
	})
}

export function getCurrent() {
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

export function getStatus() {
	return new Promise(resolve => {
		resolve(glob)
	})
}

export function readFile({ path }: any) {
	return new Promise((resolve, reject) => {
		const type = (path as string).replace(/[\s\S]*\.([a-z]+)$/, '$1')
		let data
		try {
			data = readFileSync(path).toString()
		} catch (err) {
			reject(err)
		}
		if (type === 'json' && data) data = JSON.parse(data)
		resolve(data)
	})
}

export default {
	getCurrent,
	getBranchList,
	getStatus,
	readFile
}
