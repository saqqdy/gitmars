'use strict';

const sh = require("shelljs");
const getGitConfig = require("./getGitConfig");
const getGitRevParse = require("./getGitRevParse");
function searchBranches(opt = {}) {
  const { key, type, remote = false, exclude, include } = opt;
  let { path } = opt;
  if (!path) {
    if (remote) {
      const { gitUrl } = getGitConfig();
      path = gitUrl;
    } else {
      const { root } = getGitRevParse();
      path = root;
    }
  }
  const data = sh.exec(`git ls-remote --heads --quiet ${path}`, { silent: true }).stdout.replace(/\n*$/g, "");
  const arr = data ? data.split("\n") : [];
  const map = {
    heads: [],
    tags: [],
    others: []
  };
  for (const el of arr) {
    const match = el.match(/^\w+[\s]+refs\/(heads|remotes|tags)\/([\w-\/]+)$/);
    if (!match)
      continue;
    switch (match[1]) {
      case "heads":
        map.heads.push(match[2]);
        break;
      case "remotes":
        map.heads.push(match[2]);
        break;
      case "tags":
        map.tags.push(match[2]);
        break;
      default:
        map.others.push(match[2]);
        break;
    }
  }
  if (type) {
    let _types = type.split(","), temp = [];
    map.heads.forEach((item) => {
      types:
        for (let t of _types) {
          if (["bugfix", "feature", "support"].includes(t) && item.indexOf(t + "/") > -1) {
            temp.push(item);
            break types;
          }
        }
    });
    map.heads = temp;
  }
  if (exclude) {
    const reg = new RegExp(exclude);
    map.heads = map.heads.filter((el) => !reg.test(el));
  }
  if (include) {
    const reg = new RegExp(include);
    map.heads = map.heads.filter((el) => reg.test(el));
  }
  if (key) {
    map.heads = map.heads.filter((el) => el.indexOf(key) > -1);
  }
  return map.heads;
}
module.exports = searchBranches;