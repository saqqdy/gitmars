'use strict';

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
module.exports = getSeconds;
