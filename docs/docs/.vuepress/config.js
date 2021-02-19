const settings = require('./settings.json')

module.exports = {
    title: 'gitmars',
    description: '移动端UI组件库',
    base: '/gitmars/',
    dest: './docs/.vuepress/dist',
    // theme: '@vuepress/default',
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: '指南', link: '/guide/' },
            { text: '组件', link: '/components/' },
            { text: '配置', link: '/setting/' },
            { text: '更多', link: '/more/' },
            { text: 'External', link: 'https://google.com', target: '_self', rel: '' },
            {
                text: 'Languages',
                items: [
                    {
                        text: 'Group1',
                        items: [{ text: 'Chinese', link: '/language/chinese1/' }]
                    },
                    {
                        text: 'Group2',
                        items: [{ text: 'Chinese', link: '/language/chinese2/' }]
                    }
                ]
            }
        ],
        sidebar: {
            '/components/': [
                // '',
                // 'cell',
                // '/cell',
                {
                    title: '组件',
                    path: '/components/',
                    collapsable: false,
                    sidebarDepth: 3
                    // children: [
                    // 	'/components/',
                    // 	{
                    // 		title: '组件 1',
                    // 		path: '/components/cell/',
                    // 		collapsable: false,
                    // 		sidebarDepth: 3,
                    // 	},
                    // ],
                },
                {
                    title: 'cell',
                    // path: '/components/cell/',
                    collapsable: false,
                    sidebarDepth: 3,
                    children: ['/components/cell/', '/components/box/']
                }
            ],
            '/guide/': [''],
            '/setting/': [
                {
                    title: 'Group 1',
                    path: '/components/',
                    collapsable: false,
                    sidebarDepth: 3,
                    children: ['/']
                }
            ]
        },
        lastUpdated: 'Last Updated',
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

    plugins: [
        // 官方回到顶部插件
        '@vuepress/back-to-top',
        //官方图片放大组件 目前是所有img都可以点击放大。具体配置见https://v1.vuepress.vuejs.org/zh/plugin/official/plugin-medium-zoom.html
        ['@vuepress/medium-zoom', { selector: 'img' }],
        // vssue 一个借助issue的评论插件 具体配置见https://vssue.js.org/zh/
        [
            '@vssue/vuepress-plugin-vssue',
            {
                // 设置 `platform` 而不是 `api` 我这里是在github平台
                platform: 'github',
                // owner与repo配置 https://github.com/${owner}/${repo}
                // 例如我的仓库地址为https://github.com/saqqdy/gitmars 则owner为saqqdy，repo为gitmars
                owner: 'saqqdy',
                repo: 'gitmars',
                // 填写自己的OAuth App 信息。详见https://vssue.js.org/zh/options/#repo
                clientId: settings.clientId,
                clientSecret: settings.clientSecret,
                locale: 'zh', //使用的语言  这里是简体中文
                baseURL: 'https://github.com' //平台的 base URL
            }
        ]
    ],
    markdown: {
        lineNumbers: true,
        toc: { includeLevel: [2, 3] }
    },
    sidebarDepth: 3,
    configureWebpack: {
        resolve: {
            alias: {
                '@assets': require('path').join(__dirname, '../assets')
            }
        }
    }
}
