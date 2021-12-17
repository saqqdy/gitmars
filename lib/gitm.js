#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const { version } = require("../package.json");
const sh = require("shelljs");
const { green } = require("colors");
const { spawnSync } = require("./core/spawn");
const echo = require("./core/utils/echo");
if (!sh.which("git")) {
  echo("Gitmars\u53EA\u80FD\u5728git\u73AF\u5883\u4E0B\u6267\u884C\uFF0C\u8BF7\u5148\u5B89\u88C5git");
  process.exit(1);
}
program.version(`	
 e88~~   ,e,   d8                                         
d888      "  _d88__ 888-~88e-~88e   /~~~8e  888-~  d88~ 
8888 __  888  888   888  888  888       88b 888    C888   
8888   | 888  888   888  888  888  e88~-888 888     Y88b  
Y888   | 888  888   888  888  888 C888  888 888      888D 
 "88__/  888  "88_/ 888  888  888  "88_-888 888    _88P  
                                                          
v${version}, powered by saqqdy
`, "-v, --version", "\u67E5\u770Bgitmars\u7248\u672C");
program.name("gitm").usage("[command] options").command("init", "\u521D\u59CB\u5316gitmars\u914D\u7F6E").command("config [options]", "\u67E5\u770B/\u8BBE\u7F6Egitmars\u7684\u914D\u7F6E\u9879").command("combine", "\u5206\u652F\u9636\u6BB5\u63D0\u6D4B").alias("cb").command("start <type> <name>", "\u521B\u5EFAbugfix\u5206\u652F\u3001\u521B\u5EFA/\u5408\u5E76release\u5206\u652F").alias("st").command("end <type> <name>", "\u5B8C\u6210\u5F00\u53D1\u67D0\u9879\u529F\u80FD").alias("ed").command("update <type> <name>", "\u66F4\u65B0bug\u4EFB\u52A1\u5206\u652F\u3001\u66F4\u65B0feature\u529F\u80FD\u5F00\u53D1\u5206\u652F").alias("up").command("branch", "\u5217\u51FA\u5206\u652F\u5217\u8868").alias("bh").command("save", "\u6682\u5B58\u5F53\u524D\u5206\u652F\u6587\u4EF6").alias("sv").command("get", "\u6062\u590D\u6682\u5B58\u533A\u6700\u8FD1\u4E00\u6B21\u6682\u5B58\u7684\u6587\u4EF6").alias("gt").command("cleanbranch", "\u6E05\u7406\u5408\u5E76\u8FC7\u7684\u529F\u80FD\u5206\u652F").alias("clb").command("copy <id>", "\u7B80\u5316git\u7684cherry-pick\u64CD\u4F5C").alias("cp").command("merge <name>", "\u5408\u5E76\u4EE3\u7801").alias("mg").command("continue", "\u7EE7\u7EED\u672A\u5B8C\u6210\u7684\u64CD\u4F5C").alias("ct").command("revert", "\u64A4\u9500\u63D0\u4EA4").alias("rt").command("upgrade", "\u5347\u7EA7gitmars").alias("ug").command("build", "\u6784\u5EFAJenkins").alias("bd").command("suggest", "\u64CD\u4F5C\u5EFA\u8BAE").alias("sg").command("approve", "\u5904\u7406\u8FDC\u7A0B\u5408\u5E76\u8BF7\u6C42").alias("ap").command("review", "review\u8FDC\u7A0B\u4EE3\u7801").alias("rv").command("status", "\u67E5\u770B\u5206\u652F\u72B6\u6001").command("ui", "\u542F\u52A8\u7F51\u9875\u7248gitmars").command("unlink", "\u89E3\u9664\u8F6F\u94FE\u63A5").command("link", "\u8F6F\u94FE\u63A5").command("clean", "\u6E05\u9664\u7F13\u5B58").command("postmsg", "\u63A8\u9001\u6D88\u606F").command("permission", "\u63D0\u4EA4\u6743\u9650").command("hook", "git\u94A9\u5B50\u6307\u4EE4").command("undo", "\u64A4\u56DE\u4E3B\u5E72\u5206\u652F\u4E0A\u7684\u63D0\u4EA4").alias("ud").command("redo", "\u6062\u590D\u64A4\u56DE\u7684\u4EE3\u7801\u91CD\u65B0\u4E0A\u7EBF").alias("rd").command("run", "git\u94A9\u5B50\u8FD0\u884C\u6307\u4EE4").command("log", "\u67E5\u8BE2\u65E5\u5FD7").command("go", "\u667A\u80FD\u731C\u6D4B\u4F60\u8981\u6267\u884C\u7684\u52A8\u4F5C").command("admin <command>", "\u7BA1\u7406\u5458\u529F\u80FD\uFF0C\u5305\u542B\u5BF9\u53D1\u7248\u5206\u652Fbugfix\u3001release\u7684\u64CD\u4F5C");
program.on("--help", function() {
  echo("\u4F7F\u7528\u6848\u4F8B:");
  echo("  $ gitm init");
  echo("  $ gitm --help");
  echo("  $ gitm -h");
});
program.on("command:*", function(types, opts) {
  const cmd = [
    "init",
    "config",
    "combine",
    "cb",
    "start",
    "st",
    "end",
    "ed",
    "update",
    "up",
    "branch",
    "bh",
    "save",
    "sv",
    "get",
    "gt",
    "cleanbranch",
    "clb",
    "copy",
    "cp",
    "merge",
    "mg",
    "continue",
    "ct",
    "revert",
    "rt",
    "upgrade",
    "ug",
    "build",
    "bd",
    "suggest",
    "sg",
    "approve",
    "ap",
    "review",
    "rv",
    "status",
    "ui",
    "unlink",
    "link",
    "clean",
    "postmsg",
    "permission",
    "hook",
    "undo",
    "ud",
    "redo",
    "rd",
    "run",
    "log",
    "go",
    "admin"
  ];
  if (!cmd.includes(types[0])) {
    opts = opts.map((type) => type.indexOf("-") === 0 || /^\w+$/.test(type) ? type : '"' + type + '"');
    const arr = types.concat(opts);
    echo(green(`Gitmars\u6CA1\u6709\u63D0\u4F9B\u201Cgitm ${types[0]}\u201D\u8FD9\u4E2A\u6307\u4EE4\uFF0C\u5DF2\u900F\u4F20\u5230git\u6267\u884C\uFF0C\u4E0B\u9762\u662F\u6267\u884C\u7ED3\u679C\uFF1A`));
    spawnSync("git", arr, { stdio: "inherit" });
  }
});
program.parse(process.argv);
