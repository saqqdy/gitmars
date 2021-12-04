'use strict';

const { format } = require("util");
function echo(message) {
  let output = format(message);
  output += "\n";
  process.stdout.write(output);
}
module.exports = echo;
