import type { GitmarsOptionType } from '../../typings/gitmars'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'continue',
	short: 'ct',
	args: [],
	options: [
		{
			flags: '-l, --list',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			short: '-l',
			long: '--list',
			negate: false,
			description: t('Show command queue'),
			defaultValue: false
		}
	]
}

export { cmdConfig as default }
