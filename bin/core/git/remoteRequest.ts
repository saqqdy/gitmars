// const { warning } = require('../utils/colors')
const request = require('../request')
const getConfig = require('../getConfig')
const config = getConfig()

/**
 * 发起远程合并请求
 *
 * @param option - options
 * @returns command
 */
async function mergeRequest({
    source_branch,
    target_branch,
    token,
    description
}: {
    [prop: string]: string | undefined
}) {
    const params: {
        [prop: string]: string | undefined
    } = {
        source_branch,
        target_branch,
        private_token: token,
        title: `Merge branch '${source_branch}' into '${target_branch}'`
    }
    if (description) {
        params.description = description
    }
    const fetchData =
        (
            await request.post(
                {
                    url: `${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests`
                },
                params
            )
        ).data || null
    console.log(fetchData)
    return fetchData
}

module.exports = {
    mergeRequest
}
export {}
