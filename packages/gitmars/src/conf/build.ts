import type { GitmarsOptionType } from '../types'
// import lang from '../common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'build',
	short: 'bd',
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
			options: ['dev', 'prod', 'bug', 'all'],
			value: 'dev'
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
			value: 'all'
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
