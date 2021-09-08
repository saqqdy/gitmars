#!/usr/bin/env node
"use strict";const{program:r}=require("commander"),{options:e,args:o}=require("./conf/run"),{createArgs:s}=require("./js/tools"),a=require("./js/hook/run");r.name("gitm run").usage("[command]").description("git钩子运行指令"),o.length>0&&r.arguments(s(o)),e.forEach((e=>{r.option(e.flags,e.description,e.defaultValue)})),r.action(((r,e,o)=>{a(r,e,o)})),r.parse(process.argv);
