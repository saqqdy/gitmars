'use strict';

const { spawnSync } = require("../spawn");
const GitLogsFormatter = require("./gitLogsFormatter");
function getGitLogsByCommitIDs({
  commitIDs,
  params,
  keys
}) {
  if (typeof commitIDs === "string")
    commitIDs = [commitIDs];
  const formatter = new GitLogsFormatter();
  const { stdout } = spawnSync("git", [
    "show",
    ...commitIDs,
    "--name-only",
    `--pretty=format:${formatter.getFormat(keys)}`,
    ...params.split(" ")
  ]);
  return formatter.getLogs(stdout);
}
module.exports = getGitLogsByCommitIDs;
