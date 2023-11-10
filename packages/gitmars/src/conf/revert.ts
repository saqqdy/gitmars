import type { GitmarsOptionType } from '../../typings/gitmars'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'revert',
	short: 'rt',
	args: [
		{
			required: false,
			name: 'commitid',
			variadic: false,
			validator: (val, opts, cb) => {
				cb()
			},
			// transformer: null,
			description: t('ID of the undo needed')
		}
	],
	options: [
		{
			flags: '-n, --number [number]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '-n',
			long: '--number',
			negate: false,
			description: t('Undo the last commit (or undo the penultimate nth commit)'),
			defaultValue: ''
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
			defaultValue: '',
			options: ['1', '2'],
			value: '1'
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
