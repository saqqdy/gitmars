const plugins = require('./config/plugins')
const themeConfig = require('./config/themeConfig')

module.exports = {
    title: 'Gitmars',
    description: '移动端UI组件库',
    base: '/gitmars/',
    dest: './docs/.vuepress/dist',
    theme: '@vuepress/default',
    // theme: 'antdocs',
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: '指南', link: '/guide/' },
            {
                text: '工作流',
                items: [
                    {
                        text: 'Gitmars Flow',
                        items: [
                            {
                                text: 'feature',
                                link: '/workflow/feature/'
                            },
                            {
                                text: 'bugfix',
                                link: '/workflow/bugfix/'
                            },
                            {
                                text: 'support',
                                link: '/workflow/support/'
                            },
                            {
                                text: 'publish',
                                link: '/workflow/publish/'
                            },
                            {
                                text: '构建项目',
                                link: '/workflow/build/'
                            }
                        ]
                    },
                    {
                        text: '作者',
                        items: [{ text: 'saqqdy', link: 'http://www.saqqdy.com' }]
                    }
                ]
            },
            { text: 'API参考', link: '/api/' },
            { text: '界面', link: '/ui/' },
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
                            }
                        ]
                    },
                    {
                        text: '作者',
                        items: [{ text: 'saqqdy', link: 'http://www.saqqdy.com' }]
                    }
                ]
            }
        ],
        sidebar: {
            '/workflow/': [
                {
                    title: 'API',
                    path: '/workflow/',
                    collapsable: false,
                    sidebarDepth: 2,
                    sidebar: 'auto'
                }
            ],
            '/guide/': [
                {
                    title: '指南',
                    collapsable: false,
                    sidebarDepth: 1,
                    children: [
                        {
                            title: '介绍',
                            path: '/guide/',
                            collapsable: false
                        },
                        {
                            title: '快速上手',
                            path: 'getting-start',
                            collapsable: false
                        },
                        {
                            title: '基本配置',
                            path: 'basic-config',
                            collapsable: false
                        },
                        {
                            title: '兼容性',
                            path: 'compatibility',
                            collapsable: false
                        }
                    ]
                },
                {
                    title: '深入',
                    collapsable: false,
                    sidebarDepth: 1,
                    children: [
                        {
                            title: '钩子',
                            path: 'hooks',
                            collapsable: false
                        }
                    ]
                }
            ],
            '/setting/': [
                {
                    title: 'Group 1',
                    path: '/workflow/',
                    collapsable: false,
                    sidebarDepth: 1,
                    children: ['/']
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
        docsRepo: 'https://github.com/saqqdy/gitmars.git',
        // 假如文档不是放在仓库的根目录下：
        docsDir: 'docs',
        // 假如文档放在一个特定的分支下：
        docsBranch: 'master',
        // 默认是 false, 设置为 true 来启用
        editLinks: true,
        // 默认为 "Edit this page"
        editLinkText: '帮助我们改善此页面！'
    },

    plugins,
    markdown: {
        lineNumbers: true,
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
}
