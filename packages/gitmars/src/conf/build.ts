import type { GitmarsOptionType } from '../../typings'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'build',
	short: 'bd',
	args: [
		{
			required: true,
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
			defaultValue: 'dev',
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
			defaultValue: 'all',
			recommend: true,
			value: 'all'
		}
	]
}

export { cmdConfig as default }
