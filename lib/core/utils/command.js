'use strict';

function createArgs(args) {
  const argArr = [];
  args.forEach((arg) => {
    let str = arg.name;
    if (arg.variadic)
      str += "...";
    if (arg.required)
      str = "<" + str + ">";
    else
      str = "[" + str + "]";
    argArr.push(str);
  });
  return argArr.join(" ");
}
module.exports = {
  createArgs
};
