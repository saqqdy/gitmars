#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.function.name");

var program = require('commander');

var sh = require('shelljs');

var runJenkins = require('./js/runJenkins');

program.name('gitm build').usage('<project>').arguments('<project>').description('构建Jenkins').option('-e, --env [env]', '需要构建的环境，可选dev、prod、bug、all', 'dev').option('-a, --app [app]', '需要构建的应用', 'all').action(function (project, opt) {
  runJenkins({
    env: opt.env,
    project: project,
    app: opt.app
  });
});
program.parse(process.argv);