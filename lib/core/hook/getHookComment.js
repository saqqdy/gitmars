'use strict';

const getGitConfig = require("../git/getGitConfig");
const getGitRevParse = require("../git/getGitRevParse");
const readPkg = require("../utils/readPkg");
const { gitUrl } = getGitConfig();
const { root } = getGitRevParse();
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
