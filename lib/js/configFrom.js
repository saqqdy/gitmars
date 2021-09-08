"use strict";const e=require("shelljs"),r=require("./gitRevParse"),{root:s}=r();var t=e.test("-f",s+"/.gitmarsrc")?1:e.test("-f",s+"/gitmarsconfig.json")?2:0;module.exports=t;
