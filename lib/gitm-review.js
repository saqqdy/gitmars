#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const dayjs = require("dayjs");
const inquirer = require("inquirer");
const columnify = require("columnify");
const { green, yellow, blue, red, cyan, magenta } = require("colors");
const { options, args } = require("./conf/review");
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
  updateMergeRequest,
  deleteMergeRequest
} = require("./core/api/mergeRequest");
const {
  getMergeRequestNotesList,
  createMergeRequestNotes
} = require("./core/api/mergeRequestNotes");
program.name("gitm review").usage("[--state [state]] [--postmsg]").description("review\u8FDC\u7A0B\u4EE3\u7801");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (opt) => {
  const { token } = config.api ? await getUserToken() : {};
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
      choices: ["\u67E5\u770B\u8BE6\u60C5", "\u8BC4\u8BBA", "\u5173\u95ED", "\u5220\u9664", "\u9000\u51FA"],
      when(answers) {
        return answers.iids.length;
      }
    }
  ];
  mrList.forEach((mr) => {
    const {
      iid,
      author,
      source_branch,
      target_branch,
      merge_status,
      created_at
    } = mr;
    const disabled = merge_status !== "can_be_merged";
    const _time = dayjs(created_at).format("YYYY/MM/DD HH:mm");
    prompt[0].choices.push({
      name: `${green(iid + "\uFF1A")} \u8BF7\u6C42\u5408\u5E76 ${green(source_branch)} \u5230 ${green(target_branch)} ${disabled ? red("[ \u6709\u51B2\u7A81\u6216\u4E0D\u9700\u8981\u5408\u5E76 ]") : ""} | ${yellow(author.name)} | ${blue(_time)}`,
      value: iid,
      checked: false
    });
  });
  const { iids, accept } = await inquirer.prompt(prompt);
  if (iids.length === 0) {
    echo(yellow("\u6CA1\u6709\u9009\u62E9\u5408\u5E76\u8BF7\u6C42\u8BB0\u5F55\uFF0C\u8FDB\u7A0B\u5DF2\u9000\u51FA"));
    process.exit(0);
  }
  for (const iid of iids) {
    const { source_branch, target_branch } = mrList.find((item) => item.iid === iid);
    if (accept === "\u67E5\u770B\u8BE6\u60C5") {
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
      const notes = (await getMergeRequestNotesList({
        token,
        iid
      }) || []).filter((note) => !note.system).map((note) => ({
        body: green(note.body),
        name: yellow(note.author.name),
        date: blue(dayjs(note["updated_at"]).format("YYYY/MM/DD HH:mm:ss"))
      }));
      echo(magenta("\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"));
      echo(magenta("\u8BC4\u8BBA\u5217\u8868"));
      echo(columnify(notes, {
        columns: ["body", "name", "date"]
      }));
    } else if (accept === "\u5220\u9664") {
      await deleteMergeRequest({ token, iid });
      opt.postmsg && sendGroupMessage(`\u4EE3\u7801\u5199\u7684\u5F88\u68D2\u4E86\uFF0C\u53EF\u4EE5\u7A0D\u5FAE\u518D\u4F18\u5316\u4E00\u4E0B\uFF0C${appName}\u9879\u76EE${source_branch}\u5408\u5E76\u5230${target_branch}\u8BF7\u6C42ID${iid}\u5DF2\u5220\u9664`);
      echo(green(`\u5408\u5E76\u8BF7\u6C42${iid}\uFF1A\u5DF2\u5220\u9664`));
    } else if (accept === "\u5173\u95ED") {
      await updateMergeRequest({
        token,
        iid,
        data: { state_event: "close" }
      });
      opt.postmsg && sendGroupMessage(`\u4EE3\u7801\u5199\u7684\u5F88\u68D2\u4E86\uFF0C\u53EF\u4EE5\u7A0D\u5FAE\u518D\u4F18\u5316\u4E00\u4E0B\uFF0C${appName}\u9879\u76EE${source_branch}\u5408\u5E76\u5230${target_branch}\u8BF7\u6C42ID${iid}\u5DF2\u6682\u65F6\u5173\u95ED`);
      echo(green(`\u5408\u5E76\u8BF7\u6C42${iid}\uFF1A\u5DF2\u5173\u95ED`));
    } else if (accept === "\u8BC4\u8BBA") {
      const { note } = await inquirer.prompt({
        type: "input",
        name: "note",
        message: "\u8BF7\u8F93\u5165\u8BC4\u8BBA\u5185\u5BB9",
        default: "",
        transformer: (val) => val.trim(),
        validate: (val) => !val ? "\u8BF7\u8F93\u5165\u53EF\u7528\u8BC4\u8BBA" : true
      });
      await createMergeRequestNotes({ token, iid, body: note });
      echo(green("\u5DF2\u63D0\u4EA4"));
    }
  }
});
program.parse(process.argv);
