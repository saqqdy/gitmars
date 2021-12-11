'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const { spawnSync } = require("../spawn");
const { debug } = require("../utils/debug");
const getCurrentBranch = require("../git/getCurrentBranch");
const getCommand = require("./getCommand");
const cleanConfigSet = require("./cleanConfigSet");
const combineConfig = require("../../conf/combine");
const endConfig = require("../../conf/end");
const updateConfig = require("../../conf/update");
const undoConfig = require("../../conf/undo");
const redoConfig = require("../../conf/redo");
const branchConfig = require("../../conf/branch");
const buildConfig = require("../../conf/build");
const startConfig = require("../../conf/start");
const copyConfig = require("../../conf/copy");
const getConfig = require("../../conf/get");
const saveConfig = require("../../conf/save");
const cleanbranchConfig = require("../../conf/cleanbranch");
const cleanConfig = require("../../conf/clean");
const revertConfig = require("../../conf/revert");
const linkConfig = require("../../conf/link");
const unlinkConfig = require("../../conf/unlink");
const postmsgConfig = require("../../conf/postmsg");
const {
  create: adminCreateConfig,
  publish: adminPublishConfig,
  update: adminUpdateConfig,
  clean: adminCleanConfig
} = require("../../conf/admin");
const current = getCurrentBranch();
const branchPrefix = current.split("/")[0];
const functionBranches = ["feature", "bugfix", "support"];
const start = async () => {
  const config = cleanConfigSet(startConfig);
  const command = "start " + await getCommand(config);
  debug("start", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const combine = async () => {
  const requiredOptions = [];
  let delOptions = [], delArgs = [], requiredArgs = [];
  if (!functionBranches.includes(branchPrefix)) {
    delOptions = ["--as-feature", "--no-bugfix"];
    requiredArgs = ["type", "name"];
  } else {
    delArgs = ["type", "name"];
    switch (branchPrefix) {
      case "feature":
        delOptions = ["--as-feature"];
        break;
      case "support":
        delOptions = ["--as-feature"];
        break;
    }
  }
  const config = cleanConfigSet(combineConfig, {
    delOptions,
    requiredOptions,
    delArgs,
    requiredArgs
  });
  const command = "combine " + await getCommand(config);
  debug("combine", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const end = async () => {
  let delArgs = [], requiredArgs = [];
  if (!functionBranches.includes(branchPrefix)) {
    requiredArgs = ["type", "name"];
  } else {
    delArgs = ["type", "name"];
  }
  const config = cleanConfigSet(endConfig, { delArgs, requiredArgs });
  const command = "end " + await getCommand(config);
  debug("end", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const update = async () => {
  let delArgs = [], requiredArgs = [];
  if (!functionBranches.includes(branchPrefix)) {
    requiredArgs = ["type", "name"];
  } else {
    delArgs = ["type", "name"];
  }
  const config = cleanConfigSet(updateConfig, { delArgs, requiredArgs });
  const command = "update " + await getCommand(config);
  debug("update", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const undo = async () => {
  const config = cleanConfigSet(undoConfig);
  const command = "undo " + await getCommand(config);
  debug("undo", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const redo = async () => {
  const config = cleanConfigSet(redoConfig);
  const command = "redo " + await getCommand(config);
  debug("redo", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const branch = async () => {
  const config = cleanConfigSet(branchConfig);
  const command = "branch " + await getCommand(config);
  debug("branch", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const build = async () => {
  const config = cleanConfigSet(buildConfig);
  const command = "build " + await getCommand(config);
  debug("build", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const copy = async () => {
  const config = cleanConfigSet(copyConfig);
  const command = "copy " + await getCommand(config);
  debug("copy", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const get = async () => {
  const config = cleanConfigSet(getConfig);
  const command = "get " + await getCommand(config);
  debug("get", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const save = async () => {
  const config = cleanConfigSet(saveConfig);
  const command = "save " + await getCommand(config);
  debug("save", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const cleanbranch = async () => {
  const config = cleanConfigSet(cleanbranchConfig);
  const command = "cleanbranch " + await getCommand(config);
  debug("cleanbranch", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const clean = async () => {
  const config = cleanConfigSet(cleanConfig);
  const command = "clean " + await getCommand(config);
  debug("clean", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const revert = async () => {
  const config = cleanConfigSet(revertConfig);
  const command = "revert " + await getCommand(config);
  debug("revert", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const link = async () => {
  const config = cleanConfigSet(linkConfig);
  const command = "link " + await getCommand(config);
  debug("link", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const unlink = async () => {
  const config = cleanConfigSet(unlinkConfig);
  const command = "unlink " + await getCommand(config);
  debug("unlink", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const postmsg = async () => {
  const config = cleanConfigSet(postmsgConfig);
  const command = "postmsg " + await getCommand(config);
  debug("postmsg", command);
  spawnSync("gitm", command.split(" "), { stdio: "inherit" });
};
const admin = {
  create: async () => {
    const config = cleanConfigSet(adminCreateConfig);
    const command = "admin create " + await getCommand(config);
    debug("admin create", command);
    spawnSync("gitm", command.split(" "), { stdio: "inherit" });
  },
  publish: async () => {
    const config = cleanConfigSet(adminPublishConfig);
    const command = "admin publish " + await getCommand(config);
    debug("admin publish", command);
    spawnSync("gitm", command.split(" "), { stdio: "inherit" });
  },
  update: async () => {
    const config = cleanConfigSet(adminUpdateConfig);
    const command = "admin update " + await getCommand(config);
    debug("admin update", command);
    spawnSync("gitm", command.split(" "), { stdio: "inherit" });
  },
  clean: async () => {
    const config = cleanConfigSet(adminCleanConfig);
    const command = "admin clean " + await getCommand(config);
    debug("admin clean", command);
    spawnSync("gitm", command.split(" "), { stdio: "inherit" });
  }
};

exports.admin = admin;
exports.branch = branch;
exports.build = build;
exports.clean = clean;
exports.cleanbranch = cleanbranch;
exports.combine = combine;
exports.copy = copy;
exports.end = end;
exports.get = get;
exports.link = link;
exports.postmsg = postmsg;
exports.redo = redo;
exports.revert = revert;
exports.save = save;
exports.start = start;
exports.undo = undo;
exports.unlink = unlink;
exports.update = update;
