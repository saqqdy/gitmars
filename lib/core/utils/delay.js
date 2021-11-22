'use strict';

function delay(millisecond = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecond);
  });
}
module.exports = delay;
