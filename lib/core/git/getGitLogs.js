'use strict';

const { spawnSync } = require("../spawn");
const getSeconds = require("../utils/getSeconds");
const GitLogsFormatter = require("./gitLogsFormatter");
function getGitLogs(config = {}) {
  const {
    lastet,
    limit,
    params = "",
    keys,
    noMerges = false
  } = config;
  const formatter = new GitLogsFormatter();
  let argv = [
    "log",
    "--date-order",
    `--pretty=format:${formatter.getFormat(keys)}`
  ];
  if (limit)
    argv.push("-" + limit);
  if (lastet)
    argv = argv.concat(["--since", getSeconds(lastet)]);
  if (noMerges)
    argv.push("--no-merges");
  argv = argv.concat(params.split(" "));
  const { stdout } = spawnSync("git", argv);
  const logList = formatter.getLogs(stdout);
  return logList;
}
module.exports = getGitLogs;
