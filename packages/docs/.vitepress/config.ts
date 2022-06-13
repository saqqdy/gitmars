import { defineConfigWithTheme } from 'vitepress'
import anchor from 'markdown-it-anchor'
const isProduction = process.env.NODE_ENV === 'production'

const sidebar = {
    '/guide/': [
        {
            text: '指南',
            collapsable: false,
            items: [
                {
                    text: '介绍',
                    link: '/guide/',
                    collapsable: false
                },
                {
                    text: '快速上手',
                    link: '/guide/getting-start',
                    collapsable: false
                },
                {
                    text: '基本配置',
                    link: '/guide/basic-config',
                    collapsable: false
                }
            ]
        }
        // {
        //     text: '深入',
        //     collapsable: false,
        //     items: [
        //         {
        //             text: '钩子',
        //             link: 'hooks'
        //         }
        //     ]
        // }
    ],
    '/example/': [
        {
            text: '工作流',
            collapsable: false,
            items: [
                {
                    text: 'feature',
                    link: '/example/#feature'
                },
                {
                    text: 'bugfix',
                    link: '/example/#bugfix'
                },
                {
                    text: 'support',
                    link: '/example/#support'
                },
                {
                    text: 'publish',
                    link: '/example/#publish'
                }
            ]
        },
        {
            text: '效率',
            collapsable: false,
            items: [
                {
                    text: 'merge',
                    link: '/example/#merge'
                },
                {
                    text: 'copy',
                    link: '/example/#copy'
                },
                {
                    text: 'build',
                    link: '/example/#build'
                },
                {
                    text: 'branch',
                    link: '/example/#branch'
                }
            ]
        }
    ],
    '/api/': [
        {
            text: '智能导航',
            collapsable: false,
            items: [
                {
                    text: 'gitm go',
                    link: '/api/#gitm-go'
                }
            ]
        },
        {
            text: '配置',
            collapsable: false,
            items: [
                {
                    text: 'gitm init',
                    link: '/api/#gitm-init'
                },
                {
                    text: 'gitm config',
                    link: '/api/#gitm-config'
                }
            ]
        },
        {
            text: '工作流',
            collapsable: false,
            items: [
                {
                    text: 'gitm start',
                    link: '/api/#gitm-start'
                },
                {
                    text: 'gitm combine',
                    link: '/api/#gitm-combine'
                },
                {
                    text: 'gitm end',
                    link: '/api/#gitm-end'
                },
                {
                    text: 'gitm update',
                    link: '/api/#gitm-update'
                },
                {
                    text: 'gitm continue',
                    link: '/api/#gitm-continue'
                }
            ]
        },
        {
            text: '效率',
            collapsable: false,
            items: [
                {
                    text: 'gitm merge',
                    link: '/api/#gitm-merge'
                },
                {
                    text: 'gitm copy',
                    link: '/api/#gitm-copy'
                },
                {
                    text: 'gitm build',
                    link: '/api/#gitm-build'
                },
                {
                    text: 'gitm branch',
                    link: '/api/#gitm-branch'
                },
                {
                    text: 'gitm revert',
                    link: '/api/#gitm-revert'
                },
                {
                    text: 'gitm undo',
                    link: '/api/#gitm-undo'
                },
                {
                    text: 'gitm redo',
                    link: '/api/#gitm-redo'
                },
                {
                    text: 'gitm save',
                    link: '/api/#gitm-save'
                },
                {
                    text: 'gitm get',
                    link: '/api/#gitm-get'
                },
                {
                    text: 'gitm cleanbranch',
                    link: '/api/#gitm-cleanbranch'
                },
                {
                    text: 'gitm log',
                    link: '/api/#gitm-log'
                },
                {
                    text: 'gitm hook',
                    link: '/api/#gitm-hook'
                },
                {
                    text: 'gitm run',
                    link: '/api/#gitm-run'
                },
                {
                    text: 'gitm upgrade',
                    link: '/api/#gitm-upgrade'
                },
                {
                    text: 'gitm clean',
                    link: '/api/#gitm-clean'
                },
                {
                    text: 'gitm suggest',
                    link: '/api/#gitm-suggest'
                },
                {
                    text: 'gitm approve',
                    link: '/api/#gitm-approve'
                },
                {
                    text: 'gitm review',
                    link: '/api/#gitm-review'
                },
                {
                    text: 'gitm status',
                    link: '/api/#gitm-status'
                },
                {
                    text: 'gitm ui',
                    link: '/api/#gitm-ui'
                },
                {
                    text: 'gitm link',
                    link: '/api/#gitm-link'
                },
                {
                    text: 'gitm unlink',
                    link: '/api/#gitm-unlink'
                },
                {
                    text: 'gitm postmsg',
                    link: '/api/#gitm-postmsg'
                },
                {
                    text: 'gitm alias',
                    link: '/api/#gitm-alias'
                }
            ]
        },
        {
            text: '管理员',
            collapsable: false,
            items: [
                {
                    text: 'gitm admin create',
                    link: '/api/#gitm-admin-create'
                },
                {
                    text: 'gitm admin publish',
                    link: '/api/#gitm-admin-publish'
                },
                {
                    text: 'gitm admin update',
                    link: '/api/#gitm-admin-update'
                },
                {
                    text: 'gitm admin clean',
                    link: '/api/#gitm-admin-clean'
                }
            ]
        },
        {
            text: '其他',
            collapsable: false,
            items: [
                {
                    text: 'gitm permission',
                    link: '/api/#gitm-permission'
                },
                {
                    text: 'gitm version',
                    link: '/api/#gitm-version'
                }
            ]
        }
    ]
    // '/hook/': [
    //     {
    //         text: '开始使用',
    //         collapsable: false,
    //         children: [
    //             {
    //                 text: '安装',
    //                 link: '/hook/'
    //             },
    //             {
    //                 text: '快速上手',
    //                 link: '/hook/getting-start'
    //             },
    //             {
    //                 text: '基本配置',
    //                 link: '/hook/basic-config'
    //             },
    //             {
    //                 text: '兼容性',
    //                 link: '/hook/compatibility'
    //             }
    //         ]
    //     }
    // ]
}

