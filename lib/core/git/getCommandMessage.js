'use strict';

function getCommandMessage(cmd) {
  const msg = {};
  const arr = cmd.replace(/[\s]+/g, " ").split(" ");
  if (arr.length < 2 || arr[0] !== "git")
    return msg;
  switch (arr[1]) {
    case "checkout":
      msg.processing = "\u6B63\u5728\u5207\u6362\u5206\u652F";
      msg.success = "\u5207\u6362\u5206\u652F\u6210\u529F";
      msg.fail = "\u5207\u6362\u5206\u652F\u5931\u8D25";
      break;
    case "pull":
      msg.processing = "\u6B63\u5728\u62C9\u53D6\u4EE3\u7801";
      msg.success = "\u62C9\u53D6\u4EE3\u7801\u6210\u529F";
      msg.fail = "\u62C9\u53D6\u4EE3\u7801\u5931\u8D25";
      break;
    case "fetch":
      msg.processing = "\u6B63\u5728\u62C9\u53D6\u8FDC\u7A0B\u7248\u672C";
      msg.success = "\u6293\u53D6\u6210\u529F";
      msg.fail = "\u6293\u53D6\u5931\u8D25";
      break;
    case "commit":
      msg.processing = "\u6B63\u5728\u63D0\u4EA4";
      msg.success = "\u63D0\u4EA4\u6210\u529F";
      msg.fail = "\u63D0\u4EA4\u5931\u8D25";
      break;
    case "push":
      msg.processing = "\u6B63\u5728\u63A8\u9001";
      msg.success = "\u63A8\u9001\u6210\u529F";
      msg.fail = "\u63A8\u9001\u5931\u8D25";
      break;
    case "cherry-pick":
      msg.processing = "\u6B63\u5728\u540C\u6B65\u63D0\u4EA4\u8BB0\u5F55";
      msg.success = "\u540C\u6B65\u63D0\u4EA4\u8BB0\u5F55\u6210\u529F";
      msg.fail = "\u540C\u6B65\u63D0\u4EA4\u8BB0\u5F55\u5931\u8D25";
      break;
    case "merge":
      msg.processing = "\u6B63\u5728merge\u5206\u652F";
      msg.success = "merge\u5206\u652F\u6210\u529F";
      msg.fail = "merge\u5206\u652F\u5931\u8D25";
      break;
    case "rebase":
      msg.processing = "\u6B63\u5728rebase\u5206\u652F";
      msg.success = "rebase\u5206\u652F\u6210\u529F";
      msg.fail = "rebase\u5206\u652F\u5931\u8D25";
      break;
    case "revert":
      msg.processing = "\u6B63\u5728\u56DE\u64A4\u4EE3\u7801";
      msg.success = "\u64A4\u9500\u6210\u529F";
      msg.fail = "\u64A4\u9500\u5931\u8D25";
      break;
    case "clean":
      msg.processing = "\u6B63\u5728\u6E05\u7406";
      msg.success = "\u6E05\u7406\u6210\u529F";
      msg.fail = "\u6E05\u7406\u5931\u8D25";
      break;
  }
  return msg;
}
module.exports = getCommandMessage;
