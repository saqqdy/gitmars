#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { warning, success, config, configFrom, queue, pwd } = require('./index')
/**
 * gitm admin start
 * gitm admin end
 */
program
	.name('gitm copy')
	.usage('<from> [commitid...] [-k] [-a]')
	.arguments('<from> [commitid...]')
	.description('cherry-pick易用版本，从某个分支拷贝某条记录合并到当前分支')
	.option('-k, --key [keyword]', '模糊搜索commit信息关键词', '')
	.option('-a, --author [author]', '提交者', '')
	.action((from, commitid, opts) => {
		console.log(from, commitid, opts.key, opts.author)
		queue(['gitm branch -k \\*']).then(d => {
			let cur = d.out.replace(/^\*\s+/, '')
			if (opts.key !== '' || opts.author !== '') {
				queue(['gitm status']).then(d1 => {
					if (d1.out.indexOf('Changes to be committed') > -1 || d1.out.indexOf('Changes not staged for commit') > -1) {
						sh.echo(warning('您还有未提交的文件，请处理后再继续') + '\n如果需要暂存文件请执行: gitm save\n恢复时执行：gitm get')
						sh.exit(1)
					} else if (d1.out.indexOf('Untracked files') > -1) {
						sh.echo(warning('您还有未加入版本的文件，请处理后再继续') + '\n如果需要暂存文件请执行: gitm save --force\n恢复时执行：gitm get')
						sh.exit(1)
					} else {
						let cmd = [`git checkout ${from}`, `git pull`, `git log --grep=${opts.key} --author=${opts.author}`]
						if (!/^\d{4,}$/.test(opts.key)) {
							sh.echo(warning('为确保copy准确，关键词必须是4位以上的任务号或者bug修复编号'))
							sh.exit(1)
						}
						queue(cmd).then(data => {
							let commits = []
							if (data[2].code === 0) {
								let c = data[2].out.match(/(commit\s[a-z0-9]*\n+)/g) || []
								c.forEach(el => {
									commits.push(el.replace(/(commit\s)|\n/g, ''))
								})
								commits.length > 0 &&
									queue([`git checkout ${cur}`, { cmd: `git cherry-pick ${commits.join(' ')}`, config: { silent: false } }]).then(data => {
										// data.err && console.log(data.err)
									})
							} else {
								sh.echo(data[1].err)
							}
						})
					}
				})
			} else {
				let cmd = [`cd ${pwd}`, { cmd: `git cherry-pick ${commits.join(' ')}`, config: { silent: false } }]
				queue(cmd).then(data => {
					data[1].err && console.log(data[1].err)
				})
			}
		})
	})
program.parse(process.argv)
