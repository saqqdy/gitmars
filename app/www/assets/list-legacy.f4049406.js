!function(){function t(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(t);n&&(c=c.filter((function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable}))),e.push.apply(e,c)}return e}function n(n){for(var c=1;c<arguments.length;c++){var o=null!=arguments[c]?arguments[c]:{};c%2?t(Object(o),!0).forEach((function(t){e(n,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(o)):t(Object(o)).forEach((function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(o,t))}))}return n}function e(t,n,e){return n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}var c=document.createElement("style");c.innerHTML=".project-list .content[data-v-d75332cc]{padding:30px;width:800px;margin:0 auto}.project-list .content h2[data-v-d75332cc]{color:#6a8bad;font-size:16px;line-height:50px}.project-list .content .flex[data-v-d75332cc]{display:flex;padding:20px 10px;margin-bottom:10px;align-items:center;justify-content:center;cursor:pointer}.project-list .content .flex.active[data-v-d75332cc],.project-list .content .flex[data-v-d75332cc]:hover,.project-list .content .flex[data-v-d75332cc]:active{background:rgba(66,185,131,.05)}.project-list .content .flex .ttl[data-v-d75332cc]{flex:1}.project-list .content .flex .ttl span[data-v-d75332cc]{font-weight:bold}.project-list .content .flex .ttl span .tg[data-v-d75332cc]{display:inline-block;padding:4px;border-radius:50%;background:#3a5169;margin-left:10px}.project-list .content .flex .ttl p[data-v-d75332cc]{color:#6a8bad}.project-list .content .flex .iconfont[data-v-d75332cc]{background:#3a5169;font-size:18px;border-radius:2px;margin:0 10px;width:32px;height:32px;line-height:32px;text-align:center}\n",document.head.appendChild(c),System.register(["./vendor-legacy.f6612493.js","./use-current-instance-legacy.eb9b1d5c.js","./index-legacy.af2afef0.js"],(function(t){"use strict";var e,c,o,r,i,a,l,s,u,d,p,f,v,g,b,j,x,h;return{setters:[function(t){e=t.M,c=t.a8,o=t.a9,r=t.r,i=t.aa,a=t.o,l=t.j,s=t.i,u=t.F,d=t.ab,p=t.q,f=t.t,v=t.D,g=t.u,b=t.v,j=t.x},function(t){x=t.u},function(t){h=t._}],execute:function(){var y=function(t){return b("data-v-d75332cc"),t=t(),j(),t},m={class:"project-list"},O={class:"content"},k=y((function(){return s("h2",null,"项目列表",-1)})),P=["onClick"],w=y((function(){return s("span",{class:"iconfont icon-star-fill",title:"收藏"},null,-1)})),C={class:"ttl"},D=y((function(){return s("span",{class:"tg"},null,-1)})),E=["onClick"],S=["onClick"];var _=e(n(n({},{name:"ProjectList"}),{},{setup:function(t,n){var e=n.expose,b=x().globalProperties.$axios,j=c();o();var h=r({list:[]});i((function(){y()}));var y=function(){b({url:"/common/project/list",data:{}}).then((function(t){var n=t.data;h.list=[].concat(n)}))},_=function(t){var n=t.name;console.log(n)},z=function(t){var n=t.id;j.push("/control?id=".concat(n))},L=function(t){var n=t.id;b({url:"/common/project/del",type:"post",data:{id:n}}).then((function(){y()}))};return e({data:h,open:_,goProject:z,del:L}),function(t,n){return a(),l("div",m,[s("div",O,[k,s("ul",null,[(a(!0),l(u,null,d(g(h).list,(function(t){return a(),l("li",{key:t.id,class:"flex",onClick:function(n){return z(t)}},[w,s("div",C,[s("span",null,[p(f(t.name)+" ",1),D]),s("p",null,f(t.path),1)]),s("span",{class:"iconfont icon-link",onClick:v((function(n){return _(t)}),["stop"]),title:"进入项目首页"},null,8,E),s("span",{class:"iconfont icon-close-circle",onClick:v((function(n){return L(t)}),["stop"]),title:"删除"},null,8,S)],8,P)})),128))])])])}}}));t("default",h(_,[["__scopeId","data-v-d75332cc"]]))}}}))}();
