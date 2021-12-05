'use strict';

const ora = require("ora");
const extend = require("js-cool/lib/extend");
const { setCommandCache } = require("./cache/commandCache");
const getCommandMessage = require("./git/getCommandMessage");
const { setLog } = require("./cache/log");
const { green, yellow, red } = require("colors");
const { postMessage } = require("./utils/message");
const { spawnSync } = require("./spawn");
function wait(list, fun) {
  if (list.length === 0) {
    fun();
    return;
  } else {
    fun(list[0], (kill = false) => {
      if (kill)
        return;
      list.shift();
      wait(list, fun);
    });
  }
}
function queue(list) {
  const spinner = ora();
  function onSuccess(msg, cfg, cb) {
    const _message = cfg.success || msg.success || "\u5904\u7406\u5B8C\u6210";
    if (_message) {
      spinner.succeed(green(_message));
      cfg.postmsg && postMessage(_message);
    }
    cb && cb();
  }
  function onError(list2, cmd, err, msg, cfg, cb) {
    if (cfg.kill) {
      cb && cb(true);
      const rest = extend(true, [], list2);
      if (!cfg.again) {
        rest.shift();
      } else if (cfg.again !== true) {
        rest.splice(0, 1, cfg.again);
      }
      setCommandCache(rest);
      if (!cfg.stdio || typeof cfg.stdio === "string" && ["ignore"].includes(cfg.stdio)) {
        spinner.fail(red(err));
      }
      spinner.fail(red(cfg.fail || msg.fail || "\u51FA\u9519\u4E86\uFF01\u6307\u4EE4 " + cmd + " \u6267\u884C\u5931\u8D25\uFF0C\u4E2D\u65AD\u4E86\u8FDB\u7A0B"));
      cfg.postmsg && postMessage("\u51FA\u9519\u4E86\uFF01\u6307\u4EE4 " + cmd + " \u6267\u884C\u5931\u8D25\uFF0C\u4E2D\u65AD\u4E86\u8FDB\u7A0B");
      rest.length > 0 && spinner.fail(red("\u8BF7\u5904\u7406\u76F8\u5173\u95EE\u9898\u4E4B\u540E\u8F93\u5165gitm continue\u7EE7\u7EED"));
      process.exit(1);
    } else {
      const _message = cfg.fail || msg.fail || "\u6307\u4EE4 " + cmd + " \u6267\u884C\u5931\u8D25";
      _message && spinner.warn(yellow(_message));
      cb && cb();
    }
  }
  return new Promise((resolve, reject) => {
    const returns = [];
    if (list.length === 0)
      reject("\u6307\u4EE4\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A");
    list = extend(true, [], list);
    wait(list, async (command, cb) => {
      let cfg = {
        stdio: "ignore",
        postmsg: false,
        kill: true,
        again: false
      }, cmd;
      if (command instanceof Object) {
        cfg = Object.assign(cfg, command.config || {});
        cmd = command.cmd;
      } else {
        cmd = command;
      }
      if (!cmd) {
        spinner.stop();
        resolve(returns);
      } else if (typeof cmd === "object") {
        let status = 0, stdout, stderr, _execFunction = require(cmd.module);
        if (cmd.entry)
          _execFunction = _execFunction[cmd.entry];
        try {
          spinner.start(green(cfg.processing || "\u6B63\u5728\u5904\u7406"));
          stdout = await _execFunction(cmd.options);
          onSuccess({}, cfg, cb);
        } catch (err) {
          status = 1;
          stderr = err;
          onError(list, cmd, err, {}, cfg, cb);
        }
        returns.push({
          status,
          stdout,
          stderr,
          cfg,
          cmd
        });
      } else {
        const [client, ...argv] = cmd.replace(/\s+/g, " ").split(" ");
        const msg = getCommandMessage(cmd);
        spinner.start(green(cfg.processing || msg.processing || "\u6B63\u5728\u5904\u7406"));
        const program = spawnSync(client, argv, cfg);
        const { status, stderr } = program;
        let { stdout } = program;
        try {
          stdout = JSON.parse(stdout);
        } catch (e) {
        }
        returns.push({
          status,
          stdout,
          stderr,
          cfg,
          cmd
        });
        if (status !== 0)
          setLog({
            command,
            status,
            stdout,
            stderr
          });
        if (status !== 0) {
          onError(list, cmd, stderr, msg, cfg, cb);
        } else {
          onSuccess(msg, cfg, cb);
        }
      }
    });
  });
}
module.exports = {
  wait,
  queue
};
