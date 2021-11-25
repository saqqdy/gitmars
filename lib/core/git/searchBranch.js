'use strict';

const { queue } = require("../utils/queue");
async function searchBranch(key, type, remote = false) {
  const data = (await queue([
    `gitm branch${key ? " -k " + key : ""}${type ? " -t " + type : ""}${remote ? " -r" : ""}`
  ]))[0].out.replace(/^\*\s+/, "");
  let arr = data ? data.split("\n") : [];
  arr = arr.map((el) => el.trim());
  return arr;
}
module.exports = searchBranch;
