var e=Object.defineProperty,r=Object.defineProperties,t=Object.getOwnPropertyDescriptors,a=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,s=Object.prototype.propertyIsEnumerable,n=(r,t,a)=>t in r?e(r,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[t]=a;import{u as l,b as c}from"./vendor/vue-router_4.0.12.js.48a05e12.js";import{s as i,G as p,v as u,x as f,K as d,B as j,L as v,a5 as b}from"./vendor/vue_3.2.22.js.7c311c5a.js";const m={id:"project"},O={class:"head"},y=d("div",{class:"title"},[d("h1",null,"项目管理器")],-1),w={class:"menu"},P=d("span",{class:"iconfont icon-database-fill"},null,-1),_=b(" 项目 "),g=d("span",{class:"iconfont icon-plus-square-fill"},null,-1),h=b(" 导入 ");const x=i((k=((e,r)=>{for(var t in r||(r={}))o.call(r,t)&&n(e,t,r[t]);if(a)for(var t of a(r))s.call(r,t)&&n(e,t,r[t]);return e})({},{name:"Project"}),r(k,t({setup:function(e){const r=l();return"project"===c().name&&r.replace("/project/list"),(e,r)=>{const t=p("router-link"),a=p("router-view");return u(),f("div",m,[d("div",O,[y,d("div",w,[j(t,{to:"/project/list"},{default:v((()=>[P,_])),_:1}),j(t,{to:"/project/add"},{default:v((()=>[g,h])),_:1})])]),j(a,{class:"routerView"})])}}}))));var k;export{x as default};
