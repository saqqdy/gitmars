var t=Object.defineProperty,e=Object.defineProperties,l=Object.getOwnPropertyDescriptors,o=Object.getOwnPropertySymbols,s=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,n=(e,l,o)=>l in e?t(e,l,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[l]=o;import{L as c,p as r,d as i,a7 as p,a8 as u,r as d,a9 as f,j as b,i as j,F as m,aa as v,u as y,o as O,s as k,t as P,C}from"./vendor.1c9db40c.js";import{u as g}from"./use-current-instance.0142bbc2.js";r("data-v-ef684d1e");const h={class:"project-list"},w={class:"content"},x=j("h2",null,"项目列表",-1),I=["onClick"],L=j("span",{class:"iconfont icon-star-fill",title:"收藏"},null,-1),$={class:"ttl"},_=j("i",null,null,-1),D=["onClick"],E=["onClick"];i();var F,S=c((F=((t,e)=>{for(var l in e||(e={}))s.call(e,l)&&n(t,l,e[l]);if(o)for(var l of o(e))a.call(e,l)&&n(t,l,e[l]);return t})({},{name:"ProjectList"}),e(F,l({setup:function(t,{expose:e}){const{globalProperties:{$axios:l}}=g(),o=p();u();const s=d({list:[]});f((()=>{a()}));const a=()=>{l({url:"/common/project/list",data:{}}).then((({data:t})=>{s.list=[].concat(t)}))},n=({name:t})=>{console.log(t)},c=({id:t})=>{o.push(`/control?id=${t}`)},r=({id:t})=>{l({url:"/common/project/del",type:"post",data:{id:t}}).then((()=>{a()}))};return e({data:s,open:n,goProject:c,del:r}),(t,e)=>(O(),b("div",h,[j("div",w,[x,j("ul",null,[(O(!0),b(m,null,v(y(s).list,(t=>(O(),b("li",{key:t.id,class:"flex",onClick:e=>c(t)},[L,j("div",$,[j("span",null,[k(P(t.name)+" ",1),_]),j("p",null,P(t.path),1)]),j("span",{class:"iconfont icon-link",onClick:C((e=>n(t)),["stop"]),title:"进入项目首页"},null,8,D),j("span",{class:"iconfont icon-close-circle",onClick:C((e=>r(t)),["stop"]),title:"删除"},null,8,E)],8,I)))),128))])])]))}}))));S.__scopeId="data-v-ef684d1e";export{S as default};
