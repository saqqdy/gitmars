import type { GitmarsOptionType } from '../../typings/gitmars'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'update',
	short: 'up',
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
			flags: '--use-merge',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			long: '--use-merge',
			negate: false,
			description: t('Use merge to update (default merge)'),
			defaultValue: true,
			value: true,
			recommend: true
		},
		{
			flags: '--use-rebase',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			long: '--use-rebase',
			negate: false,
			description: t('Update with rebase (default merge)'),
			defaultValue: false,
			recommend: true
		},
		{
			flags: '-a --all',
			required: false,
			optional: false,
			variadic: false,
			mandatory: false,
			short: '-a',
			long: '--all',
			negate: false,
			description: t('Update all local bugfix, feature, support branches'),
			defaultValue: false,
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
		}
	]
}

export { cmdConfig as default }
