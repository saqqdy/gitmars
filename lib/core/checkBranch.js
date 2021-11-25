'use strict';

const { queue } = require("./queue");
async function checkBranch(name) {
  const data = await queue([`gitm branch -k ${name}`]);
  return data[0].out.replace(/^\s+/, "");
}
module.exports = checkBranch;
