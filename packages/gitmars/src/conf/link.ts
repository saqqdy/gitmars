import type { GitmarsOptionType } from '../types'
// import lang from '../common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'link',
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
		// {
		//     required: true,
		//     name: 'path',
		//     variadic: false,
		//     validator: (val, opts, cb) => {
		//         if (/\s+/.test(val)) {
		//             cb(new Error(t('Please do not enter spaces')))
		//             return
		//         }
		//         cb()
		//     },
		//     transformer: null,
		//     description: t('Path of package')
		// }
	],
	options: []
}

export { cmdConfig as default }
