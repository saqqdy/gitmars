import type { GitmarsOptionType } from '../../typings/gitmars'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'start',
	short: 'st',
	args: [
		{
			required: true,
			name: 'type',
			variadic: false,
			description: t('Branch Type'),
			options: ['feature', 'bugfix', 'support'],
			value: ''
		},
		{
			required: true,
			name: 'name',
			variadic: false,
			description: t('Branch name (without feature/bugfix prefix)')
		}
	],
	options: [
		{
			flags: '-t, --tag <tag>',
			required: true,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '-t',
			long: '--tag',
			negate: false,
			description: t('Create branch from tag'),
			defaultValue: '',
			recommend: false
		}
	]
}

export { cmdConfig as default }
