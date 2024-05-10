import type { GitmarsOptionType } from '../types'
// import lang from '../common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'miniprogram',
	short: 'mp',
	args: [
		{
			required: false,
			name: 'miniprogram',
			variadic: false,
			description: t('Name of miniprogram')
		}
	],
	options: [
		{
			flags: '-k, --keyword [keyword]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '-k',
			long: '--keyword',
			negate: false,
			description: t('Name of miniprogram, used for fuzzy searches'),
			defaultValue: '',
			recommend: true,
			value: ''
		}
	]
}

export { cmdConfig as default }
