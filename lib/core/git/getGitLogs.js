'use strict';

const { spawnSync } = require("../spawn");
const getSeconds = require("../utils/getSeconds");
function getGitLogs(config = {}) {
  const { lastet, limit, branches, params = "" } = config;
  const keys = [
    "%H",
    "%T",
    "%P",
    "%an",
    "%ae",
    "%al",
    "%aL",
    "%ad",
    "%ar",
    "%at",
    "%aI",
    "%as",
    "%cn",
    "%ce",
    "%cl",
    "%cL",
    "%cd",
    "%cr",
    "%ct",
    "%cI",
    "%cs",
    "%d",
    "%D",
    "%S",
    "%e",
    "%s",
    "%f",
    "%b",
    "%B",
    "%N",
    "%GG",
    "%G?",
    "%GS",
    "%GK",
    "%GF",
    "%GP",
    "%GT",
    "%gD",
    "%gd",
    "%gn",
    "%gN",
    "%ge",
    "%gE",
    "%gs"
  ];
  let argv = [
    "log",
    "--date-order",
    `--pretty=format:${keys.join(",=")}-end-`
  ];
  if (limit)
    argv.push("-" + limit);
  if (lastet)
    argv = argv.concat(["--since", getSeconds(lastet)]);
  argv = argv.concat(params.split(" "));
  const stdout = spawnSync("git", argv).stdout.replace(/[\r\n]+/g, "").replace(/-end-$/, "");
  const logList = [];
  stdout && stdout.split("-end-").forEach((log) => {
    const args = log.split(",=");
    const map = {};
    keys.forEach((key, i) => {
      map[key] = args[i];
    });
    logList.push(map);
  });
  return logList;
}
module.exports = getGitLogs;
