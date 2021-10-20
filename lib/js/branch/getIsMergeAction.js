"use strict";const{getCurrent:t,getLogs:e}=require("../index");module.exports=function(){const n=t(),r=e({limit:1,branches:n});return(r[0]["%P"]?r[0]["%P"].split(" "):[]).length>1};
