import type { GitmarsOptionType } from '../../typings'
const i18n = require('../locales')
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'cleanbranch',
        short: 'clb',
        args: [
            {
                required: false,
                name: 'branches',
                variadic: true,
                validator: (val, opts, cb) => {
                    cb()
                },
                description: '指定要清理的分支'
            }
        ],
        options: [
            {
                flags: '-l, --list',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                short: '-l',
                long: '--list',
                negate: false,
                description: '显示符合条件的分支列表',
                defaultValue: false,
                value: true
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
                description:
                    '分支的类型，共有3种：feature、bugfix、support，不传则默认全部',
                defaultValue: null,
                options: ['feature', 'bugfix', 'support'],
                value: ''
            },
            {
                flags: '--target [target]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '',
                long: '--target',
                negate: false,
                description:
                    '需要检测是否合过的目标分支名，不传默认是develop和release',
                defaultValue: null,
                value: 'dev,release'
            },
            {
                flags: '-k, --key [keyword]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-k',
                long: '--key',
                negate: false,
                description: '查询分支的关键词',
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
                description: '排除关键词',
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
                description: '包含关键词',
                defaultValue: '',
                value: ''
            },
            // {
            //     flags: '--deadline [deadline]',
            //     required: false,
            //     optional: false,
            //     variadic: false,
            //     mandatory: false,
            //     short: '',
            //     long: '--deadline',
            //     negate: false,
            //     description:
            //         '删除固定时长之前的分支，填写格式：10s/2m/2h/3d/4M/5y',
            //     defaultValue: '15d'
            // },
            {
                flags: '-r, --remote',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                short: '-r',
                long: '--remote',
                negate: false,
                description: '是否清理远程分支，默认清理本地分支',
                defaultValue: false
            },
            {
                flags: '-c, --confirm',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                short: '-c',
                long: '--confirm',
                negate: false,
                description: '确认开始，为true时不显示确认框',
                defaultValue: false
            }
        ],
        // 校验传值
        validatorOpts: (val, opts, cb) => {
            cb()
        },
        // 校验参数
        validatorArgs: (val, opts, cb) => {
            cb()
        },
        // 清洗传值
        transformOpts: (val, opts, cb) => {
            cb()
        },
        // 清洗参数
        transformArgs: (val, opts, cb) => {
            cb()
        }
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = cmdConfig
    } else if (typeof exports === 'object') exports.cmdConfig = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig.cleanbranch = cmdConfig
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)
