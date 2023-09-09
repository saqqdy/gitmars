import type { GitmarsOptionType } from '../../typings'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'combine',
	short: 'cb',
	args: [
		{
			required: false,
			name: 'type',
			variadic: false,
			description: t('Branch Type'),
			options: ['feature', 'bugfix', 'support'],
			value: ''
		},
		{
			required: false,
			name: 'name',
			variadic: false,
			description: t('Branch name (without feature/bugfix prefix)')
		}
	],
	options: [
		{
			flags: '-d, --dev',
			required: false, // required<>
			optional: false, // not required[]
			variadic: false, // has...
			mandatory: false,
			short: '-d',
			long: '--dev',
			negate: false,
			description: t('Sync to dev environment'),
			defaultValue: false,
			value: true,
			recommend: true // Custom value: whether to check by default
		},
		{
			flags: '-p, --prod',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			short: '-p',
			long: '--prod',
			negate: false,
			description: t('Sync to prod environment'),
			defaultValue: false,
			value: false,
			recommend: false
		},
		{
			flags: '-b, --build [build]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '-b',
			long: '--build',
			negate: false,
			description: t('Build application'),
			value: 'all',
			recommend: true
		},
		{
			flags: '-m, --commit <commit>',
			required: true,
			optional: true,
			variadic: false,
			mandatory: false,
			short: '-m',
			long: '--commit',
			negate: false,
			description: t('Execute commit, information required'),
			defaultValue: '',
			recommend: false
		},
		{
			flags: '--description [description]',
			required: false,
			optional: true,
			variadic: false,
			mandatory: false,
			long: '--description',
			negate: false,
			description: t('Description of the reason for this commit'),
			defaultValue: '',
			recommend: false
		},
		{
			flags: '-a, --add',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			short: '-a',
			long: '--add',
			negate: false,
			description: t('Execute add'),
			defaultValue: false,
			recommend: false
		},
		{
			flags: '--no-bugfix',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			long: '--no-bugfix',
			negate: true,
			description: t('bug branch merge to release without merging to bug branch'),
			defaultValue: true,
			recommend: false
		},
		{
			flags: '--as-feature',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			long: '--as-feature',
			negate: false,
			description: t('bug branch merge to release'),
			recommend: false
		},
		{
			flags: '-f, --force',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			short: '-f',
			long: '--force',
			negate: false,
			description: t('Whether to force a merge request'),
			recommend: false
		},
		{
			flags: '--data <data>',
			required: true,
			optional: true,
			variadic: false,
			mandatory: false,
			long: '--data',
			negate: false,
			description: t('Other data to be transferred'),
			defaultValue: '{}',
			recommend: true,
			value: '{}'
		}
	],
	// validator opts
	validatorOpts: (val, opts, cb) => {
		if (!val.includes('--dev') && !val.includes('--prod')) {
			cb(new Error(t('Merge dev or prod must choose at least one')))
			return
		}
		if (
			(val.includes('--add') && !val.includes('--commit')) ||
			(!val.includes('--add') && val.includes('--commit'))
		) {
			cb(new Error(t('add and commit need to be selected at the same time')))
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
