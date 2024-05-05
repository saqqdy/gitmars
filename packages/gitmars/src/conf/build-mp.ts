import type { GitmarsOptionType } from '../types'
// import lang from '../common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'build-mp',
	short: 'bdm',
	args: [
		{
			required: false,
			name: 'project',
			variadic: false,
			description: t('Project name')
		}
	],
	options: [
		{
			flags: '-e, --env [env]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '-e',
			long: '--env',
			negate: false,
			description: t('Build environment, optionally dev, prod, bug, all'),
			defaultValue: '',
			recommend: true,
			options: ['dev', 'prod', 'bug'],
			value: 'dev'
		},
		{
			flags: '--api-env [apiEnv]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '',
			long: '--api-env',
			negate: false,
			description: t('Build api environment, optionally alpha, tag, release, production'),
			defaultValue: '',
			recommend: true,
			options: ['alpha', 'tag', 'release', 'production'],
			value: 'production'
		},
		{
			flags: '-mp, --miniprogram [miniprogram]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '-mp',
			long: '--miniprogram',
			negate: false,
			description: t('Generate experiential version of miniprogram'),
			defaultValue: '',
			recommend: true,
			value: ''
		},
		{
			flags: '-des, --description [description]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '-des',
			long: '--description',
			negate: false,
			description: t('Enter the version description'),
			defaultValue: '',
			recommend: true,
			value: ''
		},
		{
			flags: '-a, --app [app]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '-a',
			long: '--app',
			negate: false,
			description: t('Build application'),
			defaultValue: '',
			recommend: true,
			options: ['weapp', 'alipay', 'tt', 'dd', 'swan'],
			value: 'weapp'
		},
		{
			flags: '-d, --data <data>',
			required: true,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '-d',
			long: '--data',
			negate: false,
			description: t('Other data to be transferred'),
			defaultValue: '{}',
			recommend: true,
			value: '{}'
		},
		{
			flags: '-c, --confirm',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			short: '-c',
			long: '--confirm',
			negate: false,
			description: t('Confirm start, do not show confirmation box when true'),
			defaultValue: false
		}
	]
}

export { cmdConfig as default }
