var t=Object.defineProperty,a=Object.defineProperties,s=Object.getOwnPropertyDescriptors,e=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,l=Object.prototype.propertyIsEnumerable,n=(a,s,e)=>s in a?t(a,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[s]=e;import{M as c,aa as r,ab as i,r as p,ac as u,o as d,j as f,i as m,F as j,ad as b,q as v,t as y,L as O,u as k,v as P,x as g}from"./vendor.e07efed3.js";import{u as h}from"./use-current-instance.c580ffd2.js";import{_ as x}from"./index.018a3bcc.js";const C=t=>(P("data-v-af31e448"),t=t(),g(),t),w={class:"project-list"},_={class:"content"},I=C((()=>m("h2",null,"项目列表",-1))),L=["onClick"],$=C((()=>m("span",{class:"iconfont icon-star-fill",title:"收藏"},null,-1))),q={class:"ttl"},D=C((()=>m("span",{class:"tg"},null,-1))),E=["onClick"],F=["onClick"];const M=c((S=((t,a)=>{for(var s in a||(a={}))o.call(a,s)&&n(t,s,a[s]);if(e)for(var s of e(a))l.call(a,s)&&n(t,s,a[s]);return t})({},{name:"ProjectList"}),a(S,s({setup:function(t,{expose:a}){const{globalProperties:{$axios:s}}=h(),e=r();i();const o=p({list:[]});u((()=>{l()}));const l=()=>{s({url:"/common/project/list",data:{}}).then((({data:t})=>{o.list=[].concat(t)}))},n=({name:t})=>{console.log(t)},c=({id:t})=>{e.push(`/control?id=${t}`)},P=({id:t})=>{s({url:"/common/project/del",type:"post",data:{id:t}}).then((()=>{l()}))};return a({data:o,open:n,goProject:c,del:P}),(t,a)=>(d(),f("div",w,[m("div",_,[I,m("ul",null,[(d(!0),f(j,null,b(k(o).list,(t=>(d(),f("li",{key:t.id,class:"flex",onClick:a=>c(t)},[$,m("div",q,[m("span",null,[v(y(t.name)+" ",1),D]),m("p",null,y(t.path),1)]),m("span",{class:"iconfont icon-link",onClick:O((a=>n(t)),["stop"]),title:"进入项目首页"},null,8,E),m("span",{class:"iconfont icon-close-circle",onClick:O((a=>P(t)),["stop"]),title:"删除"},null,8,F)],8,L)))),128))])])]))}}))));var S,z=x(M,[["__scopeId","data-v-af31e448"]]);export{z as default};
