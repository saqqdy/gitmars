'use strict';

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
module.exports = mapTemplate;
