'use strict';

const sh = require("shelljs");
const ora = require("ora");
const { setCommandCache } = require("./cache/commandCache");
const getCommandMessage = require("./git/getCommandMessage");
const { setLog } = require("./cache/log");
const { error, success, warning } = require("./utils/colors");
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
  return new Promise((resolve, reject) => {
    const returns = [];
    if (list.length === 0)
      reject("\u6307\u4EE4\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A");
    list = JSON.parse(JSON.stringify(list));
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
        let _execFunction = require(cmd.module);
        if (cmd.entry)
          _execFunction = _execFunction[cmd.entry];
        try {
          spinner.start(success(cfg.processing || "\u6B63\u5728\u5904\u7406"));
          await _execFunction(cmd.options);
          const _message = cfg.success || "\u5904\u7406\u5B8C\u6210";
          if (_message) {
            spinner.succeed(success(_message));
            cfg.postmsg && postMessage(_message);
          }
          cb && cb();
        } catch (err) {
          if (cfg.kill) {
            const rest = JSON.parse(JSON.stringify(list));
            if (!cfg.again) {
              rest.shift();
            } else if (cfg.again !== true) {
              rest.splice(0, 1, cfg.again);
            }
            cb && cb(true);
            setCommandCache(rest);
            if (!cfg.stdio || typeof cfg.stdio === "string" && ["ignore"].includes(cfg.stdio)) {
              spinner.fail(error(err));
            }
            spinner.fail(error(cfg.fail || "\u51FA\u9519\u4E86\uFF01\u6307\u4EE4 " + cmd + " \u6267\u884C\u5931\u8D25\uFF0C\u4E2D\u65AD\u4E86\u8FDB\u7A0B"));
            cfg.postmsg && postMessage("\u51FA\u9519\u4E86\uFF01\u6307\u4EE4 " + cmd + " \u6267\u884C\u5931\u8D25\uFF0C\u4E2D\u65AD\u4E86\u8FDB\u7A0B");
            rest.length > 0 && spinner.fail(error("\u8BF7\u5904\u7406\u76F8\u5173\u95EE\u9898\u4E4B\u540E\u8F93\u5165gitm continue\u7EE7\u7EED"));
            sh.exit(1);
          } else {
            const _message = cfg.fail || "\u6307\u4EE4 " + cmd + " \u6267\u884C\u5931\u8D25";
            _message && spinner.warn(warning(_message));
          }
        }
      } else {
        const [client, ...argv] = cmd.split(" ");
        const msg = getCommandMessage(cmd);
        spinner.start(success(cfg.processing || msg.processing || "\u6B63\u5728\u5904\u7406"));
        const program = spawnSync(client, argv, cfg);
        const { status, stderr } = program;
        let { stdout } = program;
        try {
          stdout = JSON.parse(stdout);
        } catch (e) {
        }
        returns.push({
          code: status,
          out: stdout,
          err: stderr,
          cfg,
          cmd
        });
        if (status !== 0)
          setLog({
            command,
            code: status,
            out: stdout,
            err: stderr
          });
        if (status !== 0 && cfg.kill) {
          const rest = JSON.parse(JSON.stringify(list));
          if (!cfg.again) {
            rest.shift();
          } else if (cfg.again !== true) {
            rest.splice(0, 1, cfg.again);
          }
          cb && cb(true);
          setCommandCache(rest);
          if (!cfg.stdio || typeof cfg.stdio === "string" && ["ignore"].includes(cfg.stdio)) {
            spinner.fail(error(stderr));
          }
          spinner.fail(error(cfg.fail || msg.fail || "\u51FA\u9519\u4E86\uFF01\u6307\u4EE4 " + cmd + " \u6267\u884C\u5931\u8D25\uFF0C\u4E2D\u65AD\u4E86\u8FDB\u7A0B"));
          cfg.postmsg && postMessage("\u51FA\u9519\u4E86\uFF01\u6307\u4EE4 " + cmd + " \u6267\u884C\u5931\u8D25\uFF0C\u4E2D\u65AD\u4E86\u8FDB\u7A0B");
          rest.length > 0 && spinner.fail(error("\u8BF7\u5904\u7406\u76F8\u5173\u95EE\u9898\u4E4B\u540E\u8F93\u5165gitm continue\u7EE7\u7EED"));
          sh.exit(1);
        } else {
          if (status === 0) {
            const _message = cfg.success || msg.success;
            if (_message) {
              spinner.succeed(success(_message));
              cfg.postmsg && postMessage(_message);
            }
          } else {
            const _message = cfg.fail || msg.fail || "\u6307\u4EE4 " + cmd + " \u6267\u884C\u5931\u8D25";
            _message && spinner.warn(warning(_message));
          }
          cb && cb();
        }
      }
    });
  });
}
module.exports = {
  wait,
  queue
};
