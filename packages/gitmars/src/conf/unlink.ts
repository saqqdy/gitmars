import type { GitmarsOptionType } from '../../typings'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'unlink',
	short: null,
	args: [
		{
			required: false,
			name: 'name',
			variadic: false,
			validator: (val, opts, cb) => {
				if (/\s+/.test(val)) {
					cb(new Error(t('Please do not enter spaces')))
					return
				}
				cb()
			},
			// transformer: null,
			description: t('Name of the package')
		}
	],
	options: []
}

export { cmdConfig as default }
