'use strict';

const sh = require("shelljs");
const { queue } = require("../utils/queue");
const { warning } = require("../utils/colors");
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
module.exports = getStashList;
