var g=Object.defineProperty,b=Object.defineProperties;var j=Object.getOwnPropertyDescriptors;var m=Object.getOwnPropertySymbols;var y=Object.prototype.hasOwnProperty,D=Object.prototype.propertyIsEnumerable;var f=(t,o,s)=>o in t?g(t,o,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[o]=s,v=(t,o)=>{for(var s in o||(o={}))y.call(o,s)&&f(t,s,o[s]);if(m)for(var s of m(o))D.call(o,s)&&f(t,s,o[s]);return t},C=(t,o)=>b(t,j(o));import{d as F,r as I,a3 as $,y as l,x as e,F as A,a4 as P,u as S,I as N,J as T,b as u,C as w,D as B,N as E}from"./vendor/element-plus_2.1.8.js.544d1606.js";import{_ as L,u as M}from"./index.ab0c3978.js";import{u as V}from"./use-current-instance.732c790d.js";import"./vendor/dayjs_1.11.0.js.441fd857.js";import"./vendor/axios-ex_2.2.4.js.09bd27c1.js";import"./vendor/axios_0.24.0.js.52256a15.js";import"./vendor/lodash-es_4.17.21.js.5db20fff.js";import"./vendor/xterm_4.18.0.js.499cd352.js";import"./vendor/qs_6.10.3.js.e370f461.js";import"./vendor/uuid_8.3.2.js.8656f24a.js";const i=t=>(N("data-v-49a0b1ab"),t=t(),T(),t),J={class:"project-list"},R={class:"content"},q=i(()=>e("h2",null,"\u9879\u76EE\u5217\u8868",-1)),z=["onClick"],G=i(()=>e("span",{class:"iconfont icon-star-fill",title:"\u6536\u85CF"},null,-1)),H={class:"ttl"},K=i(()=>e("span",{class:"tg"},null,-1)),O=["onClick"],Q=["onClick"],U={name:"ProjectList"},W=F(C(v({},U),{setup(t,{expose:o}){const{globalProperties:{$axios:s,$confirm:k}}=V(),x=M(),a=I({list:[]});$(()=>{r()});const r=()=>{s({url:"/common/project/list",data:{}}).then(({data:n})=>{a.list=n})},p=({name:n})=>{console.log(n)},_=({id:n})=>{x.push(`/control?id=${n}`)},d=({id:n})=>{k("\u786E\u8BA4\u5220\u9664\u8FD9\u4E2A\u9879\u76EE\u5417","\u8BF7\u786E\u8BA4",{distinguishCancelAndClose:!0,confirmButtonText:"\u786E\u8BA4",cancelButtonText:"\u53D6\u6D88"}).then(()=>{s({url:"/common/project/del",type:"post",data:{id:n}}).then(()=>{r()})})};return o({data:a,open:p,goProject:_,del:d}),(n,X)=>(u(),l("div",J,[e("div",R,[q,e("ul",null,[(u(!0),l(A,null,P(S(a).list,c=>(u(),l("li",{key:c.id,class:"flex",onClick:h=>_(c)},[G,e("div",H,[e("span",null,[w(B(c.name)+" ",1),K]),e("p",null,B(c.path),1)]),e("span",{class:"iconfont icon-link",onClick:E(h=>p(c),["stop"]),title:"\u8FDB\u5165\u9879\u76EE\u9996\u9875"},null,8,O),e("span",{class:"iconfont icon-close-circle",onClick:E(h=>d(c),["stop"]),title:"\u5220\u9664"},null,8,Q)],8,z))),128))])])]))}}));var it=L(W,[["__scopeId","data-v-49a0b1ab"]]);export{it as default};
