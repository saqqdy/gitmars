'use strict';

const getHookComment = require("./getHookComment");
const hookComment = getHookComment();
function getLocalShell(pmName, relativeUserPkgDir) {
  return `${hookComment}

packageManager=${pmName}
cd "${relativeUserPkgDir}"
`;
}
module.exports = getLocalShell;
