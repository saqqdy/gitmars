import type { GitmarsOptionType } from '../../typings'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'save',
	short: 'sv',
	args: [
		{
			required: false,
			name: 'message',
			variadic: false,
			validator: (val, opts, cb) => {
				if (/\s+/.test(val)) {
					cb(new Error(t('Please do not enter spaces')))
					return
				}
				cb()
			},
			// transformer: null,
			description: t('AccessKeyword')
		}
	],
	options: [
		{
			flags: '-f, --force',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			short: '-f',
			long: '--force',
			negate: false,
			description: t('No version of the file is also staged, which will perform a git add .'),
			defaultValue: false
		}
	],
	// validator opts
	validatorOpts: (val, opts, cb) => {
		cb()
	},
	// validator args
	validatorArgs: (val, opts, cb) => {
		cb()
	},
	// transform opts
	transformOpts: (val, opts, cb) => {
		cb()
	},
	// transform args
	transformArgs: (val, opts, cb) => {
		cb()
	}
}

export { cmdConfig as default }
