import{o as $,u as S,b as D}from"./vendor/vue-router_4.0.12.js.afa27f3a.js";import{X as F}from"./index.148c79e6.js";import{_ as B,T,S as V}from"./index.1188a187.js";import{u as x}from"./use-current-instance.edd6d2ce.js";import{j as E,e as N,c as X,h as q,l as p,q as a,G as v,D as y,F as A,Q as P,A as u,B as R,i as j,V as n,a4 as z,a5 as K,x as g,k as r}from"./vendor/vue_3.2.31.js.e9245adf.js";import{M as C,q as L}from"./vendor/element-plus_1.2.0-beta.6.js.97ff8a64.js";import"./vendor/axios_0.24.0.js.76963283.js";import"./vendor/qs_6.10.3.js.780215ad.js";import"./vendor/side-channel_1.0.4.js.2b0c4128.js";import"./vendor/get-intrinsic_1.1.1.js.d604dad5.js";import"./vendor/has-symbols_1.0.2.js.208f1d3f.js";import"./vendor/function-bind_1.1.1.js.34bf890b.js";import"./vendor/has_1.0.3.js.e7f09f2c.js";import"./vendor/call-bind_1.0.2.js.ad02ab55.js";import"./vendor/object-inspect_1.12.0.js.ac6bd9c8.js";import"./vendor/js-cool_2.3.2.js.f1b7a643.js";import"./vendor/core-js_3.21.1.js.241fb21a.js";import"./vendor/uuid_8.3.2.js.8656f24a.js";import"./vendor/dayjs_1.10.7.js.553a1c6e.js";import"./vendor/xterm_4.18.0.js.499cd352.js";import"./vendor/xterm-style_1.1.0.js.323fb105.js";import"./vendor/xterm-addon-fit_0.5.0.js.e3a24a28.js";import"./vendor/xterm-addon-search_0.8.2.js.1fbaabcf.js";import"./vendor/xterm-addon-web-links_0.4.0.js.e4a83512.js";import"./vendor/vuex_4.0.2.js.fcf5c9b3.js";import"./vendor/lodash_4.17.21.js.a759a9b5.js";import"./vendor/async-validator_4.0.7.js.656181ea.js";const M=E({name:"ControlTasks",components:{Xterm:F},async setup(){const{getTerminal:t}=j(T,{}),{socket:l}=j(V,{}),{globalProperties:{$axios:i}}=x(),_=S(),d=D(),h=window.innerWidth,c=window.innerHeight,e=N({project:{id:"",name:"",path:""},scripts:[],terminal:{name:""},ready:!1}),m=X(()=>"tasks-"+e.project.id);q(()=>{}),$(()=>{});const o=async()=>(await i({url:"/common/project/list",data:{id:d.query.id}})).data,f=async()=>{const{data:{scripts:s}}=await i({url:"/cmd/fs/read",data:{path:`${e.project.path}/package.json`}});return s},I=()=>{_.push("/project/list")},k=s=>{!e.terminal||l.emit(e.terminal.name+"-input",` ${s}\r`)},b=s=>{k(`yarn run ${s}`)};return e.project=await o(),e.scripts=await f(),await i({url:"/cmd/cd",data:{dir:e.project.path}}),e.terminal=t&&t(m.value,e.project.path,parseInt(String((h-60-300-32)/7.05)),parseInt(String((c-64-32-34)/(16*1.1)))),e.ready=!0,{data:e,terminalID:m,back:I,exec:k,run:b,route:d}}}),w=t=>(z("data-v-abeca27c"),t=t(),K(),t),G={key:0,class:"page"},H=n(" tasks "),O=n("\u8FD4\u56DE"),Q={class:"cont"},W={class:"nav"},J={key:0,class:"bugfix"},U=w(()=>a("dt",null,"\u811A\u672C\u6307\u4EE4",-1)),Y=n("\u6267\u884C"),Z={class:"main"},tt=w(()=>a("span",null,[a("span",{class:"iconfont icon-layout"}),n(" \u5F53\u524D\u5206\u652F\uFF1A ")],-1));function et(t,l,i,_,d,h){const c=g("v3-button"),e=g("Xterm");return t.data.ready?(r(),p("div",G,[a("h1",null,[H,a("p",null,[v(c,{type:"default",onClick:t.back},{default:y(()=>[O]),_:1},8,["onClick"])])]),a("div",Q,[a("div",W,[Object.keys(t.data.scripts).length>0?(r(),p("dl",J,[U,(r(!0),p(A,null,P(t.data.scripts,(m,o)=>(r(),p("dd",{class:L({active:!1}),key:o},[n(C(o)+" ",1),v(c,{type:"primary",size:"mini",onClick:f=>t.run(o),plain:""},{default:y(()=>[Y]),_:2},1032,["onClick"])]))),128))])):u("",!0)]),a("div",Z,[a("h3",null,[tt,a("p",null,C(t.data.project.path),1)]),t.data.project?(r(),R(e,{ref:"xterm",class:"xterm",key:"tasks-xterm",id:t.terminalID,path:t.data.project.path},null,8,["id","path"])):u("",!0)])])])):u("",!0)}var Ft=B(M,[["render",et],["__scopeId","data-v-abeca27c"]]);export{Ft as default};
