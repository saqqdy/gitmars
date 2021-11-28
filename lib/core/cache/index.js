'use strict';

const { isCacheExpired, updateCacheTime } = require("./cache");
const {
  getCommandCache,
  setCommandCache,
  cleanCommandCache
} = require("./commandCache");
const {
  getRevertCache,
  setRevertCache,
  addRevertCache,
  cleanRevertCache
} = require("./revertCache");
const { setLog } = require("./log");
module.exports = {
  isCacheExpired,
  updateCacheTime,
  getCommandCache,
  setCommandCache,
  cleanCommandCache,
  getRevertCache,
  setRevertCache,
  addRevertCache,
  cleanRevertCache,
  setLog
};
