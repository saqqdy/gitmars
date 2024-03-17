import type { GitmarsOptionType } from '../../typings/gitmars'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'run',
	short: '',
	args: [
		{
			required: false,
			name: 'command',
			variadic: false
		},
		{
			required: false,
			name: 'args',
			variadic: true,
			description: t('Parameter list')
		}
	],
	options: []
}

export { cmdConfig as default }
