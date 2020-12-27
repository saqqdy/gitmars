const sh = require('shelljs')
const inquirer = require('inquirer')
const { options: goOpts, args: goArgs } = require('../conf/go')
const { options: combineOpts, args: combineArgs } = require('../conf/combine')
const { options: buildOpts, args: buildArgs } = require('../conf/build')
const { options: endOpts, args: endArgs } = require('../conf/end')
const {
	create: { options: adminCreateOpts, args: adminCreateArgs },
	publish: { options: adminPublishOpts, args: adminPublishArgs },
	update: { options: adminUpdateOpts, args: adminUpdateArgs },
	clean: { options: adminCleanOpts, args: adminCleanArgs }
} = require('../conf/admin')

/**
 * @description 创建promot参数
 * @param {object} option 配置
 * @returns {opject} 返回prompt
 */
const createPrompt = () => {
	return {}
}

// 合并代码
exports.combine = () => {
	let prompts = [
		{
			type: 'checkbox',
			message: '请选择合并需求',
			name: 'props',
			choices: [
				new inquirer.Separator(' ====== 合并目标 ====== '),
				{
					name: '合并到dev',
					value: '-d',
					checked: true
				},
				{
					name: '合并到prod',
					value: '-p'
				},
				new inquirer.Separator(' ====== 其他参数 ====== '),
				{
					name: '构建dev环境全部应用',
					value: '-b',
					checked: true
				},
				{
					name: 'bugfix分支作为feature合并到release',
					value: '--as-feature'
				},
				{
					name: '执行git add .',
					value: '-a',
					disabled: '暂不支持'
				},
				{
					name: '执行commit',
					value: '-m',
					disabled: '暂不支持'
				},
				{
					name: '不同步到bugfix分支',
					value: '--no-bugfix',
					disabled: '暂不支持'
				}
			],
			validate(answer) {
				console.log(answer)
				// if (answer.props.includes('')) {
				// 	return 'You must choose at least one topping.'
				// }
				return true
			}
		}
	]
	inquirer.prompt(prompts).then(answers => {
		console.log(JSON.stringify(answers, null, '  '))
	})
}

// 合并代码并删除
exports.end = () => {}

// 同步上游分支代码
exports.update = () => {
	inquirer
		.prompt({
			type: 'list',
			name: 'command',
			message: '请选择同步方式?',
			default: 'merge',
			choices: ['merge', 'rebase', 'exit']
		})
		.then(answers => {
			if (answers.command === 'merge') {
				console.log('你选择了merge方式')
				//
			} else if (answers.command === 'rebase') {
				console.log('你选择了rebase方式')
				//
			} else {
				console.log('已退出')
				sh.exit(0)
			}
		})
}
