const sidebar = require('./sidebar')

module.exports = {
    nav: [
        { text: '首页', link: '/' },
        { text: '指南', link: '/guide/' },
        { text: '工作流', link: '/workflow/' },
        { text: '效率', link: '/tools/' },
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
    sidebar,
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
}
