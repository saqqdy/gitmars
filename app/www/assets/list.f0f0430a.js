var s=Object.defineProperty,o=Object.defineProperties,e=Object.getOwnPropertyDescriptors,t=Object.getOwnPropertySymbols,n=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable,a=(o,e,t)=>e in o?s(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;import{s as i,q as l,ak as c,v as d,x as j,K as p,F as m,a1 as v,a5 as u,P as f,O as b,u as _,ah as x,ai as h}from"./vendor/vue_3.2.22.js.7c311c5a.js";import{u as y,b as k}from"./vendor/vue-router_4.0.12.js.1d5bea4c.js";import{u as O}from"./use-current-instance.f0781213.js";import{_ as g}from"./index.283da1ba.js";import"./vendor/element-plus_1.2.0-beta.3.js.0f663618.js";import"./vendor/lodash_4.17.21.js.c6f7cdcc.js";import"./vendor/xterm_4.15.0.js.3e95bd6a.js";import"./vendor/dayjs_1.10.7.js.c37b32ae.js";import"./vendor/async-validator_4.0.7.js.656181ea.js";import"./vendor/axios_0.24.0.js.52256a15.js";import"./vendor/qs_6.10.1.js.0baad282.js";import"./vendor/side-channel_1.0.4.js.290c0f4d.js";import"./vendor/get-intrinsic_1.1.1.js.d604dad5.js";import"./vendor/has-symbols_1.0.2.js.208f1d3f.js";import"./vendor/function-bind_1.1.1.js.34bf890b.js";import"./vendor/has_1.0.3.js.e7f09f2c.js";import"./vendor/call-bind_1.0.2.js.ad02ab55.js";import"./vendor/object-inspect_1.11.0.js.ad22ecab.js";import"./vendor/js-cool_2.3.0.js.f671836d.js";import"./vendor/core-js_3.19.1.js.10a7a3d5.js";import"./vendor/uuid_8.3.2.js.8656f24a.js";import"./vendor/xterm-style_1.1.0.js.323fb105.js";import"./vendor/xterm-addon-fit_0.5.0.js.e3a24a28.js";import"./vendor/xterm-addon-search_0.8.1.js.d370edfa.js";import"./vendor/xterm-addon-web-links_0.4.0.js.e4a83512.js";import"./vendor/vuex_4.0.2.js.3ed68d53.js";const P=s=>(x("data-v-745548e5"),s=s(),h(),s),C={class:"project-list"},w={class:"content"},$=P((()=>p("h2",null,"项目列表",-1))),q=["onClick"],B=P((()=>p("span",{class:"iconfont icon-star-fill",title:"收藏"},null,-1))),I={class:"ttl"},T=P((()=>p("span",{class:"tg"},null,-1))),A=["onClick"],D=["onClick"];const E=i((F=((s,o)=>{for(var e in o||(o={}))n.call(o,e)&&a(s,e,o[e]);if(t)for(var e of t(o))r.call(o,e)&&a(s,e,o[e]);return s})({},{name:"ProjectList"}),o(F,e({setup:function(s,{expose:o}){const{globalProperties:{$axios:e,$confirm:t}}=O(),n=y();k();const r=l({list:[]});c((()=>{a()}));const a=()=>{e({url:"/common/project/list",data:{}}).then((({data:s})=>{r.list=[].concat(s)}))},i=({name:s})=>{console.log(s)},x=({id:s})=>{n.push(`/control?id=${s}`)},h=({id:s})=>{t("确认删除这个项目吗","请确认",{distinguishCancelAndClose:!0,confirmButtonText:"确认",cancelButtonText:"取消"}).then((()=>{e({url:"/common/project/del",type:"post",data:{id:s}}).then((()=>{a()}))}))};return o({data:r,open:i,goProject:x,del:h}),(s,o)=>(d(),j("div",C,[p("div",w,[$,p("ul",null,[(d(!0),j(m,null,v(_(r).list,(s=>(d(),j("li",{key:s.id,class:"flex",onClick:o=>x(s)},[B,p("div",I,[p("span",null,[u(f(s.name)+" ",1),T]),p("p",null,f(s.path),1)]),p("span",{class:"iconfont icon-link",onClick:b((o=>i(s)),["stop"]),title:"进入项目首页"},null,8,A),p("span",{class:"iconfont icon-close-circle",onClick:b((o=>h(s)),["stop"]),title:"删除"},null,8,D)],8,q)))),128))])])]))}}))));var F,K=g(E,[["__scopeId","data-v-745548e5"]]);export{K as default};
