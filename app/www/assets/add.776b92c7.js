var e=Object.defineProperty,s=Object.defineProperties,a=Object.getOwnPropertyDescriptors,r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,t=Object.prototype.propertyIsEnumerable,n=(s,a,r)=>a in s?e(s,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):s[a]=r;import{q as d,V as i,ag as p,s as c,v as j,J as m,G as l,ab as v,u,ah as f,ai as b,a5 as _}from"./vendor/vue_3.2.21.js.fc002078.js";import{u as h,b as y}from"./vendor/vue-router_4.0.12.js.cc910462.js";import{_ as x,u as g}from"./index.b3688d6a.js";import{u as w}from"./use-current-instance.56899241.js";import"./vendor/element-plus_1.2.0-beta.3.js.6e3cd832.js";import"./vendor/lodash_4.17.21.js.c6f7cdcc.js";import"./vendor/xterm_4.15.0.js.3e95bd6a.js";import"./vendor/dayjs_1.10.7.js.c37b32ae.js";import"./vendor/async-validator_4.0.7.js.656181ea.js";import"./vendor/axios_0.24.0.js.52256a15.js";import"./vendor/qs_6.10.1.js.0baad282.js";import"./vendor/side-channel_1.0.4.js.290c0f4d.js";import"./vendor/get-intrinsic_1.1.1.js.d604dad5.js";import"./vendor/has-symbols_1.0.2.js.208f1d3f.js";import"./vendor/function-bind_1.1.1.js.34bf890b.js";import"./vendor/has_1.0.3.js.e7f09f2c.js";import"./vendor/call-bind_1.0.2.js.ad02ab55.js";import"./vendor/object-inspect_1.11.0.js.ad22ecab.js";import"./vendor/js-cool_2.3.0.js.f671836d.js";import"./vendor/core-js_3.19.1.js.10a7a3d5.js";import"./vendor/uuid_8.3.2.js.8656f24a.js";import"./vendor/xterm-style_1.1.0.js.323fb105.js";import"./vendor/xterm-addon-fit_0.5.0.js.e3a24a28.js";import"./vendor/xterm-addon-search_0.8.1.js.d370edfa.js";import"./vendor/xterm-addon-web-links_0.4.0.js.e4a83512.js";import"./vendor/vuex_4.0.2.js.cc60c892.js";const O=e=>(f("data-v-f48e2908"),e=e(),b(),e),P={class:"project-add"},q={class:"content"},k=O((()=>m("h2",null,"导入项目",-1))),I={class:"fold"},U=[O((()=>m("span",{class:"iconfont icon-plus-square-fill"},null,-1))),_("导入该项目")];const V=d(($=((e,s)=>{for(var a in s||(s={}))o.call(s,a)&&n(e,a,s[a]);if(r)for(var a of r(s))t.call(s,a)&&n(e,a,s[a]);return e})({},{name:"ProjectAdd"}),s($,a({setup:function(e,{expose:s}){const{globalProperties:{$axios:a,$message:r}}=w(),o=h();y();const t=i({path:"/Users/saqqdy/www/saqqdy/gitmars"}),n=async()=>{t.path||alert("请输入项目完整路径"),await new Promise(((e,s)=>{a({url:"/common/project/check",data:{path:t.path}}).then((({data:{code:s,message:a}={}})=>{0!==s?(r({message:a,type:"error"}),e(!1)):e(!0)})).finally((()=>{e(!1)}))}))&&a({url:"/common/project/add",type:"post",data:{path:t.path}}).then((()=>{r({message:"操作成功！",type:"success"}),o.push("/project/list")}))},{enter:d}=g();return p((()=>{d.value&&n()})),s({form:t,add:n}),(e,s)=>(c(),j("div",P,[m("div",q,[k,m("div",I,[l(m("input",{type:"text","onUpdate:modelValue":s[0]||(s[0]=e=>u(t).path=e),placeholder:"请输入项目完整路径"},null,512),[[v,u(t).path,void 0,{trim:!0}]])]),m("div",{class:"btn"},[m("a",{class:"link",href:"javascript:;",onClick:n,type:"button"},U)])])]))}}))));var $,A=x(V,[["__scopeId","data-v-f48e2908"]]);export{A as default};
