const { getGitConfig, getGitRevParse } = require('../git/index')
const { gitUrl } = getGitConfig()
const { root } = getGitRevParse()
const readPkg = require('../utils/readPkg')

/**
 * getHookComment
 * @description 生成hook注释，广告
 * @returns {Object} arr 返回对象
 */
function getHookComment(): string {
    // const pkgHomepage = process.env.npm_package_homepage
    const {
        author,
        homepage: gitmarsHomepage,
        version: gitmarsVersion
    } = readPkg()
    const createdAt = new Date().toLocaleString()
    return `# Created by gitmars v${gitmarsVersion} (${gitmarsHomepage})
# author: ${author}
# At: ${createdAt}
# From: ${root} (${gitUrl})`
}

module.exports = getHookComment
export {}
