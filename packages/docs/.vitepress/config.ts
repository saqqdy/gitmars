import { defineConfigWithTheme } from 'vitepress'
const isProduction = process.env.NODE_ENV === 'production'


module.exports = defineConfigWithTheme({
    title: 'Gitmars',
    description: '移动端UI组件库',
    base: '/gitmars/',
    // dest: 'dist',
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
                                link: '/changelog/'
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
        sidebar: {
            '/guide/': [
                {
                    text: '指南',
                    collapsable: false,
                    // sidebarDepth: 1,
                    children: [
                        {
                            text: '介绍',
                            link: '/guide/',
                            collapsable: false
                        },
                        {
                            text: '快速上手',
                            link: 'getting-start',
                            collapsable: false
                        },
                        {
                            text: '基本配置',
                            link: 'basic-config',
                            collapsable: false
                        }
                        // {
                        //     text: '兼容性',
                        //     link: 'compatibility',
                        //     collapsable: false
                        // }
                    ]
                }
                // {
                //     text: '深入',
                //     collapsable: false,
                //     sidebarDepth: 1,
                //     children: [
                //         {
                //             text: '钩子',
                //             link: 'hooks',
                //             collapsable: false
                //         }
                //     ]
                // }
            ],
            '/hook/': [
                {
                    text: '开始使用',
                    collapsable: false,
                    // sidebarDepth: 1,
                    children: [
                        {
                            text: '安装',
                            link: '/hook/',
                            collapsable: false
                        },
                        {
                            text: '快速上手',
                            link: 'getting-start',
                            collapsable: false
                        },
                        {
                            text: '基本配置',
                            link: 'basic-config',
                            collapsable: false
                        },
                        {
                            text: '兼容性',
                            link: 'compatibility',
                            collapsable: false
                        }
                    ]
                },
                {
                    text: '其他',
                    collapsable: false,
                    // sidebarDepth: 1,
                    children: [
                        {
                            text: '特性',
                            link: 'features',
                            collapsable: false
                        }
                    ]
                }
            ]
        },
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
        toc: { includeLevel: [2, 3] }
    },
    sidebarDepth: 1,
    configureWebpack: {
        resolve: {
            alias: {
                '@assets': require('path').join(__dirname, '../assets')
            }
        }
    }
})
