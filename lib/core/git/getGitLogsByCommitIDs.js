'use strict';

const { spawnSync } = require("../spawn");
const GitLogsFormatter = require("./gitLogsFormatter");
const { debug } = require("../utils/debug");
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
  debug("getGitLogsByCommitIDs", stdout);
  return formatter.getLogs(stdout);
}
module.exports = getGitLogsByCommitIDs;
