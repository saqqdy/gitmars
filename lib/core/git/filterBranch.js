'use strict';

const sh = require("shelljs");
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
module.exports = filterBranch;
