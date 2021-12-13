'use strict';

const { debug } = require("../utils/debug");
class GitLogsFormatter {
  constructor(keys) {
    this.keys = [
      "%H",
      "%h",
      "%T",
      "%t",
      "%P",
      "%p",
      "%an",
      "%aN",
      "%ae",
      "%aE",
      "%al",
      "%aL",
      "%ad",
      "%aD",
      "%ar",
      "%at",
      "%ai",
      "%aI",
      "%as",
      "%cn",
      "%cN",
      "%ce",
      "%cE",
      "%cl",
      "%cL",
      "%cd",
      "%cD",
      "%cr",
      "%ct",
      "%ci",
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
      "%gs",
      "%(trailers:key=Signed-off-by)",
      "%(trailers:key=Reviewed-by)"
    ];
    this.format = "";
    if (keys) {
      this.keys = keys;
    }
  }
  getFormat(keys) {
    if (keys && keys.length)
      this.keys = keys;
    this.format = `-start-${this.keys.join(",=")}-end-`;
    debug("GitLogsFormatter-format", this.format, keys);
    return this.format;
  }
  getLogs(stdout) {
    const list = [];
    if (stdout) {
      const match = stdout.replace(/(?:^-start-)|(?:-end-$)/g, "").replace(/-end-([.\n]+)-start-/g, "-split-").split("-split-") || [];
      for (const log of match) {
        const args = log.split(",=");
        const map = {};
        this.keys.forEach((key, i) => {
          map[key] = args[i];
        });
        list.push(map);
      }
    }
    debug("GitLogsFormatter-logs", stdout);
    return list;
  }
}
module.exports = GitLogsFormatter;
