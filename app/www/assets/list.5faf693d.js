var t=Object.defineProperty,a=Object.defineProperties,e=Object.getOwnPropertyDescriptors,s=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,l=Object.prototype.propertyIsEnumerable,n=(a,e,s)=>e in a?t(a,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):a[e]=s;import{M as c,aa as r,ab as i,r as p,ac as d,o as u,j as f,i as m,F as j,ad as b,q as v,t as y,L as O,u as k,v as P,x as g}from"./vendor.e07efed3.js";import{u as h}from"./use-current-instance.c580ffd2.js";import{_ as x}from"./index.e365cd8a.js";const C=t=>(P("data-v-af31e448"),t=t(),g(),t),w={class:"project-list"},_={class:"content"},I=C((()=>m("h2",null,"项目列表",-1))),L=["onClick"],$=C((()=>m("span",{class:"iconfont icon-star-fill",title:"收藏"},null,-1))),q={class:"ttl"},D=C((()=>m("span",{class:"tg"},null,-1))),E=["onClick"],F=["onClick"];const M=c((S=((t,a)=>{for(var e in a||(a={}))o.call(a,e)&&n(t,e,a[e]);if(s)for(var e of s(a))l.call(a,e)&&n(t,e,a[e]);return t})({},{name:"ProjectList"}),a(S,e({setup:function(t,{expose:a}){const{globalProperties:{$axios:e}}=h(),s=r();i();const o=p({list:[]});d((()=>{l()}));const l=()=>{e({url:"/common/project/list",data:{}}).then((({data:t})=>{o.list=[].concat(t)}))},n=({name:t})=>{console.log(t)},c=({id:t})=>{s.push(`/control?id=${t}`)},P=({id:t})=>{e({url:"/common/project/del",type:"post",data:{id:t}}).then((()=>{l()}))};return a({data:o,open:n,goProject:c,del:P}),(t,a)=>(u(),f("div",w,[m("div",_,[I,m("ul",null,[(u(!0),f(j,null,b(k(o).list,(t=>(u(),f("li",{key:t.id,class:"flex",onClick:a=>c(t)},[$,m("div",q,[m("span",null,[v(y(t.name)+" ",1),D]),m("p",null,y(t.path),1)]),m("span",{class:"iconfont icon-link",onClick:O((a=>n(t)),["stop"]),title:"进入项目首页"},null,8,E),m("span",{class:"iconfont icon-close-circle",onClick:O((a=>P(t)),["stop"]),title:"删除"},null,8,F)],8,L)))),128))])])]))}}))));var S,z=x(M,[["__scopeId","data-v-af31e448"]]);export{z as default};
