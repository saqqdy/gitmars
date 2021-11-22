'use strict';

const sh = require("shelljs");
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
  const results = sh.exec(`git log${limit ? ' -"' + limit + '"' : ""}${lastet ? ' --since="' + getSeconds(lastet) + '"' : ""}${branches ? ' --branches="*' + branches + '"' : ""} --date-order --pretty=format:"${keys.join(",=")}-end-" ${params}`, { silent: true }).stdout.replace(/[\r\n]+/g, "").replace(/-end-$/, "");
  const logList = [];
  results && results.split("-end-").forEach((log) => {
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
