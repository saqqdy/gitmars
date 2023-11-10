import { encodeUnicode } from '#lib/utils/unicode'
import getConfig from '#lib/getConfig'
import { getGitToken } from '#lib/git/getGitUser'
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
	description
}: Record<string, string | undefined>): string {
	let des = ''
	const token = getGitToken()
	if (description) {
		des = `,\u005C"description\u005C":\u005C"${encodeUnicode(description)}\u005C"`
	}
	return `curl -i -H "Content-Type: application/json" -X POST -d "{\u005C"source_branch\u005C":\u005C"${source_branch}\u005C",\u005C"target_branch\u005C":\u005C"${target_branch}\u005C",\u005C"private_token\u005C":\u005C"${token}\u005C",\u005C"title\u005C":\u005C"Merge branch '${source_branch}' into '${target_branch}'\u005C"${des}}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`
}

export default getCurlOfMergeRequest
