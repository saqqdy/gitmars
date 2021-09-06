let // system = sh.exec('uname -s', { silent: true }).stdout || 'MINGW64_NT',
    hookList = [
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
const defaults = {
    master: 'master',
    develop: 'dev',
    release: 'release',
    bugfix: 'bug',
    support: 'support',
    user: '',
    email: '',
    msgTemplate: '${message}；项目：${project}；路径：${pwd}',
    msgUrl: '',
    apolloConfig: '',
    hooks: '',
    api: '',
    gitHost: '',
    gitID: ''
}

export default { hookList, defaults }
