'use strict';

const isDebug = ["1", "true"].includes(process.env.GITMARS_DEBUG || "");
function debug(...args) {
  if (isDebug) {
    console.info("gitmars:debug", ...args);
  }
}
module.exports = {
  isDebug,
  debug
};
