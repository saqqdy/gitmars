import lang from '../common/local'

const { t } = lang

export const hookList = [
	'applypatch-msg',
	'pre-applypatch',
	'post-applypatch',
	'pre-commit',
	'pre-merge-commit',
	'prepare-commit-msg',
	'commit-msg',
	'post-commit',
	'pre-rebase',
	'post-checkout',
	'post-merge',
	'pre-push',
	'post-update',
	'push-to-checkout',
	'pre-auto-gc',
	'post-rewrite',
	'sendemail-validate'
]
export const defaults: {
	master: string
	develop: string
	release: string
	bugfix: string
	support: string
	user: string
	email: string
	nameValidator: string
	descriptionValidator: string
	msgTemplate: string
	apolloConfig: Record<string, unknown> | null
	hooks: Record<string, unknown> | null
	apis: Record<string, unknown> | null
	api: string
	gitHost: string
	gitID: string
} = {
	master: 'master',
	develop: 'dev',
	release: 'release',
	bugfix: 'bug',
	support: 'support',
	user: '',
	email: '',
	nameValidator: '',
	descriptionValidator: '',
	msgTemplate: t('${message}; project: ${project}; path: ${pwd}'),
	apolloConfig: null,
	hooks: null,
	apis: null,
	api: '',
	gitHost: '',
	gitID: ''
}

export default { hookList, defaults }
