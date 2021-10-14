!function(){function e(e,t,n,a,r,c,i){try{var o=e[c](i),u=o.value}catch(p){return void n(p)}o.done?t(u):Promise.resolve(u).then(a,r)}function t(t){return function(){var n=this,a=arguments;return new Promise((function(r,c){var i=t.apply(n,a);function o(t){e(i,r,c,o,u,"next",t)}function u(t){e(i,r,c,o,u,"throw",t)}o(void 0)}))}}var n=document.createElement("style");n.innerHTML=".page[data-v-9acffeb6]{display:flex;flex-direction:column;justify-content:stretch;align-items:stretch}.page[data-v-9acffeb6] .v3-collapse{border-top-color:#6a8bad}.page[data-v-9acffeb6] .v3-collapse-item__content{color:#fff}.page[data-v-9acffeb6] .v3-collapse-item__header,.page[data-v-9acffeb6] .v3-collapse-item__wrap{border-bottom-color:#6a8bad;background:none;color:#fff}.page h1[data-v-9acffeb6]{height:32px;padding:16px;line-height:32px;font-size:28px;font-weight:300;background:#344a5f;display:flex;justify-content:space-between;align-items:center}.page .cont[data-v-9acffeb6]{flex:1;display:flex;justify-content:stretch;align-items:stretch}.page .cont .nav[data-v-9acffeb6]{width:300px;overflow-y:auto;background:#2c3e50;height:100%}.page .cont .nav dl[data-v-9acffeb6]{margin-bottom:10px}.page .cont .nav dt[data-v-9acffeb6]{padding:0 16px;height:20px;line-height:20px;font-size:12px;color:#6a8bad}.page .cont .nav dd[data-v-9acffeb6]{height:44px;line-height:44px;padding:0 16px;font-size:14px;display:flex;justify-content:space-between;align-items:center}.page .cont .nav dd[data-v-9acffeb6]:hover{color:#fff;background:rgba(66,185,131,.05)}.page .cont .nav dd.active[data-v-9acffeb6]{color:#42b983;background:rgba(66,185,131,.08)!important}.page .cont .main[data-v-9acffeb6]{flex:1;padding:16px;background:#304457;display:flex;flex-direction:column;justify-content:stretch;align-items:stretch}.page .cont .main h3[data-v-9acffeb6]{font-size:18px;line-height:30px;margin-bottom:16px;font-weight:normal;display:flex;justify-content:space-between;align-items:center}.page .cont .main h3 p[data-v-9acffeb6]{font-size:12px;background:#2c3e50;line-height:18px;padding:8px;border-radius:3px}.page .cont .main .xterm[data-v-9acffeb6]{height:50%;min-height:408px}\n",document.head.appendChild(n),System.register(["./vendor-legacy.9417a21f.js","./index-legacy.b778a4f3.js","./index-legacy.21ab74de.js","./use-current-instance-legacy.6c28e2e1.js"],(function(e){"use strict";var n,a,r,c,i,o,u,p,s,f,d,l,g,m,h,v,x,b,y,j,k,w,_,z,R,C;return{setters:[function(e){n=e.H,a=e.a7,r=e.a8,c=e.r,i=e.A,o=e.ag,u=e.f,p=e.o,s=e.i,f=e.h,d=e.d,l=e.w,g=e.F,m=e.aa,h=e.j,v=e.t,x=e.g,b=e.p,y=e.s,j=e.v,k=e.m},function(e){w=e.X},function(e){_=e._,z=e.T,R=e.S},function(e){C=e.u}],execute:function(){var T={name:"ControlTasks",components:{Xterm:w},setup:function(){return t(regeneratorRuntime.mark((function e(){var u,p,s,f,d,l,g,m,h,v,x,b;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u=n(z,{}),p=u.getTerminal,s=n(R,{}),f=s.socket,d=C(),l=d.globalProperties.$axios,a(),g=r(),m=c({project:{id:"",name:"",path:""},scripts:[],terminal:{name:""},ready:!1}),i((function(){})),o((function(){})),h=function(){var e=t(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l({url:"/common/project/list",data:{id:g.query.id}});case 2:return e.abrupt("return",e.sent.data);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),v=function(){var e=t(regeneratorRuntime.mark((function e(){var t,n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l({url:"/cmd/fs/read",data:{path:"".concat(m.project.path,"/package.json")}});case 2:return t=e.sent,n=t.data.scripts,e.abrupt("return",n);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),x=function(e){m.terminal&&f.emit(m.terminal.name+"-input"," ".concat(e,"\r"))},b=function(e){x("yarn run ".concat(e))},e.next=14,h();case 14:return m.project=e.sent,e.next=17,v();case 17:return m.scripts=e.sent,e.next=20,l({url:"/cmd/cd",data:{dir:m.project.path}});case 20:return m.terminal=p&&p(m.project.id,m.project.path),m.ready=!0,e.abrupt("return",{data:m,exec:x,run:b,route:g});case 23:case"end":return e.stop()}}),e)})))()}},P=function(e){return y("data-v-9acffeb6"),e=e(),j(),e},X={key:0,class:"page"},H=b(" tasks "),S=b("创建分支"),q={class:"cont"},A={class:"nav"},E={key:0,class:"bugfix"},F=P((function(){return f("dt",null,"脚本指令",-1)})),I=b("执行"),L={class:"main"},M=P((function(){return f("span",null,[f("span",{class:"iconfont icon-layout"}),b(" 当前分支： ")],-1)}));e("default",_(T,[["render",function(e,t,n,a,r,c){var i=u("v3-button"),o=u("Xterm");return a.data.ready?(p(),s("div",X,[f("h1",null,[H,f("p",null,[d(i,{type:"primary"},{default:l((function(){return[S]})),_:1})])]),f("div",q,[f("div",A,[Object.keys(a.data.scripts).length>0?(p(),s("dl",E,[F,(p(!0),s(g,null,m(a.data.scripts,(function(e,t){return p(),s("dd",{class:k({active:!1}),key:t},[b(v(t)+" ",1),d(i,{type:"primary",size:"mini",onClick:function(e){return a.run(t)},plain:""},{default:l((function(){return[I]})),_:2},1032,["onClick"])])})),128))])):h("",!0)]),f("div",L,[f("h3",null,[M,f("p",null,v(a.data.project.path),1)]),a.data.project?(p(),x(o,{key:0,ref:"xterm",class:"xterm",id:a.data.project.id,path:a.data.project.path},null,8,["id","path"])):h("",!0)])])])):h("",!0)}],["__scopeId","data-v-9acffeb6"]]))}}}))}();
