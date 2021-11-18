'use strict';

const fs = require("fs");
const sh = require("shelljs");
const colors = require("colors");
const getGitConfig = require("./getGitConfig");
const gitRevParse = require("./gitRevParse");
const getConfig = require("./getConfig");
function warning(txt) {
  return colors.yellow(txt);
}
function error(txt) {
  return colors.red(txt);
}
function success(txt) {
  return colors.green(txt);
}
function writeFile(url, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(url, data, (err) => {
      if (err) {
        reject(new Error("\u6587\u4EF6\u5199\u5165\u9519\u8BEF"));
      } else {
        resolve(true);
      }
    });
  });
}
function mapTemplate(tmp, data) {
  if (!tmp || !data)
    return null;
  const str = "" + tmp.replace(/\$\{([a-zA-Z0-9-_]+)\}/g, (a, b) => {
    if (typeof data === "function") {
      return data(b);
    }
    for (const k in data) {
      if (b === k) {
        return data[k];
      }
    }
  });
  return str;
}
function getSeconds(str) {
  const match = String(str).match(/^(\d+)([a-zA-Z]+)$/);
  let time;
  if (!match)
    return null;
  time = +match[1];
  switch (match[2]) {
    case "m":
      time *= 60;
      break;
    case "h":
      time *= 3600;
      break;
    case "d":
      time *= 86400;
      break;
    case "w":
      time *= 604800;
      break;
    case "M":
      time *= 2592e3;
      break;
    case "y":
      time *= 31536e3;
      break;
  }
  return parseInt(String(Date.now() / 1e3 - time));
}
function wait(list, fun) {
  if (list.length === 0) {
    fun();
    return;
  } else {
    fun(list[0], (kill = false) => {
      if (kill)
        return;
      list.shift();
      wait(list, fun);
    });
  }
}
function queue(list) {
  return new Promise((resolve, reject) => {
    const returns = [];
    if (list.length === 0)
      reject("\u6307\u4EE4\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A");
    list = JSON.parse(JSON.stringify(list));
    wait(list, (command, cb) => {
      let cfg = {
        silent: true,
        postmsg: false,
        kill: true,
        again: false
      }, cmd = command;
      if (command instanceof Object) {
        cfg = Object.assign(cfg, command.config || {});
        cmd = command.cmd;
      }
      if (!cmd) {
        resolve(returns);
      } else {
        sh.exec(cmd, cfg, (code, out, err) => {
          const msg = getCommandMessage(cmd);
          try {
            out = JSON.parse(out);
          } catch (e) {
            out = out.replace(/\n*$/g, "");
          }
          returns.push({ code, out, err, cfg, cmd });
          if (code !== 0)
            setLog({ command, code, out, err });
          if (code !== 0 && cfg.kill) {
            const rest = JSON.parse(JSON.stringify(list));
            if (!cfg.again) {
              rest.shift();
            } else if (cfg.again !== true) {
              rest.splice(0, 1, cfg.again);
            }
            cb && cb(true);
            setCache(rest);
            cfg.silent && sh.echo(error(err));
            sh.echo(error(cfg.fail || msg.fail || "\u51FA\u9519\u4E86\uFF01\u6307\u4EE4 " + cmd + " \u6267\u884C\u5931\u8D25\uFF0C\u4E2D\u65AD\u4E86\u8FDB\u7A0B"));
            cfg.postmsg && postMessage("\u51FA\u9519\u4E86\uFF01\u6307\u4EE4 " + cmd + " \u6267\u884C\u5931\u8D25\uFF0C\u4E2D\u65AD\u4E86\u8FDB\u7A0B");
            rest.length > 0 && sh.echo(error("\u8BF7\u5904\u7406\u76F8\u5173\u95EE\u9898\u4E4B\u540E\u8F93\u5165gitm continue\u7EE7\u7EED"));
            sh.exit(1);
          } else {
            if (code === 0) {
              const m = cfg.success || msg.success;
              if (m) {
                sh.echo(success(m));
                cfg.postmsg && postMessage(m);
              }
            } else {
              const m = cfg.fail || msg.fail || "\u6307\u4EE4 " + cmd + " \u6267\u884C\u5931\u8D25";
              m && sh.echo(warning(m));
            }
            cb && cb();
          }
        });
      }
    });
  });
}
function getCache() {
  const { gitDir } = gitRevParse();
  let arr = [];
  if (sh.test("-f", gitDir + "/.gitmarscommands")) {
    arr = sh.cat(gitDir + "/.gitmarscommands").stdout.split("\n")[0].replace(/(^\n*)|(\n*$)/g, "").replace(/\n{2,}/g, "\n").replace(/\r/g, "");
    arr = JSON.parse(decodeURIComponent(arr));
  }
  return arr;
}
function setCache(rest) {
  const { gitDir } = gitRevParse();
  sh.touch(gitDir + "/.gitmarscommands");
  sh.sed("-i", /[\s\S\n\r\x0a\x0d]*/, encodeURIComponent(JSON.stringify(rest)), gitDir + "/.gitmarscommands");
}
function cleanCache() {
  setCache([]);
}
function setLog(log) {
  const { gitDir } = gitRevParse();
  sh.touch(gitDir + "/.gitmarslog");
  sh.sed("-i", /[\s\S\n\r\x0a\x0d]*/, encodeURIComponent(JSON.stringify(log)), gitDir + "/.gitmarslog");
}
function getStatusInfo(config = {}) {
  const { silent = true } = config;
  const out = sh.exec("git status -s --no-column", { silent }).stdout.replace(/(^\s+|\n*$)/g, "");
  const list = out ? out.replace(/\n(\s+)/g, "\n").split("\n") : [];
  const sum = {
    A: [],
    D: [],
    M: [],
    "??": []
  };
  if (list.length === 0)
    return sum;
  list.forEach((str) => {
    const arr = str.trim().replace(/\s+/g, " ").split(" ");
    const type = arr.splice(0, 1)[0];
    if (!sum[type])
      sum[type] = [];
    sum[type].push(arr.join(" "));
  });
  return sum;
}
function getStatus() {
  const sum = getStatusInfo({ silent: false });
  if (sum.A.length > 0 || sum.D.length > 0 || sum.M.length > 0) {
    sh.echo(error("\u60A8\u8FD8\u6709\u672A\u63D0\u4EA4\u7684\u6587\u4EF6\uFF0C\u8BF7\u5904\u7406\u540E\u518D\u7EE7\u7EED") + "\n\u5982\u679C\u9700\u8981\u6682\u5B58\u6587\u4EF6\u8BF7\u6267\u884C: gitm save\n\u6062\u590D\u65F6\u6267\u884C\uFF1Agitm get");
    sh.exit(1);
    return false;
  } else if (sum["??"].length > 0) {
    sh.echo(warning("\u60A8\u6709\u672A\u52A0\u5165\u7248\u672C\u7684\u6587\u4EF6,") + "\n\u5982\u679C\u9700\u8981\u6682\u5B58\u6587\u4EF6\u8BF7\u6267\u884C: gitm save --force\n\u6062\u590D\u65F6\u6267\u884C\uFF1Agitm get");
  }
  return true;
}
function getLogs(config = {}) {
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
async function checkBranch(name) {
  const data = await queue([`gitm branch -k ${name}`]);
  return data[0].out.replace(/^\s+/, "");
}
function getCurrent() {
  return sh.exec("git symbolic-ref --short -q HEAD", { silent: true }).stdout.replace(/[\n\s]*$/g, "");
}
async function searchBranch(key, type, remote = false) {
  const data = (await queue([
    `gitm branch${key ? " -k " + key : ""}${type ? " -t " + type : ""}${remote ? " -r" : ""}`
  ]))[0].out.replace(/^\*\s+/, "");
  let arr = data ? data.split("\n") : [];
  arr = arr.map((el) => el.trim());
  return arr;
}
function searchBranchs(opt = {}) {
  const { key, type, remote = false, local = true, except } = opt;
  let { path } = opt;
  if (!path)
    path = sh.pwd().stdout;
  const data = sh.exec(`git ls-remote${remote ? " --refs" : " --heads"} --quiet --sort="version:refname" ${path}`, { silent: true }).stdout.replace(/\n*$/g, "");
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
  if (!local) {
    map.heads = map.heads.filter((el) => el.indexOf("origin/") === 0);
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
  if (except) {
    const reg = new RegExp(except);
    map.heads = map.heads.filter((el) => !reg.test(el));
  }
  if (key) {
    map.heads = map.heads.filter((el) => el.indexOf(key) > -1);
  }
  return map.heads;
}
function filterBranch(key, types, remote = false) {
  let typesList = [types], list;
  if (typeof types === "string")
    typesList = types.split(",");
  const out = sh.exec(`git branch${remote ? " -a" : ""}`, { silent: true }).stdout.replace(/(^\s+|[\n\r]*$)/g, "").replace(/\*\s+/, "");
  list = out ? out.replace(/\n(\s+)/g, "\n").split("\n") : [];
  list = list.filter((el) => {
    let result = true;
    if (key && !el.includes(key))
      result = false;
    if (result && typesList.length > 0) {
      result = false;
      type:
        for (const type of typesList) {
          if (el.includes(type)) {
            result = true;
            break type;
          }
        }
    }
    return result;
  });
  return list;
}
async function getStashList(key) {
  const data = (await queue(["git stash list"]))[0].out.replace(/^\*\s+/, "");
  const list = data && data.split("\n") || [];
  const arr = [];
  if (list.length > 10)
    sh.echo(warning(`\u8BE5\u9879\u76EE\u4E0B\u4E00\u5171\u6709${list.length}\u6761\u6682\u5B58\u8BB0\u5F55\uFF0C\u5EFA\u8BAE\u5B9A\u671F\u6E05\u7406\uFF01`));
  try {
    list.forEach((item) => {
      const msgArr = item.split(":");
      const first = msgArr.shift();
      if (!key || key && key === msgArr[msgArr.length - 1].trim()) {
        const m = first.match(/^stash@\{(\d+)\}$/);
        if (msgArr.length > 1)
          msgArr.shift();
        arr.push({
          key: first,
          index: m ? +m[1] : 0,
          msg: msgArr.join(":").trim()
        });
      }
    });
  } catch (e) {
  }
  return arr;
}
function getMessage(type) {
  const { root } = gitRevParse();
  const { appName } = getGitConfig();
  const config = getConfig();
  const d = new Date();
  let str = "";
  switch (type) {
    case "time":
      str = d.toLocaleString();
      break;
    case "timeNum":
      str = String(d.getTime());
      break;
    case "pwd":
      str = root;
      break;
    case "project":
      str = appName;
      break;
    case "user":
      str = config.user;
      break;
  }
  return str;
}
function postMessage(msg = "") {
  const config = getConfig();
  if (!config.msgTemplate) {
    sh.echo(error("\u8BF7\u914D\u7F6E\u6D88\u606F\u53D1\u9001api\u6A21\u677F\u5730\u5740"));
    return;
  }
  const message = mapTemplate(config.msgTemplate, (key) => {
    if (key === "message")
      return msg;
    return getMessage(key);
  });
  config.msgUrl && message && sendMessage(message);
}
function sendMessage(message = "", cfg = {}) {
  const config = getConfig();
  const { silent = true } = cfg;
  if (!config.msgUrl) {
    sh.echo(error("\u8BF7\u914D\u7F6E\u6D88\u606F\u63A8\u9001\u5730\u5740"));
    return;
  }
  message = message.replace(/\s/g, "");
  config.msgUrl && sh.exec(`curl -i -H "Content-Type: application/json" -X POST -d '{"envParams":{"error_msg":"'${message}'"}}' "${config.msgUrl}"`, { silent });
}
function getCommandMessage(cmd) {
  const msg = {};
  const arr = cmd.replace(/[\s]+/g, " ").split(" ");
  if (arr.length < 2 || arr[0] !== "git")
    return msg;
  switch (arr[1]) {
    case "checkout":
      msg.success = "\u5207\u6362\u5206\u652F\u6210\u529F";
      msg.fail = "\u5207\u6362\u5206\u652F\u5931\u8D25";
      break;
    case "pull":
      msg.success = "\u62C9\u53D6\u4EE3\u7801\u6210\u529F";
      msg.fail = "\u62C9\u53D6\u4EE3\u7801\u5931\u8D25";
      break;
    case "fetch":
      msg.success = "\u6293\u53D6\u6210\u529F";
      msg.fail = "\u6293\u53D6\u5931\u8D25";
      break;
    case "commit":
      msg.success = "\u63D0\u4EA4\u6210\u529F";
      msg.fail = "\u63D0\u4EA4\u5931\u8D25";
      break;
    case "push":
      msg.success = "\u63A8\u9001\u6210\u529F";
      msg.fail = "\u63A8\u9001\u5931\u8D25";
      break;
    case "cherry-pick":
      msg.success = "\u540C\u6B65\u63D0\u4EA4\u8BB0\u5F55\u6210\u529F";
      msg.fail = "\u540C\u6B65\u63D0\u4EA4\u8BB0\u5F55\u5931\u8D25";
      break;
    case "merge":
      msg.success = "merge\u5206\u652F\u6210\u529F";
      msg.fail = "merge\u5206\u652F\u5931\u8D25";
      break;
    case "rebase":
      msg.success = "rebase\u5206\u652F\u6210\u529F";
      msg.fail = "rebase\u5206\u652F\u5931\u8D25";
      break;
    case "revert":
      msg.success = "\u64A4\u9500\u6210\u529F";
      msg.fail = "\u64A4\u9500\u5931\u8D25";
      break;
    case "clean":
      msg.success = "\u6E05\u7406\u6210\u529F";
      msg.fail = "\u6E05\u7406\u5931\u8D25";
      break;
  }
  return msg;
}
function compareVersion(basicVer, compareVer) {
  if (basicVer === null)
    return null;
  basicVer = basicVer + ".";
  compareVer = compareVer + ".";
  const bStr = parseFloat(basicVer);
  const cStr = parseFloat(compareVer);
  const bStrNext = parseFloat(basicVer.replace(bStr + ".", "")) || 0;
  const cStrNext = parseFloat(compareVer.replace(cStr + ".", "")) || 0;
  if (cStr > bStr) {
    return false;
  } else if (cStr < bStr) {
    return true;
  } else {
    if (bStrNext >= cStrNext) {
      return true;
    } else {
      return false;
    }
  }
}
function getBranchsFromID(commitID, remote = false) {
  const out = sh.exec(`git branch ${remote ? "-r" : ""} --contains ${commitID} --format="%(refname:short)`, { silent: true }).stdout.replace(/(^\s+|\n*$)/g, "");
  return out ? out.split("\n") : [];
}
function getGitUser() {
  return sh.exec("git config user.name", { silent: true }).stdout.replace(/(^\s+|\n*$)/g, "");
}
function getGitEmail() {
  return sh.exec("git config user.email", { silent: true }).stdout.replace(/(^\s+|\n*$)/g, "");
}
function isGitProject() {
  return sh.exec("git rev-parse --is-inside-work-tree", { silent: true }).stdout.includes("true");
}
module.exports = {
  warning,
  error,
  success,
  writeFile,
  mapTemplate,
  getSeconds,
  wait,
  queue,
  getCache,
  setCache,
  cleanCache,
  setLog,
  getStatusInfo,
  getStatus,
  getLogs,
  checkBranch,
  getCurrent,
  searchBranch,
  searchBranchs,
  filterBranch,
  getStashList,
  postMessage,
  sendMessage,
  getCommandMessage,
  compareVersion,
  getBranchsFromID,
  getGitUser,
  getGitEmail,
  isGitProject
};
