'use strict';

const { encodeUnicode } = require("./unicode");
const getConfig = require("./getConfig");
const config = getConfig();
function getCurlMergeRequestCommand({
  source_branch,
  target_branch,
  token,
  description
}) {
  let des = "";
  if (description)
    des = `,\\"description\\":\\"${encodeUnicode(description)}\\"`;
  return `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${source_branch}\\",\\"target_branch\\":\\"${target_branch}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${source_branch}' into '${target_branch}'\\"${des}}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`;
}
module.exports = {
  getCurlMergeRequestCommand
};
