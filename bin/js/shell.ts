const { encodeUnicode } = require('./unicode')
const getConfig = require('./js/getConfig')
const config = getConfig()

/**
 * 获取发起merge请求的脚本字符串
 *
 * @param option - options
 * @returns command
 */
function getCurlMergeRequestCommand({
    source_branch,
    target_branch,
    token,
    description
}: {
    [prop: string]: string | undefined
}): string {
    let des = ''
    if (description)
    des = `,\u005c"description\u005c":\u005c"${encodeUnicode(
        description
    )}\u005c"`
    return `curl -i -H "Content-Type: application/json" -X POST -d "{\u005c"source_branch\u005c":\u005c"${source_branch}\u005c",\u005c"target_branch\u005c":\u005c"${target_branch}\u005c",\u005c"private_token\u005c":\u005c"${token}\u005c",\u005c"title\u005c":\u005c"Merge branch '${source_branch}' into '${target_branch}'\u005c"${des}}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`
}

module.exports = {
    getCurlMergeRequestCommand
}
export {}
