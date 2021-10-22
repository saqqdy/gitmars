'use strict';

function encodeUnicode(str) {
  const res = [];
  for (let i = 0; i < str.length; i++) {
    res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
  }
  return "\\u" + res.join("\\u");
}
function decodeUnicode(str) {
  str = str.replace(/\\/g, "%");
  return unescape(str);
}
module.exports = {
  encodeUnicode,
  decodeUnicode
};
