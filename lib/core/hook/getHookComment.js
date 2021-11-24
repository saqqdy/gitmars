'use strict';

const { getGitConfig, getGitRevParse } = require("../git/index");
const { gitUrl } = getGitConfig();
const { root } = getGitRevParse();
const readPkg = require("../utils/readPkg");
function getHookComment() {
  const {
    author,
    homepage: gitmarsHomepage,
    version: gitmarsVersion
  } = readPkg();
  const createdAt = new Date().toLocaleString();
  return `# Created by gitmars v${gitmarsVersion} (${gitmarsHomepage})
# author: ${author}
# At: ${createdAt}
# From: ${root} (${gitUrl})`;
}
module.exports = getHookComment;
