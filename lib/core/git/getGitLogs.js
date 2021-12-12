'use strict';

const { spawnSync } = require("../spawn");
const getSeconds = require("../utils/getSeconds");
const GitLogsFormatter = require("./gitLogsFormatter");
const { debug } = require("../utils/debug");
function getGitLogs(option = {}) {
  const {
    lastet,
    limit,
    params = "",
    keys,
    noMerges = false,
    grep,
    author,
    branch
  } = option;
  const formatter = new GitLogsFormatter();
  let argv = [
    "log",
    branch ? branch : "",
    "--date-order",
    `--pretty=format:${formatter.getFormat(keys)}`
  ];
  if (limit)
    argv.push("-" + limit);
  if (lastet)
    argv = argv.concat(["--since", getSeconds(lastet)]);
  if (grep)
    argv = argv.concat(["--grep", grep]);
  if (author)
    argv = argv.concat(["--author", author]);
  if (noMerges)
    argv.push("--no-merges");
  if (params)
    argv = argv.concat(params.split(" "));
  const { stdout } = spawnSync("git", argv);
  debug("getGitLogs", stdout);
  return formatter.getLogs(stdout);
}
module.exports = getGitLogs;
