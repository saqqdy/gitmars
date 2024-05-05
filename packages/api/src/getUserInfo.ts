import sh from 'shelljs'
import chalk from 'chalk'
import request from '@jssj/request'
import { getConfig, getGitUser } from '@gitmars/git'
import { debug } from '@gitmars/utils'
import type { FetchDataType } from './types'
import lang from './lang'

const { t } = lang

// get userInfo form api
async function getUserInfo(): Promise<FetchDataType> {
	const config = getConfig()
	const userInfoApi = config.apis?.userInfo?.url || config.api
	if (!userInfoApi) {
		sh.echo(
			chalk.red(
				t(
					'Please configure the address of the api interface used to request permissions, receive parameters in the form: url?name=git_user_name, return data.level'
				)
			)
		)
		process.exit(1)
	}

	const user = getGitUser()
	if (!user) {
		sh.echo(chalk.red(t('Please set the local git user name')))
		process.exit(1)
	}

	const fetchData =
		((await request.get({ url: `${userInfoApi}?name=${user}` })).data as FetchDataType) || null
	debug('getUserInfo-user', user, userInfoApi)
	debug('getUserInfo-fetchData', fetchData)

	if (!fetchData) {
		sh.echo(chalk.red(t('No user found, please contact admin')))
		process.exit(1)
	}
	return fetchData
}

export default getUserInfo
