import type { GitmarsOptionType } from '../../typings/gitmars'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'branch',
	short: 'bh',
	args: [],
	options: [
		{
			flags: '-k, --key [keyword]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '-k',
			long: '--key',
			negate: false,
			description: t('Query branch for keywords'),
			defaultValue: null
		},
		{
			flags: '--exclude [exclude]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '',
			long: '--exclude',
			negate: false,
			description: t('Exclude keywords'),
			defaultValue: '',
			value: ''
		},
		{
			flags: '--include [include]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '',
			long: '--include',
			negate: false,
			description: t('Include keywords'),
			defaultValue: '',
			value: ''
		},
		{
			flags: '-r, --remote',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			short: '-r',
			long: '--remote',
			negate: false,
			description: t(
				'Whether to query remote branches (change to delete remote branches in deletes mode) Default is local only'
			),
			defaultValue: false
		},
		{
			flags: '-t, --type [type]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '-t',
			long: '--type',
			negate: false,
			description: t(
				'The type of branch to query, there are 3 types: feature, bugfix, support, if not pass then query all'
			),
			defaultValue: null,
			options: ['feature', 'bugfix', 'support'],
			value: ''
		},
		{
			flags: '-d, --delete [branch]',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			short: '-d',
			long: '--delete',
			negate: false,
			description: t('Delete branch'),
			defaultValue: null
		},
		{
			flags: '-D, --forcedelete [branch]',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			short: '-D',
			long: '--forcedelete',
			negate: false,
			description: t('Force branch deletion'),
			defaultValue: null
		},
		{
			flags: '-u, --upstream [upstream]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '-u',
			long: '--upstream',
			negate: false,
			description: t('Set association with remote branches')
		}
	],
	// validator opts
	validatorOpts: (val, opts, cb) => {
		if (
			val.includes('--upstream') &&
			(val.includes('--key') ||
				val.includes('--remote') ||
				val.includes('--type') ||
				val.includes('--delete') ||
				val.includes('--forcedelete'))
		) {
			cb(
				new Error(
					t(
						'When using the bind/unbind remote branch function, it cannot be mixed with other functions.'
					)
				)
			)
			return
		}
		if (
			(val.includes('--delete') || val.includes('--forcedelete')) &&
			(val.includes('--key') || val.includes('--type'))
		) {
			cb(
				new Error(
					t(
						'When using the delete branch function, it cannot be mixed with the query branch function.'
					)
				)
			)
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
