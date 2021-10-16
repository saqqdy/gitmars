!function(){function e(e,t,n,a,r,c,i){try{var o=e[c](i),s=o.value}catch(u){return void n(u)}o.done?t(s):Promise.resolve(s).then(a,r)}function t(t){return function(){var n=this,a=arguments;return new Promise((function(r,c){var i=t.apply(n,a);function o(t){e(i,r,c,o,s,"next",t)}function s(t){e(i,r,c,o,s,"throw",t)}o(void 0)}))}}var n=document.createElement("style");n.innerHTML=".page[data-v-7c59e1fe]{display:flex;flex-direction:column;justify-content:stretch;align-items:stretch}.page[data-v-7c59e1fe] .v3-collapse{border-top-color:#6a8bad}.page[data-v-7c59e1fe] .v3-collapse-item__content{color:#fff}.page[data-v-7c59e1fe] .v3-collapse-item__header,.page[data-v-7c59e1fe] .v3-collapse-item__wrap{border-bottom-color:#6a8bad;background:none;color:#fff}.page h1[data-v-7c59e1fe]{height:32px;padding:16px;line-height:32px;font-size:28px;font-weight:300;background:#344a5f;display:flex;justify-content:space-between;align-items:center}.page .cont[data-v-7c59e1fe]{flex:1;display:flex;overflow:hidden;justify-content:stretch;align-items:stretch}.page .cont .nav[data-v-7c59e1fe]{width:300px;overflow-y:auto;background:#2c3e50;height:100%}.page .cont .nav dl[data-v-7c59e1fe]{margin-bottom:10px}.page .cont .nav dt[data-v-7c59e1fe]{padding:0 16px;height:20px;line-height:20px;font-size:12px;color:#6a8bad}.page .cont .nav dd[data-v-7c59e1fe]{height:44px;line-height:44px;padding:0 16px;font-size:14px;display:flex;justify-content:space-between;align-items:center}.page .cont .nav dd[data-v-7c59e1fe]:hover{color:#fff;background:rgba(66,185,131,.05)}.page .cont .nav dd.active[data-v-7c59e1fe]{color:#42b983;background:rgba(66,185,131,.08)!important}.page .cont .main[data-v-7c59e1fe]{flex:1;padding:16px;background:#304457;display:flex;flex-direction:column;justify-content:stretch;align-items:stretch;height:100%}.page .cont .main h3[data-v-7c59e1fe]{font-size:18px;line-height:30px;margin-bottom:16px;font-weight:normal;display:flex;justify-content:space-between;align-items:center}.page .cont .main h3 p[data-v-7c59e1fe]{font-size:12px;background:#2c3e50;line-height:18px;padding:8px;border-radius:3px}.page .cont .main .xterm[data-v-7c59e1fe]{height:calc(100% - 82px);min-height:408px}\n",document.head.appendChild(n),System.register(["./vendor-legacy.a6fafd76.js","./index-legacy.0a8c5304.js","./index-legacy.b5433111.js","./use-current-instance-legacy.3f5adf3d.js"],(function(e){"use strict";var n,a,r,c,i,o,s,u,p,d,l,f,g,h,m,v,x,y,b,k,j,w,_,z,I,R,C;return{setters:[function(e){n=e.M,a=e.ae,r=e.af,c=e.r,i=e.c,o=e.I,s=e.an,u=e.j,p=e.o,d=e.p,l=e.m,f=e.F,g=e.ah,h=e.q,m=e.x,v=e.k,x=e.z,y=e.A,b=e.v,k=e.t,j=e.e,w=e.w},function(e){_=e.X},function(e){z=e._,I=e.T,R=e.S},function(e){C=e.u}],execute:function(){var S={name:"ControlTasks",components:{Xterm:_},setup:function(){return t(regeneratorRuntime.mark((function e(){var u,p,d,l,f,g,h,m,v,x,y,b,k,j,w;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u=n(I,{}),p=u.getTerminal,d=n(R,{}),l=d.socket,f=C(),g=f.globalProperties.$axios,a(),h=r(),m=window.innerWidth,v=window.innerHeight,x=c({project:{id:"",name:"",path:""},scripts:[],terminal:{name:""},ready:!1}),y=i((function(){return"tasks-"+x.project.id})),o((function(){})),s((function(){})),b=function(){var e=t(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g({url:"/common/project/list",data:{id:h.query.id}});case 2:return e.abrupt("return",e.sent.data);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),k=function(){var e=t(regeneratorRuntime.mark((function e(){var t,n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g({url:"/cmd/fs/read",data:{path:"".concat(x.project.path,"/package.json")}});case 2:return t=e.sent,n=t.data.scripts,e.abrupt("return",n);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),j=function(e){x.terminal&&l.emit(x.terminal.name+"-input"," ".concat(e,"\r"))},w=function(e){j("yarn run ".concat(e))},e.next=17,b();case 17:return x.project=e.sent,e.next=20,k();case 20:return x.scripts=e.sent,e.next=23,g({url:"/cmd/cd",data:{dir:x.project.path}});case 23:return x.terminal=p&&p(y.value,x.project.path,parseInt(String((m-60-300-32)/7.05)),parseInt(String((v-64-32-34)/17.6))),x.ready=!0,e.abrupt("return",{data:x,terminalID:y,exec:j,run:w,route:h});case 26:case"end":return e.stop()}}),e)})))()}},T=function(e){return x("data-v-7c59e1fe"),e=e(),y(),e},P={key:0,class:"page"},X=T((function(){return l("h1",null,"tasks",-1)})),q={class:"cont"},D={class:"nav"},H={key:0,class:"bugfix"},M=T((function(){return l("dt",null,"脚本指令",-1)})),A=b("执行"),E={class:"main"},F=T((function(){return l("span",null,[l("span",{class:"iconfont icon-layout"}),b(" 当前分支： ")],-1)}));e("default",z(S,[["render",function(e,t,n,a,r,c){var i=u("v3-button"),o=u("Xterm");return a.data.ready?(p(),d("div",P,[X,l("div",q,[l("div",D,[Object.keys(a.data.scripts).length>0?(p(),d("dl",H,[M,(p(!0),d(f,null,g(a.data.scripts,(function(e,t){return p(),d("dd",{class:k({active:!1}),key:t},[b(m(t)+" ",1),j(i,{type:"primary",size:"mini",onClick:function(e){return a.run(t)},plain:""},{default:w((function(){return[A]})),_:2},1032,["onClick"])])})),128))])):h("",!0)]),l("div",E,[l("h3",null,[F,l("p",null,m(a.data.project.path),1)]),a.data.project?(p(),v(o,{ref:"xterm",class:"xterm",key:"tasks-xterm",id:a.terminalID,path:a.data.project.path},null,8,["id","path"])):h("",!0)])])])):h("",!0)}],["__scopeId","data-v-7c59e1fe"]]))}}}))}();
