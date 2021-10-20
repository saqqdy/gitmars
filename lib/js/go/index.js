'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const sh = require("shelljs");
const { getCurrent } = require("../index");
const getCommand = require("./getCommand");
const cleanConfig = require("./cleanConfig");
const combineConfig = require("../../conf/combine");
const endConfig = require("../../conf/end");
const updateConfig = require("../../conf/update");
const branchConfig = require("../../conf/branch");
const buildConfig = require("../../conf/build");
const startConfig = require("../../conf/start");
const copyConfig = require("../../conf/copy");
const getConfig = require("../../conf/get");
const saveConfig = require("../../conf/save");
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
const current = getCurrent();
const branchPrefix = current.split("/")[0];
const functionBuanchs = ["feature", "bugfix", "support"];
const start = async () => {
  const config = cleanConfig(startConfig);
  const command = "gitm start " + await getCommand(config);
  sh.exec(command);
};
const combine = async () => {
  const requiredOptions = [];
  let delOptions = [], delArgs = [], requiredArgs = [];
  if (!functionBuanchs.includes(branchPrefix)) {
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
  const config = cleanConfig(combineConfig, {
    delOptions,
    requiredOptions,
    delArgs,
    requiredArgs
  });
  const command = "gitm combine " + await getCommand(config);
  sh.exec(command);
};
const end = async () => {
  let delArgs = [], requiredArgs = [];
  if (!functionBuanchs.includes(branchPrefix)) {
    requiredArgs = ["type", "name"];
  } else {
    delArgs = ["type", "name"];
  }
  const config = cleanConfig(endConfig, { delArgs, requiredArgs });
  const command = "gitm end " + await getCommand(config);
  sh.exec(command);
};
const update = async () => {
  let delArgs = [], requiredArgs = [];
  if (!functionBuanchs.includes(branchPrefix)) {
    requiredArgs = ["type", "name"];
  } else {
    delArgs = ["type", "name"];
  }
  const config = cleanConfig(updateConfig, { delArgs, requiredArgs });
  const command = "gitm update " + await getCommand(config);
  sh.exec(command);
};
const branch = async () => {
  const config = cleanConfig(branchConfig);
  const command = "gitm branch " + await getCommand(config);
  sh.exec(command);
};
const build = async () => {
  const config = cleanConfig(buildConfig);
  const command = "gitm build " + await getCommand(config);
  sh.exec(command);
};
const copy = async () => {
  const config = cleanConfig(copyConfig);
  const command = "gitm copy " + await getCommand(config);
  sh.exec(command);
};
const get = async () => {
  const config = cleanConfig(getConfig);
  const command = "gitm get " + await getCommand(config);
  sh.exec(command);
};
const save = async () => {
  const config = cleanConfig(saveConfig);
  const command = "gitm save " + await getCommand(config);
  sh.exec(command);
};
const revert = async () => {
  const config = cleanConfig(revertConfig);
  const command = "gitm revert " + await getCommand(config);
  sh.exec(command);
};
const link = async () => {
  const config = cleanConfig(linkConfig);
  const command = "gitm link " + await getCommand(config);
  sh.exec(command);
};
const unlink = async () => {
  const config = cleanConfig(unlinkConfig);
  const command = "gitm unlink " + await getCommand(config);
  sh.exec(command);
};
const postmsg = async () => {
  const config = cleanConfig(postmsgConfig);
  const command = "gitm postmsg " + await getCommand(config);
  sh.exec(command);
};
const admin = {
  create: async () => {
    const config = cleanConfig(adminCreateConfig);
    const command = "gitm admin create " + await getCommand(config);
    sh.exec(command);
  },
  publish: async () => {
    const config = cleanConfig(adminPublishConfig);
    const command = "gitm admin publish " + await getCommand(config);
    sh.exec(command);
  },
  update: async () => {
    const config = cleanConfig(adminUpdateConfig);
    const command = "gitm admin update " + await getCommand(config);
    sh.exec(command);
  },
  clean: async () => {
    const config = cleanConfig(adminCleanConfig);
    const command = "gitm admin clean " + await getCommand(config);
    sh.exec(command);
  }
};

exports.admin = admin;
exports.branch = branch;
exports.build = build;
exports.combine = combine;
exports.copy = copy;
exports.end = end;
exports.get = get;
exports.link = link;
exports.postmsg = postmsg;
exports.revert = revert;
exports.save = save;
exports.start = start;
exports.unlink = unlink;
exports.update = update;
