var e=Object.defineProperty,t=Object.defineProperties,r=Object.getOwnPropertyDescriptors,a=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,s=Object.prototype.propertyIsEnumerable,l=(t,r,a)=>r in t?e(t,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[r]=a;import{M as n,a8 as c,a9 as i,g as p,o as u,j as d,i as f,e as b,w as j,q as v}from"./vendor.dc4bbc83.js";const O={id:"project"},m={class:"head"},y=f("div",{class:"title"},[f("h1",null,"项目管理器")],-1),w={class:"menu"},P=f("span",{class:"iconfont icon-database-fill"},null,-1),g=v(" 项目 "),h=f("span",{class:"iconfont icon-plus-square-fill"},null,-1),q=v(" 导入 ");const _=n((k=((e,t)=>{for(var r in t||(t={}))o.call(t,r)&&l(e,r,t[r]);if(a)for(var r of a(t))s.call(t,r)&&l(e,r,t[r]);return e})({},{name:"Project"}),t(k,r({setup:function(e){const t=c();return"project"===i().name&&t.replace("/project/list"),(e,t)=>{const r=p("router-link"),a=p("router-view");return u(),d("div",O,[f("div",m,[y,f("div",w,[b(r,{to:"/project/list"},{default:j((()=>[P,g])),_:1}),b(r,{to:"/project/add"},{default:j((()=>[h,q])),_:1})])]),b(a,{class:"routerView"})])}}}))));var k;export{_ as default};
