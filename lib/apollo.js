let apollo = require('node-apollo'),
	path = require('path'),
	fs = require('fs'),
	sh = require('shelljs')

/**
 * apolloConfig
 * @description 读取构建配置
 * @returns {Object} arr 返回配置对象
 */
module.exports = function apolloConfig({ config, pwd, gitDir, writeFile }) {
	let date = new Date().getTime(),
		apolloConfig
	if (sh.test('-f', pwd + '/gitmarsconfig.json')) {
		let fileDate = parseInt(sh.cat(gitDir + '/buildConfig.txt').stdout)
		if (date - fileDate < 24 * 60 * 60 * 1000) return require(gitDir + '/buildConfig.json')
	}
	if (!config.apolloConfig) {
		sh.echo(error('请配置apollo'))
		sh.exit(1)
		return
	}
	// 如果传入的是json字符串，转json
	try {
		apolloConfig = JSON.parse(config.apolloConfig)
	} catch (err) {
		apolloConfig = config.apolloConfig
	}
	apollo
		.remoteConfigService(apolloConfig)
		.then(result => {
			return new Promise((resolve, reject) => {
				Promise.all([writeFile(gitDir + '/buildConfig.txt', date), writeFile(gitDir + '/buildConfig.json', JSON.stringify(result.content))])
					.then(() => {
						resolve(result.content)
					})
					.catch(err => {
						reject(err)
					})
			})
		})
		.catch(err => {
			console.error(err)
		}).done
}
