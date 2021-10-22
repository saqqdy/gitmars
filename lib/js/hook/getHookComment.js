'use strict';

const getGitConfig = require("../getGitConfig");
const gitRevParse = require("../gitRevParse");
const { gitUrl } = getGitConfig();
const { root } = gitRevParse();
const readPkg = require("../readPkg");
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
