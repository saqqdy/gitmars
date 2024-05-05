import type { GitmarsOptionType } from '../types'
// import lang from '../common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'undo',
	short: 'ud',
	args: [
		{
			required: false,
			name: 'commitid',
			variadic: true,
			validator: (val, opts, cb) => {
				cb()
			},
			// transformer: null,
			description: t('ID of the undo needed')
		}
	],
	options: [
		{
			flags: '--lastet [lastet]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '',
			long: '--lastet',
			negate: false,
			description: t(
				'Query logs after a certain time, fill in the format: 10s/2m/2h/3d/4M/5y'
			),
			defaultValue: ''
		},
		{
			flags: '--no-merges',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			long: '--no-merges',
			negate: true,
			description: t('Whether to exclude merge records'),
			defaultValue: true,
			recommend: false
		},
		{
			flags: '-m, --mode [mode]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '-m',
			long: '--mode',
			negate: false,
			description: t(
				'For undoing a merge record, the type to be passed in: 1 = keep current branch code, 2 = keep incoming code'
			),
			defaultValue: null,
			options: [1, 2],
			value: null
		},
		{
			flags: '--limit [limit]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '',
			long: '--limit',
			negate: false,
			description: t('The maximum number of logs to be queried'),
			defaultValue: ''
		},
		{
			flags: '--calc',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			long: '--calc',
			negate: false,
			description: t('Clean up the current branch undo failure log'),
			recommend: false
		},
		{
			flags: '--calcAll',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			long: '--calcAll',
			negate: false,
			description: t('Clean up all branch undo failures'),
			recommend: false
		}
	],
	// validator opts
	validatorOpts: (val, opts, cb) => {
		if ((val.includes('--calc') || val.includes('--calcAll')) && val.length > 1) {
			cb(new Error(t('--calc and --calcAll can only be used individually')))
			return
		}
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
