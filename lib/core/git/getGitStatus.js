'use strict';

const sh = require("shelljs");
function getGitStatus(config = {}) {
  const { silent = true } = config;
  const out = sh.exec("git status -s --no-column", { silent }).stdout.replace(/(^\s+|\n*$)/g, "");
  const list = out ? out.replace(/\n(\s+)/g, "\n").split("\n") : [];
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
  return sum;
}
module.exports = getGitStatus;
