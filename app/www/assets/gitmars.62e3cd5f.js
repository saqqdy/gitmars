var e=Object.defineProperty,o=Object.defineProperties,a=Object.getOwnPropertyDescriptors,t=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,n=Object.prototype.propertyIsEnumerable,i=(o,a,t)=>a in o?e(o,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[a]=t,l=(e,o)=>{for(var a in o||(o={}))r.call(o,a)&&i(e,a,o[a]);if(t)for(var a of t(o))n.call(o,a)&&i(e,a,o[a]);return e},d=(e,t)=>o(e,a(t));import{u as s,b as u,o as m}from"./vendor/vue-router_4.0.12.js.e0928a4d.js";import{q as c,_ as p,a7 as g,w as f,R as b,x as v,y,B as j,F as h,a1 as C,a3 as x,H as V,M as _,O as w,u as q,r as k,c as O,U as S,G as E,d as A,j as z,al as M,z as U,ag as T,ah as I,E as $}from"./vendor/vue_3.2.20.js.843b181b.js";import{X as D}from"./index.0db6171c.js";import{j as L,i as P,l as N}from"./vendor/element-plus_1.1.0-beta.24.js.9ec41c30.js";import{u as B}from"./use-current-instance.44876874.js";import{_ as G,T as X,S as H}from"./index.cbd6d2cf.js";import"./vendor/lodash_4.17.21.js.96bc0cd8.js";import"./vendor/xterm_4.14.1.js.4d8f2388.js";import"./vendor/dayjs_1.10.7.js.de411334.js";import"./vendor/async-validator_4.0.7.js.656181ea.js";import"./vendor/resize-observer-polyfill_1.5.1.js.3b3964c6.js";import"./vendor/axios_0.23.0.js.3f49b9ab.js";import"./vendor/qs_6.10.1.js.6d009611.js";import"./vendor/side-channel_1.0.4.js.cbb25fc8.js";import"./vendor/get-intrinsic_1.1.1.js.d604dad5.js";import"./vendor/has-symbols_1.0.2.js.208f1d3f.js";import"./vendor/function-bind_1.1.1.js.34bf890b.js";import"./vendor/has_1.0.3.js.e7f09f2c.js";import"./vendor/call-bind_1.0.2.js.ad02ab55.js";import"./vendor/object-inspect_1.11.0.js.1111bad4.js";import"./vendor/js-cool_2.2.4.js.f9ee5fc3.js";import"./vendor/core-js_3.18.3.js.a64c1281.js";import"./vendor/uuid_8.3.2.js.8656f24a.js";import"./vendor/xterm-style_1.1.0.js.323fb105.js";import"./vendor/xterm-addon-fit_0.5.0.js.e3a24a28.js";import"./vendor/xterm-addon-search_0.8.1.js.d370edfa.js";import"./vendor/xterm-addon-web-links_0.4.0.js.e4a83512.js";import"./vendor/vuex_4.0.2.js.f8c5ab46.js";const F={class:"command-wrap"},R={class:"r"},W={class:"r"};const J=c(d(l({},{name:"Command",inheritAttrs:!1}),{props:{modelValue:{type:Object,default:()=>({options:[],args:[]}),required:!0},current:String},emits:["update:modelValue"],setup:function(e,{expose:o,emit:a}){const t=p(g(e.modelValue));return t.options.forEach((e=>{"value"in e||(e.value=null)})),t.args.forEach((e=>{"value"in e||(e.value=null)})),f(t,(e=>{a("update:modelValue",e)}),{deep:!0}),o({data:t}),(e,o)=>{const a=b("el-option"),r=b("el-select"),n=b("el-input"),i=b("el-checkbox");return v(),y("div",F,[j("ul",null,[(v(!0),y(h,null,C(q(t).args,(e=>(v(),y("li",{key:e.name},[x(V(e.name)+" ",1),j("div",R,[e.options?(v(),_(r,{modelValue:e.value,"onUpdate:modelValue":o=>e.value=o,key:e.name+"-arg",placeholder:e.required?"必填":"选填",clearable:""},{default:w((()=>[(v(!0),y(h,null,C(e.options,(e=>(v(),_(a,{key:e,label:e,value:e},null,8,["label","value"])))),128))])),_:2},1032,["modelValue","onUpdate:modelValue","placeholder"])):(v(),_(n,{modelValue:e.value,"onUpdate:modelValue":o=>e.value=o,key:e.name+"-arg",placeholder:e.required?"必填":"选填",clearable:""},null,8,["modelValue","onUpdate:modelValue","placeholder"]))])])))),128))]),j("ul",null,[(v(!0),y(h,null,C(q(t).options,(e=>(v(),y("li",{key:e.long},[x(V(e.description)+" ",1),j("div",W,[e.optional?(v(),y(h,{key:0},[e.options?(v(),_(r,{modelValue:e.value,"onUpdate:modelValue":o=>e.value=o,key:e.long+"-arg",placeholder:e.required?"必填":"选填",clearable:""},{default:w((()=>[(v(!0),y(h,null,C(e.options,(e=>(v(),_(a,{key:e,label:e,value:e},null,8,["label","value"])))),128))])),_:2},1032,["modelValue","onUpdate:modelValue","placeholder"])):(v(),_(n,{modelValue:e.value,"onUpdate:modelValue":o=>e.value=o,key:e.long+"-option",placeholder:e.required?"必填":"选填",clearable:""},null,8,["modelValue","onUpdate:modelValue","placeholder"]))],64)):(v(),_(i,{modelValue:e.value,"onUpdate:modelValue":o=>e.value=o,key:e.long+"-option-check"},null,8,["modelValue","onUpdate:modelValue"]))])])))),128))])])}}}));const K={class:"map-command-wrap"},Q=x("执行");const Y=c(d(l({},{name:"MapCommand",inheritAttrs:!1}),{props:{data:{type:Object,default:()=>({options:[],args:[]}),required:!1},value:{type:Object,default:()=>({options:[],args:[]}),required:!0},current:{type:String,default:"",required:!0}},emits:["exec"],setup:function(e,{expose:o,emit:a}){const t=e,r=k(""),{command:n,short:i}=g(t.value),l=O((()=>{let e=g(t.current).split("/");return["bugfix","feature","support"].includes(e[0])?{type:e[0],name:e[1]}:null})),d=()=>{a("exec",r.value)};return f((()=>t.value),(e=>{r.value=(({options:e,args:o})=>{let a=[],t=[],r=[];for(let n of e)if(null!==n.value){let e=n.short||n.long,o=n.value instanceof Array?n.value.join(" "):n.value;if(n.optional||!n.short){if(!o)continue;n.optional?(o=' "'+o+'"',n.defaultValue&&(o=' "'+n.defaultValue+'"'),t.push(e+o)):t.push(e)}else n.short&&(r.length>0&&(e=e.substr(1)),o&&r.push(e))}for(let n of o)n.value&&a.push(n.value);return`gitm ${n} ${a.join(" ")} ${r.join("")} ${t.join(" ")}`.replace(/[\s]{2,}/g," ")})(e)}),{deep:!0,immediate:!0}),o({curBranch:l,cmd:r,exec:d}),(e,o)=>{const a=b("v3-button");return v(),y("div",K,[j("span",null,V(r.value),1),S(a,{type:"primary",size:"small",onClick:E(d,["stop"]),plain:""},{default:w((()=>[Q])),_:1},8,["onClick"])])}}}));!function(e){const o={command:"admin",short:null,create:{command:"create",short:null,args:[{required:!0,name:"type",variadic:!1,validator:(e,o,a)=>{/\s+/.test(e)?a(new Error("请不要输入空格")):a()},description:"分支类型"}],options:[],validatorOpts:(e,o,a)=>{a()},validatorArgs:(e,o,a)=>{a()},transformOpts:(e,o,a)=>{a()},transformArgs:(e,o,a)=>{a()}},publish:{command:"publish",short:null,args:[{required:!0,name:"type",variadic:!1,validator:(e,o,a)=>{/\s+/.test(e)?a(new Error("请不要输入空格")):a()},description:"分支类型"}],options:[{flags:"-c, --combine",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"-c",long:"--combine",negate:!1,description:"是否把release代码同步到bug",defaultValue:!1,recommend:!1},{flags:"--use-rebase",required:!1,optional:!1,variadic:!1,mandatory:!1,long:"--use-rebase",negate:!1,description:"是否使用rebase方式更新，默认merge",defaultValue:!1,recommend:!1},{flags:"-p, --prod",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"-p",long:"--prod",negate:!1,description:"发布bug分支时，是否合并bug到master",defaultValue:!1,recommend:!1},{flags:"-b, --build [build]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-b",long:"--build",negate:!1,description:"构建应用",recommend:!0},{flags:"--postmsg",required:!1,optional:!1,variadic:!1,mandatory:!1,long:"--postmsg",negate:!1,description:"发送消息",defaultValue:!1,recommend:!1}],validatorOpts:(e,o,a)=>{e.includes("--combine")&&e.includes("--prod")?a(new Error("不能同时选择“把release合并到bug”和“合并bug到master”")):a()},validatorArgs:(e,o,a)=>{a()},transformOpts:(e,o,a)=>{a()},transformArgs:(e,o,a)=>{a()}},update:{command:"update",short:null,args:[{required:!0,name:"type",variadic:!1,validator:(e,o,a)=>{/\s+/.test(e)?a(new Error("请不要输入空格")):a()},description:"分支类型"}],options:[{flags:"--use-rebase",required:!1,optional:!1,variadic:!1,mandatory:!1,long:"--use-rebase",negate:!1,description:"是否使用rebase方式更新，默认merge",defaultValue:!1,recommend:!1},{flags:"-m, --mode [mode]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-m",long:"--mode",negate:!1,description:"出现冲突时，保留传入代码还是保留当前代码；1=采用当前 2=采用传入；默认为 0=手动处理。本参数不可与--use-rebase同时使用",defaultValue:0,recommend:!1},{flags:"--postmsg",required:!1,optional:!1,variadic:!1,mandatory:!1,long:"--postmsg",negate:!1,description:"发送消息",defaultValue:!1,recommend:!1}],validatorOpts:(e,o,a)=>{a()},validatorArgs:(e,o,a)=>{a()},transformOpts:(e,o,a)=>{a()},transformArgs:(e,o,a)=>{a()}},clean:{command:"clean",short:null,args:[{required:!0,name:"type",variadic:!1,validator:(e,o,a)=>{/\s+/.test(e)?a(new Error("请不要输入空格")):a()},description:"分支类型"}],options:[],validatorOpts:(e,o,a)=>{a()},validatorArgs:(e,o,a)=>{a()},transformOpts:(e,o,a)=>{a()},transformArgs:(e,o,a)=>{a()}}};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.admin=o)}("undefined"!=typeof window?window:global);var Z=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"branch",short:"bh",args:[],options:[{flags:"-k, --key [keyword]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-k",long:"--key",negate:!1,description:"查询分支的关键词",defaultValue:null},{flags:"-r, --remote",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"-r",long:"--remote",negate:!1,description:"是否查询远程分支（deletes模式下改用于删除远程分支）默认只查询本地",defaultValue:!1},{flags:"-t, --type [type]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-t",long:"--type",negate:!1,description:"查询分支的类型，共有3种：feature、bugfix、support，不传则查询全部",defaultValue:null,options:["feature","bugfix","support"],value:""},{flags:"-d, --delete [branch]",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"-d",long:"--delete",negate:!1,description:"删除分支",defaultValue:null},{flags:"-D, --forcedelete [branch]",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"-D",long:"--forcedelete",negate:!1,description:"强行删除分支",defaultValue:null},{flags:"-u, --upstream [upstream]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-u",long:"--upstream",negate:!1,description:"设置与远程分支关联"}],validatorOpts:(e,o,a)=>{e.includes("--upstream")&&(e.includes("--key")||e.includes("--remote")||e.includes("--type")||e.includes("--delete")||e.includes("--forcedelete"))?a(new Error("使用绑定/取消绑定远程分支功能时，不能与其他功能混用")):!e.includes("--delete")&&!e.includes("--forcedelete")||!e.includes("--key")&&!e.includes("--type")?a():a(new Error("使用删除分支功能时，不能与查询分支功能混用"))},validatorArgs:(e,o,a)=>{a()},transformOpts:(e,o,a)=>{a()},transformArgs:(e,o,a)=>{a()}};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.branch=o)}("undefined"!=typeof window?window:global);var ee=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"build",short:"bd",args:[{required:!0,name:"project",variadic:!1,description:"项目名称"}],options:[{flags:"-e, --env [env]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-e",long:"--env",negate:!1,description:"构建环境，可选dev、prod、bug、all",defaultValue:"dev",recommend:!0,options:["dev","prod","bug","all"],value:"dev"},{flags:"-a, --app [app]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-a",long:"--app",negate:!1,description:"构建应用",defaultValue:"all",recommend:!0,value:"all"}]};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.build=o)}("undefined"!=typeof window?window:global);var oe=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"combine",short:"cb",args:[{required:!1,name:"type",variadic:!1,description:"分支类型",options:["feature","bugfix","support"],value:""},{required:!1,name:"name",variadic:!1,description:"分支名称(不带feature/bugfix前缀)"}],options:[{flags:"-d, --dev",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"-d",long:"--dev",negate:!1,description:"同步到dev环境",defaultValue:!1,value:!0,recommend:!0},{flags:"-p, --prod",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"-p",long:"--prod",negate:!1,description:"同步到prod环境",defaultValue:!1,value:!1,recommend:!1},{flags:"-b, --build [build]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-b",long:"--build",negate:!1,description:"构建应用",value:"all",recommend:!0},{flags:"-m, --commit <commit>",required:!0,optional:!0,variadic:!1,mandatory:!1,short:"-m",long:"--commit",negate:!1,description:"执行commit，需填写信息",defaultValue:"",recommend:!1},{flags:"-a, --add",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"-a",long:"--add",negate:!1,description:"执行add",defaultValue:!1,recommend:!1},{flags:"--no-bugfix",required:!1,optional:!1,variadic:!1,mandatory:!1,long:"--no-bugfix",negate:!0,description:"bug分支合并到release时不合并到bug分支",defaultValue:!0,recommend:!1},{flags:"--as-feature",required:!1,optional:!1,variadic:!1,mandatory:!1,long:"--as-feature",negate:!1,description:"bug分支合并到release",recommend:!1}],validatorOpts:(e,o,a)=>{e.includes("--dev")||e.includes("--prod")?e.includes("--add")&&!e.includes("--commit")||!e.includes("--add")&&e.includes("--commit")?a(new Error("add和commit需要同时选择")):a():a(new Error("合并dev或者prod必须至少选一个"))},validatorArgs:(e,o,a)=>{a()},transformOpts:(e,o,a)=>{a()},transformArgs:(e,o,a)=>{a()}};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.combine=o)}("undefined"!=typeof window?window:global);var ae=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"continue",short:"ct",args:[],options:[{flags:"-l, --list",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"-l",long:"--list",negate:!1,description:"显示指令队列",defaultValue:!1}]};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.continue=o)}("undefined"!=typeof window?window:global);var te=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"copy",short:"cp",args:[{required:!0,name:"from",variadic:!1,validator:(e,o,a)=>{/\s+/.test(e)?a(new Error("请不要输入空格")):a()},description:"来源分支"},{required:!1,name:"commitid",variadic:!0,validator:(e,o,a)=>{a()},description:"提交记录ID"}],options:[{flags:"-k, --key [keyword]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-k",long:"--key",negate:!1,description:"模糊搜索commit信息关键词",defaultValue:""},{flags:"-a, --author [author]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-a",long:"--author",negate:!1,description:"提交者",defaultValue:""}],validatorOpts:(e,o,a)=>{a()},validatorArgs:(e,o,a)=>{a()},transformOpts:(e,o,a)=>{a()},transformArgs:(e,o,a)=>{a()}};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.copy=o)}("undefined"!=typeof window?window:global);var re=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"end",short:"ed",args:[{required:!1,name:"type",variadic:!1,description:"分支类型",options:["feature","bugfix","support"],value:""},{required:!1,name:"name",variadic:!1,description:"分支名称(不带feature/bugfix前缀)"}],options:[{flags:"--no-combine",required:!1,optional:!1,variadic:!1,mandatory:!1,long:"--no-combine",negate:!0,description:"不合并主干分支（请确保分支已经上线）",defaultValue:!0,recommend:!1},{flags:"--as-feature",required:!1,optional:!1,variadic:!1,mandatory:!1,long:"--as-feature",negate:!1,description:"bug分支合并到release",recommend:!1}],validatorOpts:(e,o,a)=>{a()},validatorArgs:(e,o,a)=>{a()},transformOpts:(e,o,a)=>{a()},transformArgs:(e,o,a)=>{a()}};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.end=o)}("undefined"!=typeof window?window:global);var ne=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"get",short:"gt",args:[{required:!1,name:"message",variadic:!1,validator:(e,o,a)=>{/\s+/.test(e)?a(new Error("请不要输入空格")):a()},description:"存取关键字"},{required:!1,name:"index",variadic:!1,description:"序号"}],options:[{flags:"-k, --keep [keep]",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"-k",long:"--keep",negate:!1,description:"保留暂存区不删除",defaultValue:!1}],validatorOpts:(e,o,a)=>{a()},validatorArgs:(e,o,a)=>{a()},transformOpts:(e,o,a)=>{a()},transformArgs:(e,o,a)=>{a()}};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.get=o)}("undefined"!=typeof window?window:global);var ie=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"go",short:"",args:[{required:!1,name:"command",variadic:!1,description:"指令名称",options:["combine","end","update","build","start","admin.publish","admin.update","admin.create","admin.clean","branch","copy","get","save","revert","link","unlink","postmsg"],value:""}],options:[]};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.go=o)}("undefined"!=typeof window?window:global);var le=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"hook",short:"hk",args:[{required:!1,name:"command",variadic:!1},{required:!1,name:"args",variadic:!0}],options:[{flags:"--no-verify",required:!1,optional:!1,variadic:!1,mandatory:!1,long:"--no-verify",negate:!0,description:"是否需要跳过校验权限",defaultValue:!1},{flags:"--lastet [lastet]",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"",long:"--lastet",negate:!1,description:"查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y",defaultValue:"7d"},{flags:"--limit [limit]",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"",long:"--limit",negate:!1,description:"最多查询的日志条数",defaultValue:20},{flags:"-t, --type <type>",required:!0,optional:!1,variadic:!1,mandatory:!1,short:"-t",long:"--type",negate:!1,description:"检测类型",defaultValue:""},{flags:"--branch [branch]",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"",long:"--branch",negate:!1,description:"要查询的分支",defaultValue:""}]};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.hook=o)}("undefined"!=typeof window?window:global);var de=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"link",short:null,args:[{required:!1,name:"name",variadic:!1,validator:(e,o,a)=>{/\s+/.test(e)?a(new Error("请不要输入空格")):a()},description:"包的名称"}],options:[]};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.link=o)}("undefined"!=typeof window?window:global);var se=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"log",short:"lg",args:[{required:!1,name:"branche",variadic:!1}],options:[{flags:"--lastet [lastet]",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"",long:"--lastet",negate:!1,description:"查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y",defaultValue:"7d"},{flags:"--limit [limit]",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"",long:"--limit",negate:!1,description:"最多查询的日志条数",defaultValue:20}]};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.log=o)}("undefined"!=typeof window?window:global);var ue=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"postmsg",short:null,args:[{required:!0,name:"message",variadic:!1}],options:[{flags:"-u, --url [url]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-u",long:"--url",negate:!1,description:"推送消息的api地址",defaultValue:""}],validatorOpts:(e,o,a)=>{a()},validatorArgs:(e,o,a)=>{a()},transformOpts:(e,o,a)=>{a()},transformArgs:(e,o,a)=>{a()}};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.postmsg=o)}("undefined"!=typeof window?window:global);var me=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"redo",short:"rd",args:[{required:!1,name:"commitid",variadic:!0,validator:(e,o,a)=>{a()},description:"需要撤销的ID"}],options:[{flags:"-b, --branch [branch]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-b",long:"--branch",negate:!1,description:"需要撤销的分支名",defaultValue:""},{flags:"-m, --mode [mode]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-m",long:"--mode",negate:!1,description:"针对撤销一次merge记录，需要传入类型：1 = 保留当前分支代码，2 = 保留传入代码",defaultValue:1}],validatorOpts:(e,o,a)=>{a()},validatorArgs:(e,o,a)=>{a()},transformOpts:(e,o,a)=>{a()},transformArgs:(e,o,a)=>{a()}};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.redo=o)}("undefined"!=typeof window?window:global);var ce=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"revert",short:"rt",args:[{required:!1,name:"commitid",variadic:!1,validator:(e,o,a)=>{a()},description:"需要撤销的ID"}],options:[{flags:"-n, --number [number]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-n",long:"--number",negate:!1,description:"撤销最后一次提交（或者撤销倒数第n次提交）",defaultValue:""},{flags:"-m, --mode [mode]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-m",long:"--mode",negate:!1,description:"针对撤销一次merge记录，需要传入类型：1 = 保留当前分支代码，2 = 保留传入代码",defaultValue:"",options:["1","2"],value:"1"}],validatorOpts:(e,o,a)=>{a()},validatorArgs:(e,o,a)=>{a()},transformOpts:(e,o,a)=>{a()},transformArgs:(e,o,a)=>{a()}};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.revert=o)}("undefined"!=typeof window?window:global);var pe=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"run",short:"",args:[{required:!1,name:"command",variadic:!1},{required:!1,name:"args",variadic:!0,description:"参数列表"}],options:[]};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.run=o)}("undefined"!=typeof window?window:global);var ge=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"save",short:"sv",args:[{required:!1,name:"message",variadic:!1,validator:(e,o,a)=>{/\s+/.test(e)?a(new Error("请不要输入空格")):a()},description:"存取关键字"}],options:[{flags:"-f, --force",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"-f",long:"--force",negate:!1,description:"没有版本的文件也暂存，这会执行git add .",defaultValue:!1}],validatorOpts:(e,o,a)=>{a()},validatorArgs:(e,o,a)=>{a()},transformOpts:(e,o,a)=>{a()},transformArgs:(e,o,a)=>{a()}};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.save=o)}("undefined"!=typeof window?window:global);var fe=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"start",short:"st",args:[{required:!0,name:"type",variadic:!1,description:"分支类型"},{required:!0,name:"name",variadic:!1,description:"分支名称(不带feature/bugfix前缀)"}],options:[{flags:"-t, --tag <tag>",required:!0,optional:!0,variadic:!1,mandatory:!1,short:"-t",long:"--tag",negate:!1,description:"从tag创建分支",defaultValue:"",recommend:!1}]};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.start=o)}("undefined"!=typeof window?window:global);var be=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"ui",short:null,args:[],options:[{flags:"-p, --port [port]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-p",long:"--port",negate:!1,description:"指定端口号",defaultValue:3e3,recommend:!1}]};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.ui=o)}("undefined"!=typeof window?window:global);var ve=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"undo",short:"ud",args:[{required:!1,name:"commitid",variadic:!0,validator:(e,o,a)=>{a()},description:"需要撤销的ID"}],options:[{flags:"-b, --branch [branch]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-b",long:"--branch",negate:!1,description:"需要撤销的分支名",defaultValue:""},{flags:"-m, --mode [mode]",required:!1,optional:!0,variadic:!1,mandatory:!1,short:"-m",long:"--mode",negate:!1,description:"针对撤销一次merge记录，需要传入类型：1 = 保留当前分支代码，2 = 保留传入代码",defaultValue:1}],validatorOpts:(e,o,a)=>{a()},validatorArgs:(e,o,a)=>{a()},transformOpts:(e,o,a)=>{a()},transformArgs:(e,o,a)=>{a()}};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.undo=o)}("undefined"!=typeof window?window:global);var ye=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"unlink",short:null,args:[{required:!1,name:"name",variadic:!1,validator:(e,o,a)=>{/\s+/.test(e)?a(new Error("请不要输入空格")):a()},description:"包的名称"}],options:[]};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.unlink=o)}("undefined"!=typeof window?window:global);var je=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"update",short:"up",args:[{required:!1,name:"type",variadic:!1,description:"分支类型",options:["feature","bugfix","support"],value:""},{required:!1,name:"name",variadic:!1,description:"分支名称(不带feature/bugfix前缀)"}],options:[{flags:"--use-merge",required:!1,optional:!1,variadic:!1,mandatory:!1,long:"--use-merge",negate:!1,description:"使用merge方式更新(默认merge)",defaultValue:!0,value:!0,recommend:!0},{flags:"--use-rebase",required:!1,optional:!1,variadic:!1,mandatory:!1,long:"--use-rebase",negate:!1,description:"使用rebase方式更新(默认merge)",defaultValue:!1,recommend:!0},{flags:"-a --all",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"-a",long:"--all",negate:!1,description:"更新本地所有bugfix、feature、support分支",defaultValue:!1,recommend:!1}]};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.update=o)}("undefined"!=typeof window?window:global);var he=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"});!function(e){const o={command:"upgrade",short:"ug",args:[{required:!1,name:"version",variadic:!1,validator:(e,o,a)=>{/\s+/.test(e)?a(new Error("请不要输入空格")):a()},description:"版本号"}],options:[{flags:"-m, --mirror",required:!1,optional:!1,variadic:!1,mandatory:!1,short:"-m",long:"--mirror",negate:!1,description:"是否使用淘宝镜像",defaultValue:!1}],validatorOpts:(e,o,a)=>{a()},validatorArgs:(e,o,a)=>{a()},transformOpts:(e,o,a)=>{a()},transformArgs:(e,o,a)=>{a()}};"object"==typeof exports&&"object"==typeof module?module.exports=o:"object"==typeof exports?exports.cmdConfig=o:(e.gitmarsCmdConfig||(e.gitmarsCmdConfig={}),e.gitmarsCmdConfig.upgrade=o)}("undefined"!=typeof window?window:global);const Ce={"../../../../lib/conf/admin.js":Z,"../../../../lib/conf/branch.js":ee,"../../../../lib/conf/build.js":oe,"../../../../lib/conf/combine.js":ae,"../../../../lib/conf/continue.js":te,"../../../../lib/conf/copy.js":re,"../../../../lib/conf/end.js":ne,"../../../../lib/conf/get.js":ie,"../../../../lib/conf/go.js":le,"../../../../lib/conf/hook.js":de,"../../../../lib/conf/link.js":se,"../../../../lib/conf/log.js":ue,"../../../../lib/conf/postmsg.js":me,"../../../../lib/conf/redo.js":ce,"../../../../lib/conf/revert.js":pe,"../../../../lib/conf/run.js":ge,"../../../../lib/conf/save.js":fe,"../../../../lib/conf/start.js":be,"../../../../lib/conf/ui.js":ve,"../../../../lib/conf/undo.js":ye,"../../../../lib/conf/unlink.js":je,"../../../../lib/conf/update.js":he,"../../../../lib/conf/upgrade.js":Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module"})};let xe={};for(let oo in Ce){let e=oo.replace(/^.+\/(\w+)\.js$/,"$1");if(!Object.keys(Ce[oo]).length){xe=window.gitmarsCmdConfig;break}xe[e]=Ce[oo]}var Ve=xe;const _e={class:"box row justify-center align-center"},we=x("   /   ");const qe=c(d(l({},{inheritAttrs:!1}),{setup:function(e,{expose:o}){const a=k(),t=p({type:"feature",name:""});return B(),A((()=>{a.value.focus()})),o({data:t,submit:()=>new Promise(((e,o)=>{if(!t.type||!t.name)return N({message:"请填写分支类型和名称",type:"warning"}),void o();e(g(t))}))}),(e,o)=>{const r=b("el-option");return v(),y("div",_e,[S(q(L),{class:"col-6",modelValue:q(t).type,"onUpdate:modelValue":o[0]||(o[0]=e=>q(t).type=e),placeholder:"请选择分支类型",clearable:""},{default:w((()=>[S(r,{label:"feature",value:"feature"}),S(r,{label:"bugfix",value:"bugfix"}),S(r,{label:"support",value:"support"})])),_:1},8,["modelValue"]),we,S(q(P),{class:"col-18",ref:(e,o)=>{o.name=e,a.value=e},modelValue:q(t).name,"onUpdate:modelValue":o[1]||(o[1]=e=>q(t).name=e),placeholder:"分支名称"},null,8,["modelValue"])])}}}));const ke=c({name:"ControlGitmars",components:{Xterm:D,Command:J,MapCommand:Y},async setup(){const{getTerminal:e,fitAddon:o}=z(X,{}),{socket:a,socketGitmars:t}=z(H,{}),{globalProperties:{$axios:r,$box:n}}=B(),i=s(),l=u(),d=window.innerWidth,c=window.innerHeight,g=p({project:{id:"",name:"",path:""},terminal:{name:""},activeNames:"",branchs:[],current:"",ready:!1,error:{}}),f=O((()=>"gitmars-"+g.project.id)),b=p(Ve),v=O((()=>{let e={bugfix:[],feature:[],others:[]};return g.branchs.forEach((o=>{o.indexOf("bugfix/")>-1?e.bugfix.push(o):o.indexOf("feature/")>-1?e.feature.push(o):e.others.push(o)})),e}));A((()=>{t.emit("create",{name:g.project.id,cwd:g.project.path}),t.on(g.project.id+"-branch",(e=>{g&&(g.branchs=e)})),t.on(g.project.id+"-current",(e=>{g&&(g.current=e)}))})),m((()=>{t.emit("remove",g.project.id)})),M((e=>(g.error=e,!0)));const y=async()=>(await r({url:"/common/project/list",data:{id:l.query.id}})).data,j=e=>{g.terminal&&a.emit(g.terminal.name+"-input",` ${e}\r`)};g.project=await y(),await r({url:"/cmd/cd",data:{dir:g.project.path}}),g.branchs=await(async()=>(await r({url:"/cmd/branch/list",data:{}})).data)(),g.current=await(async()=>(await r({url:"/cmd/branch/current",data:{}})).data)(),g.terminal=e&&e(f.value,g.project.path,parseInt(String((d-60-300-32)/7.05)),parseInt(String((c-64-32-34-400)/17.6))),g.ready=!0;return{data:g,terminalID:f,exec:j,commandValue:b,route:l,branchList:v,handleItemClick:()=>{console.log("handleItemClick",666)},handleChange:()=>{console.log("handleChange",444)},createBranch:()=>{n(qe,{width:"640px",height:"240px",title:"创建分支",options:{},onOk:async e=>{let{type:o,name:a}=await e.component.proxy.submit();return j(`gitm start ${o} ${a}`),!0}})},back:()=>{i.push("/project/list")},checkout:async e=>{j(`git checkout ${e}`),g.project=await y()}}}}),Oe=e=>(T("data-v-3fb0eb06"),e=e(),I(),e),Se={key:0,class:"page"},Ee=x(" Gitmars工作流 "),Ae=x("创建分支"),ze=x("返回"),Me={class:"cont"},Ue={class:"nav"},Te={key:0,class:"bugfix"},Ie=Oe((()=>j("dt",null,"bug分支",-1))),$e={class:"name"},De=x("进入"),Le={key:1,class:"feature"},Pe=Oe((()=>j("dt",null,"feature分支",-1))),Ne={class:"name"},Be=x("进入"),Ge={key:2,class:"others"},Xe=Oe((()=>j("dt",null,"其他分支",-1))),He={class:"name"},Fe=x("进入"),Re={class:"main"},We=Oe((()=>j("span",{class:"iconfont icon-layout"},null,-1))),Je={class:"cmd"},Ke={class:"section"},Qe=Oe((()=>j("h4",null,"工作流",-1))),Ye={class:"section"},Ze=Oe((()=>j("h4",null,"实用工具",-1)));var eo=G(ke,[["render",function(e,o,a,t,r,n){const i=b("v3-button"),l=b("MapCommand"),d=b("Command"),s=b("v3-collapse-item"),u=b("v3-collapse"),m=b("Xterm");return e.data.ready?(v(),y("div",Se,[j("h1",null,[Ee,j("p",null,[S(i,{type:"primary",onClick:e.createBranch},{default:w((()=>[Ae])),_:1},8,["onClick"]),S(i,{type:"default",onClick:e.back},{default:w((()=>[ze])),_:1},8,["onClick"])])]),j("div",Me,[j("div",Ue,[e.branchList.bugfix.length?(v(),y("dl",Te,[Ie,(v(!0),y(h,null,C(e.branchList.bugfix,(o=>(v(),y("dd",{class:$({active:o===e.data.current}),key:o},[j("span",$e,V(o),1),o!==e.data.current?(v(),_(i,{key:0,type:"primary",size:"mini",onClick:a=>e.checkout(o),plain:""},{default:w((()=>[De])),_:2},1032,["onClick"])):U("",!0)],2)))),128))])):U("",!0),e.branchList.feature.length?(v(),y("dl",Le,[Pe,(v(!0),y(h,null,C(e.branchList.feature,(o=>(v(),y("dd",{class:$({active:o===e.data.current}),key:o},[j("span",Ne,V(o),1),o!==e.data.current?(v(),_(i,{key:0,type:"primary",size:"mini",onClick:a=>e.checkout(o),plain:""},{default:w((()=>[Be])),_:2},1032,["onClick"])):U("",!0)],2)))),128))])):U("",!0),e.branchList.others.length?(v(),y("dl",Ge,[Xe,(v(!0),y(h,null,C(e.branchList.others,(o=>(v(),y("dd",{class:$({active:o===e.data.current}),key:o},[j("span",He,V(o),1),o!==e.data.current?(v(),_(i,{key:0,type:"primary",size:"mini",onClick:a=>e.checkout(o),plain:""},{default:w((()=>[Fe])),_:2},1032,["onClick"])):U("",!0)],2)))),128))])):U("",!0)]),j("div",Re,[j("h3",null,[j("span",null,[We,x(" 当前分支："+V(e.data.current),1)]),j("p",null,V(e.data.project.path),1)]),j("div",Je,[j("div",Ke,[Qe,S(u,{modelValue:e.data.activeNames,"onUpdate:modelValue":o[6]||(o[6]=o=>e.data.activeNames=o),accordion:!0,onChange:e.handleChange},{default:w((()=>[S(s,{name:"1"},{title:w((()=>[S(l,{value:e.commandValue.combine,current:e.data.current,onExec:e.exec},null,8,["value","current","onExec"])])),default:w((()=>[S(d,{modelValue:e.commandValue.combine,"onUpdate:modelValue":o[0]||(o[0]=o=>e.commandValue.combine=o)},null,8,["modelValue"])])),_:1}),S(s,{name:"2"},{title:w((()=>[S(l,{value:e.commandValue.update,current:e.data.current,onExec:e.exec},null,8,["value","current","onExec"])])),default:w((()=>[S(d,{modelValue:e.commandValue.update,"onUpdate:modelValue":o[1]||(o[1]=o=>e.commandValue.update=o)},null,8,["modelValue"])])),_:1}),S(s,{name:"3"},{title:w((()=>[S(l,{value:e.commandValue.build,current:e.data.current,onExec:e.exec},null,8,["value","current","onExec"])])),default:w((()=>[S(d,{modelValue:e.commandValue.build,"onUpdate:modelValue":o[2]||(o[2]=o=>e.commandValue.build=o)},null,8,["modelValue"])])),_:1}),S(s,{name:"4"},{title:w((()=>[S(l,{value:e.commandValue.continue,current:e.data.current,onExec:e.exec},null,8,["value","current","onExec"])])),default:w((()=>[S(d,{modelValue:e.commandValue.continue,"onUpdate:modelValue":o[3]||(o[3]=o=>e.commandValue.continue=o)},null,8,["modelValue"])])),_:1}),S(s,{name:"5"},{title:w((()=>[S(l,{value:e.commandValue.end,current:e.data.current,onExec:e.exec},null,8,["value","current","onExec"])])),default:w((()=>[S(d,{modelValue:e.commandValue.end,"onUpdate:modelValue":o[4]||(o[4]=o=>e.commandValue.end=o)},null,8,["modelValue"])])),_:1}),S(s,{name:"6"},{title:w((()=>[S(l,{value:e.commandValue.branch,current:e.data.current,onExec:e.exec},null,8,["value","current","onExec"])])),default:w((()=>[S(d,{modelValue:e.commandValue.branch,"onUpdate:modelValue":o[5]||(o[5]=o=>e.commandValue.branch=o)},null,8,["modelValue"])])),_:1})])),_:1},8,["modelValue","onChange"])]),j("div",Ye,[Ze,S(u,{modelValue:e.data.activeNames,"onUpdate:modelValue":o[13]||(o[13]=o=>e.data.activeNames=o),accordion:!0,onChange:e.handleChange},{default:w((()=>[S(s,{name:"11"},{title:w((()=>[S(l,{value:e.commandValue.save,current:e.data.current,onExec:e.exec},null,8,["value","current","onExec"])])),default:w((()=>[S(d,{modelValue:e.commandValue.save,"onUpdate:modelValue":o[7]||(o[7]=o=>e.commandValue.save=o)},null,8,["modelValue"])])),_:1}),S(s,{name:"12"},{title:w((()=>[S(l,{value:e.commandValue.get,current:e.data.current,onExec:e.exec},null,8,["value","current","onExec"])])),default:w((()=>[S(d,{modelValue:e.commandValue.get,"onUpdate:modelValue":o[8]||(o[8]=o=>e.commandValue.get=o)},null,8,["modelValue"])])),_:1}),S(s,{name:"13"},{title:w((()=>[S(l,{value:e.commandValue.copy,current:e.data.current,onExec:e.exec},null,8,["value","current","onExec"])])),default:w((()=>[S(d,{modelValue:e.commandValue.copy,"onUpdate:modelValue":o[9]||(o[9]=o=>e.commandValue.copy=o)},null,8,["modelValue"])])),_:1}),S(s,{name:"14"},{title:w((()=>[S(l,{value:e.commandValue.revert,current:e.data.current,onExec:e.exec},null,8,["value","current","onExec"])])),default:w((()=>[S(d,{modelValue:e.commandValue.revert,"onUpdate:modelValue":o[10]||(o[10]=o=>e.commandValue.revert=o)},null,8,["modelValue"])])),_:1}),S(s,{name:"15"},{title:w((()=>[S(l,{value:e.commandValue.link,current:e.data.current,onExec:e.exec},null,8,["value","current","onExec"])])),default:w((()=>[S(d,{modelValue:e.commandValue.link,"onUpdate:modelValue":o[11]||(o[11]=o=>e.commandValue.link=o)},null,8,["modelValue"])])),_:1}),S(s,{name:"16"},{title:w((()=>[S(l,{value:e.commandValue.unlink,current:e.data.current,onExec:e.exec},null,8,["value","current","onExec"])])),default:w((()=>[S(d,{modelValue:e.commandValue.unlink,"onUpdate:modelValue":o[12]||(o[12]=o=>e.commandValue.unlink=o)},null,8,["modelValue"])])),_:1})])),_:1},8,["modelValue","onChange"])])]),e.data.project?(v(),_(m,{ref:"xterm",class:"xterm",key:"gitmars-xterm",id:e.terminalID,path:e.data.project.path},null,8,["id","path"])):U("",!0)])])])):U("",!0)}],["__scopeId","data-v-3fb0eb06"]]);export{eo as default};
