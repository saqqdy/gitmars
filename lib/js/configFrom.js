"use strict";const e=require("shelljs"),s=require("./gitRevParse"),{root:t}=s();module.exports=e.test("-f",t+"/.gitmarsrc")?1:e.test("-f",t+"/gitmarsconfig.json")?2:0;
