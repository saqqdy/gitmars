import type { GitmarsOptionType } from '../../typings/gitmars'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
	command: 'go',
	short: '',
	args: [
		{
			required: false,
			name: 'command',
			variadic: false,
			description: t('Command Name'),
			options: [
				'combine',
				'end',
				'update',
				'build',
				'start',
				'undo',
				'redo',
				'admin.publish',
				'admin.update',
				'admin.create',
				'admin.clean',
				'branch',
				'copy',
				'get',
				'save',
				'cleanbranch',
				'clean',
				'revert',
				'link',
				'unlink',
				'postmsg'
			],
			value: ''
		}
	],
	options: []
}

export { cmdConfig as default }
