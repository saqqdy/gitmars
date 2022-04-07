const { encodeUnicode } = require('../utils/unicode')
const getConfig = require('../getConfig')
const config = getConfig()

/**
 * 获取发起merge请求的脚本字符串
 *
 * @param option - options
 * @returns command
 */
function getCurlOfMergeRequest({
    source_branch,
    target_branch,
    token,
    description
}: {
    [prop: string]: string | undefined
}): string {
    let des = ''
    if (description) {
        des = `,\u005C"description\u005C":\u005C"${encodeUnicode(
            description
        )}\u005C"`
    }
    return `curl -i -H "Content-Type: application/json" -X POST -d "{\u005C"source_branch\u005C":\u005C"${source_branch}\u005C",\u005C"target_branch\u005C":\u005C"${target_branch}\u005C",\u005C"private_token\u005C":\u005C"${token}\u005C",\u005C"title\u005C":\u005C"Merge branch '${source_branch}' into '${target_branch}'\u005C"${des}}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`
}

module.exports = getCurlOfMergeRequest
export {}
