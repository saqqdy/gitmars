'use strict';

const { spawnSync } = require("../spawn");
const { debug } = require("../utils/debug");
function getGitStatus(config = {}) {
  const { stdout } = spawnSync("git", ["status", "-s", "--no-column"], config);
  const list = stdout ? stdout.replace(/\n(\s+)/g, "\n").split("\n") : [];
  const sum = {
    A: [],
    D: [],
    M: [],
    "??": []
  };
  if (list.length === 0)
    return sum;
  list.forEach((str) => {
    const arr = str.trim().replace(/\s+/g, " ").split(" ");
    const type = arr.splice(0, 1)[0];
    if (!sum[type])
      sum[type] = [];
    sum[type].push(arr.join(" "));
  });
  debug("getGitStatus", sum);
  return sum;
}
module.exports = getGitStatus;
