module.exports = [
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
            clientId: 'f1b676f79b587ad9dced',
            clientSecret: 'd34199eee81d1bb5f4b386ef45b0816d636a1e66',
            locale: 'zh', //使用的语言  这里是简体中文
            baseURL: 'https://github.com' //平台的 base URL
        }
    ]
]
