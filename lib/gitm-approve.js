#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const dayjs = require("dayjs");
const inquirer = require("inquirer");
const { green, yellow, blue, red, cyan, magenta } = require("colors");
const { options, args } = require("./conf/approve");
const getUserToken = require("./core/api/getUserToken");
const getIsGitProject = require("./core/git/getIsGitProject");
const getGitConfig = require("./core/git/getGitConfig");
const sendGroupMessage = require("./core/sendGroupMessage");
const { createArgs } = require("./core/utils/command");
const echo = require("./core/utils/echo");
if (!getIsGitProject()) {
  echo(red("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  process.exit(1);
}
const { appName } = getGitConfig();
const getConfig = require("./core/getConfig");
const config = getConfig();
const {
  getMergeRequestList,
  getMergeRequestChanges,
  acceptMergeRequest,
  updateMergeRequest,
  deleteMergeRequest
} = require("./core/api/mergeRequest");
const { getMergeRequestNotesList } = require("./core/api/mergeRequestNotes");
program.name("gitm approve").usage("[--state [state]] [--quiet]").description("\u5BA1\u6279\u8FDC\u7A0B\u5408\u5E76\u8BF7\u6C42");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (opt) => {
  const {
    token,
    level,
    nickname = ""
  } = config.api ? await getUserToken() : {};
  if (level && level > 2) {
    echo(red(`${nickname}\u540C\u5B66\uFF0C\u4F60\u7684\u6743\u9650\u4E0D\u8DB3`));
    process.exit(1);
  }
  const mrList = await getMergeRequestList({ token, state: opt.state });
  if (mrList.length === 0) {
    echo(yellow("\u6CA1\u6709\u53D1\u73B0\u5408\u5E76\u8BF7\u6C42\u8BB0\u5F55\uFF0C\u8FDB\u7A0B\u5DF2\u9000\u51FA"));
    process.exit(0);
  }
  const prompt = [
    {
      type: "checkbox",
      message: "\u8BF7\u9009\u62E9\u8981\u64CD\u4F5C\u7684\u5408\u5E76\u8BF7\u6C42",
      name: "iids",
      choices: []
    },
    {
      type: "list",
      message: "\u8BF7\u9009\u62E9\u4E0B\u9762\u7684\u64CD\u4F5C?",
      name: "accept",
      choices: ["\u67E5\u770B\u8BE6\u60C5", "\u901A\u8FC7", "\u4E0D\u901A\u8FC7", "\u4E0D\u901A\u8FC7\u5E76\u5220\u9664", "\u9000\u51FA"],
      when(answers) {
        return answers.iids.length;
      }
    }
  ];
  for (const mr of mrList) {
    const {
      iid,
      author,
      source_branch,
      target_branch,
      merge_status,
      created_at
    } = mr;
    mr.notes = (await getMergeRequestNotesList({
      token,
      iid
    }) || []).filter((note) => !note.system);
    const disabled = merge_status !== "can_be_merged";
    const _time = dayjs(created_at).format("YYYY/MM/DD HH:mm");
    prompt[0].choices.push({
      name: `${green(iid + "\uFF1A")} \u8BF7\u6C42\u5408\u5E76 ${green(source_branch)} \u5230 ${green(target_branch)} ${disabled ? red("[ \u6709\u51B2\u7A81\u6216\u4E0D\u9700\u8981\u5408\u5E76 ]") : ""} | ${yellow(author.name)} | ${green(mr.notes.length + "\u6761\u8BC4\u8BBA")} | ${blue(_time)}`,
      value: iid,
      checked: false
    });
  }
  const { iids, accept } = await inquirer.prompt(prompt);
  if (iids.length === 0) {
    echo(yellow("\u6CA1\u6709\u9009\u62E9\u5408\u5E76\u8BF7\u6C42\u8BB0\u5F55\uFF0C\u8FDB\u7A0B\u5DF2\u9000\u51FA"));
    process.exit(0);
  }
  for (const iid of iids) {
    const { merge_status, source_branch, target_branch } = mrList.find((item) => item.iid === iid);
    const CAN_BE_MERGED = merge_status === "can_be_merged";
    if (accept === "\u901A\u8FC7") {
      if (!CAN_BE_MERGED) {
        echo(yellow("\u4E0D\u80FD\u5408\u5E76\u7684\u8BF7\u6C42\u4E0D\u80FD\u70B9\u5BA1\u6838\u901A\u8FC7"));
        process.exit(0);
      }
      await acceptMergeRequest({ token, iid });
      !opt.quiet && sendGroupMessage(`${appName}\u9879\u76EE${source_branch}\u5408\u5E76\u5230${target_branch}\u8BF7\u6C42ID${iid}\u5DF2\u5408\u5E76`);
      echo(green(`\u5408\u5E76\u8BF7\u6C42${iid}\uFF1A\u5DF2\u5408\u5E76`));
    } else if (accept === "\u67E5\u770B\u8BE6\u60C5") {
      const { changes, changes_count } = await getMergeRequestChanges({
        token,
        iid
      });
      echo(green(`
${iid}\uFF1A\u4E00\u5171\u53D8\u52A8\u4E86${changes_count}\u4E2A\u6587\u4EF6`));
      for (const { old_path, new_path, diff } of changes) {
        echo(magenta("\n----------------------------------------------------------------------------------"));
        echo(magenta(old_path));
        old_path !== new_path && echo(magenta(new_path + "(\u65B0\u8DEF\u5F84)"));
        echo(diff.replace(/(@@.+)\n/g, (m, p1) => cyan(p1) + "\n").replace(/\n(-.+)/g, (m, p1) => "\n" + red(p1)).replace(/\n(\+.+)/g, (m, p1) => "\n" + green(p1)));
      }
    } else if (accept === "\u4E0D\u901A\u8FC7\u5E76\u5220\u9664") {
      await deleteMergeRequest({ token, iid });
      !opt.quiet && sendGroupMessage(`${appName}\u9879\u76EE${source_branch}\u5408\u5E76\u5230${target_branch}\u8BF7\u6C42ID${iid}\u5DF2\u5220\u9664`);
      echo(green(`\u5408\u5E76\u8BF7\u6C42${iid}\uFF1A\u5DF2\u5220\u9664`));
    } else if (accept === "\u4E0D\u901A\u8FC7") {
      await updateMergeRequest({
        token,
        iid,
        data: { state_event: "close" }
      });
      !opt.quiet && sendGroupMessage(`${appName}\u9879\u76EE${source_branch}\u5408\u5E76\u5230${target_branch}\u8BF7\u6C42ID${iid}\u5DF2\u6682\u65F6\u5173\u95ED`);
      echo(green(`\u5408\u5E76\u8BF7\u6C42${iid}\uFF1A\u5DF2\u5173\u95ED`));
    }
  }
});
program.parse(process.argv);