module.exports = defineConfigWithTheme({
    title: 'Gitmars',
    description: '可视化UI界面',
    base: '/gitmars/',
    outDir: 'dist',
    // theme: '@vuepress/default',
    themeConfig: {
        // prefersTheme: 'dark',
        nav: [
            { text: '首页', link: '/' },
            { text: '指南', link: '/guide/' },
            { text: 'API参考', link: '/api/' },
            { text: '示例', link: '/example/' },
            // { text: 'Git Hooks', link: '/hook/' },
            { text: 'UI界面', link: '/ui/' },
            { text: 'Go', link: '/go/' },
            {
                text: '更多',
                items: [
                    {
                        text: '链接',
                        items: [
                            {
                                text: 'Github',
                                link: 'https://github.com/saqqdy',
                                target: '_blank'
                            },
                            {
                                text: 'HomePage',
                                link: 'https://github.com/saqqdy/gitmars#readme',
                                target: '_blank'
                            },
                            {
                                text: 'Bugs',
                                link: 'https://github.com/saqqdy/gitmars/issues',
                                target: '_blank'
                            },
                            {
                                text: '更新日志',
                                link: '/changelog'
                            }
                        ]
                    },
                    {
                        text: '作者',
                        items: [
                            { text: 'saqqdy', link: 'http://www.saqqdy.com' }
                        ]
                    }
                ]
            }
        ],
        sidebar,
        lastUpdated: '最近更新',
        // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
        repo: 'https://github.com/saqqdy/gitmars.git',
        // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
        // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
        repoLabel: '查看源码',
        // 以下为可选的编辑链接选项
        // 假如你的文档仓库和项目本身不在一个仓库：
        docsRepo: 'https://github.com/saqqdy/gitmars',
        // 假如文档不是放在仓库的根目录下：
        docsDir: 'docs',
        // 假如文档放在一个特定的分支下：
        docsBranch: 'dev',
        // 默认是 false, 设置为 true 来启用
        editLinks: true,
        // 默认为 "Edit this page"
        editLinkText: '帮助我们改善此页面！'
    },
    // plugins: [
    //     // 官方回到顶部插件
    //     '@vuepress/back-to-top',
    //     // 官方图片放大组件 目前是所有img都可以点击放大。具体配置见https://v1.vuepress.vuejs.org/zh/plugin/official/plugin-medium-zoom.html
    //     ['@vuepress/medium-zoom', { selector: 'img' }],
    //     // vssue 一个借助issue的评论插件 具体配置见https://vssue.js.org/zh/
    //     [
    //         '@vssue/vuepress-plugin-vssue',
    //         {
    //             // 设置 `platform` 而不是 `api` 我这里是在github平台
    //             platform: 'github',
    //             // owner与repo配置 https://github.com/${owner}/${repo}
    //             // 例如我的仓库地址为https://github.com/saqqdy/gitmars 则owner为saqqdy，repo为gitmars
    //             owner: 'saqqdy',
    //             repo: 'gitmars',
    //             // 填写自己的OAuth App 信息。详见https://vssue.js.org/zh/options/#repo
    //             clientId: 'f1b676f79b587ad9dced',
    //             clientSecret: 'd34199eee81d1bb5f4b386ef45b0816d636a1e66',
    //             locale: 'zh', // 使用的语言  这里是简体中文
    //             baseURL: 'https://github.com' // 平台的 base URL
    //         }
    //     ]
    // ],
    markdown: {
        lineNumbers: false,
        // anchor: {
        //     permalink: anchor.permalink.headerLink()
        // },
        toc: { level: [2, 3] },
        config: md => {
            //   md.use(require('markdown-it-xxx'))
        }
    }
    // configureWebpack: {
    //     resolve: {
    //         alias: {
    //             '@assets': require('path').join(__dirname, '../assets')
    //         }
    //     }
    // }
})
