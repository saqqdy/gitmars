var t=Object.defineProperty,s=Object.defineProperties,a=Object.getOwnPropertyDescriptors,o=Object.getOwnPropertySymbols,e=Object.prototype.hasOwnProperty,l=Object.prototype.propertyIsEnumerable,n=(s,a,o)=>a in s?t(s,a,{enumerable:!0,configurable:!0,writable:!0,value:o}):s[a]=o;import{M as c,a9 as r,aa as i,r as p,ab as u,o as d,j as f,i as m,F as j,ac as b,q as v,t as y,L as O,u as k,v as P,x as g}from"./vendor.75a2e4ba.js";import{u as h}from"./use-current-instance.81fdcf70.js";import{_ as x}from"./index.cf835189.js";const C=t=>(P("data-v-d75332cc"),t=t(),g(),t),w={class:"project-list"},_={class:"content"},I=C((()=>m("h2",null,"项目列表",-1))),L=["onClick"],$=C((()=>m("span",{class:"iconfont icon-star-fill",title:"收藏"},null,-1))),q={class:"ttl"},D=C((()=>m("span",{class:"tg"},null,-1))),E=["onClick"],F=["onClick"];const M=c((S=((t,s)=>{for(var a in s||(s={}))e.call(s,a)&&n(t,a,s[a]);if(o)for(var a of o(s))l.call(s,a)&&n(t,a,s[a]);return t})({},{name:"ProjectList"}),s(S,a({setup:function(t,{expose:s}){const{globalProperties:{$axios:a}}=h(),o=r();i();const e=p({list:[]});u((()=>{l()}));const l=()=>{a({url:"/common/project/list",data:{}}).then((({data:t})=>{e.list=[].concat(t)}))},n=({name:t})=>{console.log(t)},c=({id:t})=>{o.push(`/control?id=${t}`)},P=({id:t})=>{a({url:"/common/project/del",type:"post",data:{id:t}}).then((()=>{l()}))};return s({data:e,open:n,goProject:c,del:P}),(t,s)=>(d(),f("div",w,[m("div",_,[I,m("ul",null,[(d(!0),f(j,null,b(k(e).list,(t=>(d(),f("li",{key:t.id,class:"flex",onClick:s=>c(t)},[$,m("div",q,[m("span",null,[v(y(t.name)+" ",1),D]),m("p",null,y(t.path),1)]),m("span",{class:"iconfont icon-link",onClick:O((s=>n(t)),["stop"]),title:"进入项目首页"},null,8,E),m("span",{class:"iconfont icon-close-circle",onClick:O((s=>P(t)),["stop"]),title:"删除"},null,8,F)],8,L)))),128))])])]))}}))));var S,z=x(M,[["__scopeId","data-v-d75332cc"]]);export{z as default};
