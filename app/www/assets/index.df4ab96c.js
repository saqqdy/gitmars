var e=Object.defineProperty,t=Object.defineProperties,n=Object.getOwnPropertyDescriptors,a=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable,s=(t,n,a)=>n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[n]=a;export function __vite_legacy_guard(){import("data:text/javascript,")}import{a as l,l as r,E as c,r as d,b as p,c as u,u as m,n as h,d as f,e as v,f as b,o as x,g,w as y,h as w,i as _,j as k,k as C,m as S,F as O,p as z,t as B,q as $,T as H,s as j,v as P,x as A,y as I,z as E,A as N,B as M,C as T,D as W,G as L,H as F,I as D,J as R,K as q,L as V,M as K,N as Y,O as G,P as J,Q as X,R as Q,S as U,U as Z,V as ee,W as te,X as ne,Y as ae,Z as oe,_ as ie,$ as se,a0 as le,a1 as re,a2 as ce,a3 as de,a4 as pe,a5 as ue,a6 as me}from"./vendor.2fe58688.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const n of e)if("childList"===n.type)for(const e of n.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();function he(e){return new Promise(((t,n)=>{const a=l.create();a.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded",a.defaults.headers.common["Access-Control-Allow-Origin"]="*",a.interceptors.request.use((t=>{const n=e.type;return t.data=Object.assign({},{_time:Date.now()},t.data),"post"==n?(t.method="post",t.data=r.stringify(t.data,{arrayFormat:"indices",allowDots:!0})):(t.method="get",t.params=t.data),t}),(e=>Promise.reject(e))),a.interceptors.response.use((t=>t.data.success||"text"===e.responseType?t.data:Promise.reject(t.data)),(e=>Promise.reject(e))),a(e).then((e=>{t(e)})).catch((e=>{e instanceof Error&&console.log(e)}))}))}function fe(e,t,n){e&&t&&n&&e.addEventListener(t,n,!1)}function ve(e,t,n){e&&t&&e.removeEventListener(t,n,!1)}function be(){return{map:{},register(e,t,n,a){a?(this.map[e]||t(),this.map[e]={id:e,fn:t,time:n,boo:a,timeout:setTimeout((()=>{this.destroy(e)}),n)}):(this.map[e]&&this.destroy(e),this.map[e]={id:e,fn:t,time:n,boo:a,timeout:setTimeout(t,n)})},destroy(e){this.map[e]&&(clearTimeout(this.map[e].timeout),delete this.map[e])}}}function xe(e,t=2){let n=new RegExp("^(.*\\..{"+t+"}).*$");return/^(\-|\+)?\d+(\.\d+)?$/.test(e+="")?parseFloat(e.replace(n,"$1"),10):(console.warn("请传入数字"),e)}function ge(e=5e3,t=1e4){let n=[e];return[...document.querySelectorAll("body > *")].forEach((a=>{let o=+window.getComputedStyle(a).zIndex||0;o>e&&o<t&&n.push(o)})),n.sort(((e,t)=>t-e)),n[0]+1}function ye(e){return"object"===function(e){let t={"[object Array]":"array","[object Boolean]":"boolean","[object Date]":"date","[object Function]":"function","[object Number]":"number","[object Object]":"object","[object RegExp]":"regexp","[object String]":"string"};if(null===e)return e+"";return"object"==typeof e||"function"==typeof e?t[Object.prototype.toString.call(e)]||"object":typeof e}(e)&&!function(e){return null!==e&&e===e.window}(e)&&Object.getPrototypeOf(e)===Object.prototype}function we(e){return-1!==Object.prototype.toString.call(e).indexOf("Array")}let _e=function(){function e(t,n,a){for(let o in n)n.hasOwnProperty(o)&&(a&&(ye(n[o])||we(n[o]))?(ye(n[o])&&!ye(t[o])&&(t[o]={}),we(n[o])&&!we(t[o])&&(t[o]=[]),e(t[o],n[o],a)):void 0!==n[o]&&(t[o]=n[o]))}return function(t){let n,a=Array.prototype.slice.call(arguments,1);return"boolean"==typeof t&&(n=t,t=a.shift()),a.forEach((function(a){e(t,a,n)})),t}}();var ke=(e,t)=>{for(const[n,a]of t)e[n]=a;return e};const Ce={name:"v3Box",components:{ElButton:c},props:{opacity:{type:Number,default:.4},title:{type:String,required:!0,default:"提示"},width:{type:String,default:"640px"},maxWidth:{type:String},height:String,maxHeight:{type:String,default:"480px"},message:String,okBtnName:{type:String,default:"确定"},cancelBtnName:{type:String,default:"取消"},defaultMax:{type:Boolean,default:!1},showOkBtn:{type:Boolean,default:!0},showCancelBtn:{type:Boolean,default:!0},showClose:{type:Boolean,default:!0},showHeader:{type:Boolean,default:!0},showBtn:{type:Boolean,default:!0},showMax:{type:Boolean,default:!0},options:{type:Object,default:()=>({})},component:{type:Object,default:()=>({})},hide:Function,onOk:Function,onCancel:Function,onClose:Function},setup(e,{slots:t,emit:n,attrs:a}){const o=new be,i=d({zIndex:0,instance:null,isAppendContent:!1,maxW:"640px",maxH:"360px",mWidth:null,mHeight:null,max:!1}),s=p(null),l=p(null),r=p(null),c=u((()=>e.showMax?e.showClose?2:1:e.showClose?1:0)),b=()=>{o.register("windowReSize",x,500)},x=()=>{let t=110-(e.showBtn?0:60)-(e.showHeader?0:50),n=e.showHeader?0:40,a=xe(window.innerWidth>320?window.innerWidth-20:300),o=xe(window.innerHeight>300+t?window.innerHeight-t-60+n:240+n),s=parseInt(e.maxHeight||e.height||o||480),l=parseInt(e.maxWidth||e.width||a||600);i.maxW=Math.min(l,a)+"px",i.maxH=Math.min(s,o)+"px",i.max&&(i.mWidth=a+"px",i.mHeight=o+"px")},g=()=>{ve(window,"resize",i.reSize),i.instance=null,v(null,l.value),e.hide()};return i.max=m(e.defaultMax),i.maxH=m(e.maxHeight),i.maxW=m(e.maxWidth)||m(e.width),x(),h((()=>{i.instance=f(e.component),i.instance.props=m(e.options),v(i.instance,l.value),i.isAppendContent=!0,fe(window,"resize",b),e.showBtn&&e.showOkBtn?r.value.focus():s.value.focus()})),{v3Box:s,boxContent:l,mainBtn:r,data:i,btns:c,handleOk:()=>{e.onOk&&"function"==typeof e.onOk?e.onOk(i.instance).then((()=>{e.hide()})):g()},handleCancel:()=>{g(),e.onCancel&&"function"==typeof e.onCancel&&e.onCancel()},handleClose:()=>{g(),e.onClose&&"function"==typeof e.onClose&&e.onClose()},handleMax:()=>{let t=110-(e.showBtn?0:60)-(e.showHeader?0:50),n=e.showHeader?0:40,a=xe(window.innerWidth>320?window.innerWidth-20:300),o=xe(window.innerHeight>300+t?window.innerHeight-t-60+n:240+n);i.max?(i.max=!1,i.mWidth=null,i.mHeight=null):(i.max=!0,i.mWidth=a+"px",i.mHeight=o+"px")}}}},Se=["innerHTML"],Oe=["innerHTML"],ze={key:3,class:"v3-box-footer"},Be={class:"v3-box-ico"},$e=(e=>(j("data-v-56c69d42"),e=e(),P(),e))((()=>w("div",{class:"v3-box-filter"},null,-1)));var He=ke(Ce,[["render",function(e,t,n,a,o,i){const s=b("el-button");return x(),g(H,{name:"fade"},{default:y((()=>[w("div",{ref:"v3Box",class:S(["v3-box",{"one-btn":1===a.btns,"two-btn":2===a.btns,"no-btn":0===a.btns}]),style:C({width:a.data.mWidth||n.width,maxWidth:a.data.max?"":a.data.maxW})},[n.showHeader?(x(),_("div",{key:0,class:"v3-box-header",innerHTML:n.title},null,8,Se)):k("",!0),n.message&&!n.component?(x(),_("div",{key:1,ref:"boxContent",class:"v3-box-content message",innerHTML:n.message,style:C({height:a.data.mHeight||n.height,maxHeight:a.data.max?"":a.data.maxH,minHeight:a.data.mHeight})},null,12,Oe)):k("",!0),n.component&&!n.message?(x(),_("div",{key:2,ref:"boxContent",class:S(["v3-box-content",{"no-header":!n.showHeader}]),style:C({height:a.data.mHeight||n.height,maxHeight:a.data.max?"":a.data.maxH,minHeight:a.data.mHeight})},null,6)):k("",!0),n.showBtn?(x(),_("div",ze,[e.$slots.footer?k("",!0):(x(),_(O,{key:0},[n.showOkBtn?(x(),g(s,{key:0,ref:"mainBtn",type:"primary",class:"btn-main",autofocus:"",onClick:a.handleOk},{default:y((()=>[z(B(n.okBtnName),1)])),_:1},8,["onClick"])):k("",!0),n.showCancelBtn?(x(),g(s,{key:1,onClick:a.handleCancel},{default:y((()=>[z(B(n.cancelBtnName),1)])),_:1},8,["onClick"])):k("",!0)],64)),e.$slots.footer?$(e.$slots,"footer",{key:1},void 0,!0):k("",!0)])):k("",!0),w("div",Be,[$e,n.showMax&&a.data.max?(x(),_("span",{key:0,class:"v3-box-max iconfont icon-tuichuquanping",title:"恢复默认",onClick:t[0]||(t[0]=(...e)=>a.handleMax&&a.handleMax(...e))})):k("",!0),n.showMax&&!a.data.max?(x(),_("span",{key:1,class:"v3-box-max iconfont icon-quanping",title:"最大化",onClick:t[1]||(t[1]=(...e)=>a.handleMax&&a.handleMax(...e))})):k("",!0),n.showClose?(x(),_("span",{key:2,class:"v3-box-close iconfont icon-close",title:"关闭",onClick:t[2]||(t[2]=(...e)=>a.handleClose&&a.handleClose(...e))})):k("",!0)])],6)])),_:3})}],["__scopeId","data-v-56c69d42"]]);const je={opacity:.4,title:"提示",width:"640px",height:"360px",message:null,okBtnName:"确定",cancelBtnName:"取消",defaultMax:!1,showOkBtn:!0,showCancelBtn:!0,showClose:!0,showHeader:!0,showBtn:!0,showMax:!0,options:{}};class Pe{constructor(e,l,r){var c;r=_e(!0,{},je,r),this.$el=document.createElement("div"),this.$el.className="mask",this.$el.style.zIndex=ge(),this.$el.style.background="rgba(0, 0, 0, "+r.opacity+")",this.$el.id=A(),this.instance=f(He),this.instance.props=(c=((e,t)=>{for(var n in t||(t={}))o.call(t,n)&&s(e,n,t[n]);if(a)for(var n of a(t))i.call(t,n)&&s(e,n,t[n]);return e})({},r),t(c,n({component:l,hide:()=>{this.hide()}}))),document.body.appendChild(this.$el),this.show()}show(){v(this.instance,this.$el)}hide(){v(null,this.$el),document.body.removeChild(this.$el),this.$el=null,this.instance=null,delete this.$el,delete this.instance}}var Ae={"v3-split-box":"_v3-split-box_1fvmh_1","v3-split-bar":"_v3-split-bar_1fvmh_11","v3-split-panel":"_v3-split-panel_1fvmh_23","v3-split-panel-2":"_v3-split-panel-2_1fvmh_27",horizontal:"_horizontal_1fvmh_30",vertical:"_vertical_1fvmh_44"};const Ie={name:"v3Split",props:{mode:{type:String,default:"horizontal",validator:e=>["horizontal","vertical"].indexOf(e)>-1},value:{type:[Number,String],default:"50%",validator:e=>/^([0-9]+)(%|px)?$/.test(e)},min:{type:[Number,String],default:0},max:{type:[Number,String],default:"100%"}},setup(e,{slots:t,emit:n}){const a=new be,o=d({size:50,suffix:"%",pos:{},boxSize:0,moving:!1}),i=p(null),s=u((()=>Math.round(o.size/100*o.boxSize))),l=u((()=>{let n=0+o.size;return"horizontal"===e.mode?t.right?t.left||(n=0):n=100:t.bottom?this.$slots.top||(n=0):n=100,{["horizontal"===e.mode?"width":"height"]:n+"%"}}));E((()=>e.value),(e=>{e&&("%"===o.suffix?o.size=xe(parseFloat(e),2):o.boxSize>0&&(o.size=xe(100*parseFloat(e)/o.boxSize,2)))})),E((()=>o.size),(t=>{let a=("%"!==o.suffix?s:t)+o.suffix;a!=e.value&&0!==s&&n("input",a)}));const r=e=>{let t,n,a=(e.style.WebkitTransform||getComputedStyle(e,"").getPropertyValue("-webkit-transform")||e.style.transform||getComputedStyle(e,"").getPropertyValue("transform")).match(/\-?[0-9]+\.?[0-9]*/g);return a?(t=parseInt(a[12]||a[4]||0),n=parseInt(a[13]||a[5]||0),{x:t,y:n}):{x:0,y:0}},c=t=>(String(e.min).indexOf("%")>1?t=Math.max(t,parseInt(e.min)):o.boxSize>0&&(t=Math.max(t,xe(100*parseInt(e.min)/o.boxSize,2))),String(e.max).indexOf("%")>1?t=Math.min(t,parseInt(e.max)):o.boxSize>0&&(t=Math.min(t,xe(100*parseInt(e.max)/o.boxSize,2))),t),m=e=>{let t=0,n=0,a=0,o=0;for(;e.offsetParent;){let a=r(e);t+=e.offsetLeft+a.x,n+=e.offsetTop+a.y,e=e.offsetParent}for(;e.parentNode;)a+=e.scrollLeft,o+=e.scrollTop,e=e.parentNode;return{x:t,y:n,left:a,top:o}},h=t=>{let a=t.target;for(o.boxSize=parseInt("horizontal"===e.mode?i.value.clientWidth:i.value.clientHeight);a.parentNode;){if(a.parentNode.className.indexOf(Ae.v3SplitBox)>-1){o.pos=m(a.parentNode);break}a=a.parentNode}t.preventDefault(),t.stopPropagation(),n("move-start"),fe(document,"mousemove",f),fe(document,"mouseup",v)},f=t=>{o.moving=!0,n("moving",t),a.register("v3SplitOnmouseMove",(()=>{let n;n="horizontal"===e.mode?t.pageX+o.pos.left-o.pos.x:t.pageY+o.pos.top-o.pos.y,o.size=c(xe(100*n/o.boxSize,2))}),50,!0),t.preventDefault()},v=()=>{o.moving=!1,n("move-end"),ve(document,"mousemove",f),ve(document,"mouseup",v)};return String(e.value).replace(/^([0-9]+)(%|px)?$/,((e,t,n)=>{"%"===n&&(o.size=c(parseInt(t))),o.suffix=n||""})),N((()=>{o.boxSize=parseInt("horizontal"===e.mode?i.value.clientWidth:i.value.clientHeight),"%"!==o.suffix&&(o.size=c(xe(100*parseInt(e.value)/o.boxSize,2)))})),()=>M("div",{class:[Ae.v3SplitBox,Ae[e.mode],o.moving?" moving":""],ref:i},t.default?t.default():[M("div",{class:[Ae.v3SplitPanel,Ae.v3SplitPanel1],style:l.value},"horizontal"===e.mode?t.left():t.top()),("horizontal"===e.mode&&t.left&&t.right||"vertical"===e.mode&&t.top&&t.bottom)&&M("div",{class:Ae.v3SplitBar,onMousedown:h},[M("span"),M("span"),M("span"),M("span")]),M("div",{class:[Ae.v3SplitPanel,Ae.v3SplitPanel2]},"horizontal"===e.mode?t.right():t.bottom())])}};const Ee={name:"v3Button",inheritAttrs:!1,props:{icon:String,disabled:Boolean,nativeType:String,plain:Boolean,type:{type:String,default:"default",validator:e=>["default","danger","primary"].indexOf(e)>-1},size:{type:String,default:"normal",validator:e=>["mini","small","normal","large"].indexOf(e)>-1}},setup(e,{slots:t,emit:n}){const a=e=>{n("click",e)};return()=>[M("button",{type:e.nativeType,class:["v3-button","v3-button--"+e.size,"v3-button--"+e.type,{"is-disabled":e.disabled,"is-plain":e.plain}],onClick:a,disabled:e.disabled},[t.icon?[M("span",{class:["v3-button-icon"]},t.icon())," "]:e.icon&&[M("span",{class:["v3-button-icon"]},M("i",{class:["iconfont","icon-"+e.icon]}))," "]||null,M("label",{class:["v3-button-text"]},t.default())])]}};var Ne=ke({name:"v3Checkbox",inheritAttrs:!1,props:{value:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},size:{type:String,default:"normal",validator:e=>["mini","small","normal","large"].indexOf(e)>-1}},setup(e,{slots:t,emit:n}){const a=p(null);a.value=Boolean(e.value),E((()=>a.value),(e=>{n("update:value",m(e))}));return{status:a,changeStatus:()=>{e.disabled||(a.value=!a.value)}}}},[["render",function(e,t,n,a,o,i){return x(),_("span",{class:S("v3-checkbox "+n.size),onClick:t[0]||(t[0]=T(((...e)=>a.changeStatus&&a.changeStatus(...e)),["stop"]))},[w("span",{class:S(["iconfont",{"icon-border":!a.status,"icon-check-square":a.status,disabled:n.disabled}])},null,2),w("span",null,[$(e.$slots,"default")])],2)}]]);var Me=ke({name:"v3Collapse",componentName:"v3Collapse",props:{accordion:Boolean,value:{type:[Array,String,Number],default:()=>[]}},setup(e,{slots:t,emit:n}){const a=p([]);a.value=[].concat(e.value),E(e.value,(e=>{console.log("collapse value change",e)}));const o=t=>{t=[].concat(t);let o=e.accordion?t[0]:t;a.value=t,n("update:value",o)},i=t=>{if(e.accordion)o(!a.value[0]&&0!==a.value[0]||a.value[0]!==t.name?t.name:"");else{let e=a.value.slice(0),n=e.indexOf(t.name);n>-1?e.splice(n,1):e.push(t.name),o(e)}};return W("collapse",{activeNames:a,handleItemClick:i}),{activeNames:a,setActiveNames:o,handleItemClick:i}}},[["render",function(e,t,n,a,o,i){return x(),_("div",{class:"v3-collapse",role:"tablist","aria-multiselectable":"true",onItemClick:t[0]||(t[0]=(...e)=>a.handleItemClick&&a.handleItemClick(...e))},[$(e.$slots,"default")],32)}]]);function Te(e,t,n){this.$children.forEach((a=>{a.$options.componentName===e?a.$emit.apply(a,[t].concat(n)):Te.apply(a,[e,t].concat([n]))}))}function We(e){return{dispatch:(t,n,a)=>{for(var o=e.$parent||e.$root,i=o.$options.componentName;o&&(!i||i!==t);)(o=o.$parent)&&(i=o.$options.componentName);o&&o.$emit.apply(o,[n].concat(a))},broadcast:(t,n,a)=>{Te.call(e,t,n,a)}}}const Le={name:"v3CollapseItem",componentName:"v3CollapseItem",props:{title:String,name:{type:[String,Number],default(){return this._uid}},disabled:Boolean},setup(e,{slots:t,emit:n,attrs:a}){const{proxy:o,appContext:i}=L(),{dispatch:s}=We(o),{activeNames:l,handleItemClick:r}=F("collapse"),c=d({height:"auto",display:"block"}),m=p(0),h=p(!1),f=p(!1),v=p(Math.floor(1e4*Math.random())),b=u((()=>l.value.indexOf(e.name)>-1));return{contentWrapStyle:c,contentHeight:m,focusing:h,isClick:f,id:v,isActive:b,handleFocus:()=>{setTimeout((()=>{f.value?f.value=!1:h.value=!0}),50)},handleHeaderClick:()=>{e.disabled||(s("v3Collapse","item-click",o),r&&r(o),h.value=!1,f.value=!0)},handleEnterClick:()=>{s("v3Collapse","item-click",o)}}}},Fe=["aria-expanded","aria-controls","aria-describedby"],De=["id","tabindex"],Re=["aria-hidden","aria-labelledby","id"],qe={class:"v3-collapse-item__content"};var Ve=ke(Le,[["render",function(e,t,n,a,o,i){return x(),_("div",{class:S(["v3-collapse-item",{"is-active":a.isActive,"is-disabled":n.disabled}])},[w("div",{role:"tab","aria-expanded":a.isActive,"aria-controls":`v3-collapse-content-${a.id}`,"aria-describedby":`v3-collapse-content-${a.id}`},[w("div",{class:S(["v3-collapse-item__header",{focusing:a.focusing,"is-active":a.isActive}]),onClick:t[0]||(t[0]=(...e)=>a.handleHeaderClick&&a.handleHeaderClick(...e)),role:"button",id:`v3-collapse-head-${a.id}`,tabindex:n.disabled?void 0:0,onKeyup:t[1]||(t[1]=D(T(((...e)=>a.handleEnterClick&&a.handleEnterClick(...e)),["stop"]),["space","enter"])),onFocus:t[2]||(t[2]=(...e)=>a.handleFocus&&a.handleFocus(...e)),onBlur:t[3]||(t[3]=e=>a.focusing=!1)},[$(e.$slots,"title",{},(()=>[z(B(n.title),1)])),w("span",{class:S(["v3-collapse-item__arrow iconfont icon-right",{"is-active":a.isActive}])},null,2)],42,De)],8,Fe),R(w("div",{class:"v3-collapse-item__wrap",role:"tabpanel","aria-hidden":!a.isActive,"aria-labelledby":`v3-collapse-head-${a.id}`,id:`v3-collapse-content-${a.id}`},[w("div",qe,[$(e.$slots,"default")])],8,Re),[[q,a.isActive]])],2)}]]);var Ke={install:e=>{e.component(Ie.name,Ie),e.component(Ee.name,Ee),e.component(Ne.name,Ne),e.component(Me.name,Me),e.component(Ve.name,Ve),e.component(He.name,He)},v3Split:Ie,v3Button:Ee,v3Checkbox:Ne,v3Collapse:Me,v3CollapseItem:Ve};const Ye=Symbol("Terminal"),Ge=Symbol("Socket");const Je=V({setup(e){const t=K("http://127.0.0.1:3000/terminal",{reconnection:!0}),n=K("http://127.0.0.1:3000/gitmars",{reconnection:!0}),a=new Y.exports.FitAddon;console.log(t);const o=new G.exports.SearchAddon,i=d({});return W(Ge,{socket:t,socketGitmars:n}),W(Ye,{getTerminal:(e,n="")=>(i[e]||(i[e]={term:new X.exports.Terminal({theme:Q,fontSize:12,fontWeight:300,lineHeight:1.1,fontFamily:'"JetBrains Mono", Menlo, consolas, "Microsoft YaHei", "PingFangSC-Regular", Avenir, Helvetica, Arial, sans-serif'}),name:"terminal-"+e,pid:null},i[e].term.loadAddon(new U.exports.WebLinksAddon),i[e].term.loadAddon(a),i[e].term.loadAddon(o),i[e].term.onData((n=>{t.emit(i[e].name+"-input",n)})),t.on(i[e].name+"-output",(t=>{i[e].term.write(t)})),t.on(i[e].name+"-pid",(t=>{console.info("pid: ",t),i[e].pid=t})),t.emit("create",{name:i[e].name,cwd:n}),window.addEventListener("resize",(()=>{i[e].term.fit()}))),i[e]),fitAddon:a}),N((()=>{})),(e,t)=>{const n=b("router-view");return x(),g(J,{to:"#app",class:"app"},[f(n)])}}}),Xe={},Qe=function(e,t){return t&&0!==t.length?Promise.all(t.map((e=>{if((e=`/${e}`)in Xe)return;Xe[e]=!0;const t=e.endsWith(".css"),n=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${n}`))return;const a=document.createElement("link");return a.rel=t?"stylesheet":"modulepreload",t||(a.as="script",a.crossOrigin=""),a.href=e,document.head.appendChild(a),t?new Promise(((e,t)=>{a.addEventListener("load",e),a.addEventListener("error",t)})):void 0}))).then((()=>e())):e()},Ue=[{path:"/",name:"Home",redirect:"/project/list"},{path:"/project",name:"project",component:()=>Qe((()=>import("./index.5fd90a3d.js")),["assets/index.5fd90a3d.js","assets/vendor.2fe58688.js"]),children:[{path:"list",name:"project_list",component:()=>Qe((()=>import("./list.b6d9fbca.js")),["assets/list.b6d9fbca.js","assets/list.6ab99422.css","assets/vendor.2fe58688.js","assets/use-current-instance.72856c47.js"])},{path:"add",name:"project_add",component:()=>Qe((()=>import("./add.436288c0.js")),["assets/add.436288c0.js","assets/add.d022b880.css","assets/vendor.2fe58688.js","assets/use-current-instance.72856c47.js"])}]},{path:"/control",name:"control",component:()=>Qe((()=>import("./index.29aea25f.js")),["assets/index.29aea25f.js","assets/index.6a5dbb92.css","assets/vendor.2fe58688.js"]),children:[{path:"gitmars",name:"control_gitmars",component:()=>Qe((()=>import("./gitmars.d2373fab.js")),["assets/gitmars.d2373fab.js","assets/gitmars.9d155727.css","assets/vendor.2fe58688.js","assets/index.420b5256.js","assets/index.52ea0375.css","assets/use-current-instance.72856c47.js"])},{path:"tasks",name:"control_tasks",component:()=>Qe((()=>import("./tasks.65b307af.js")),["assets/tasks.65b307af.js","assets/tasks.006d218e.css","assets/vendor.2fe58688.js","assets/index.420b5256.js","assets/index.52ea0375.css","assets/use-current-instance.72856c47.js"])}]}],Ze=Z({history:ee(),routes:Ue});var et=te({state:{},mutations:{},actions:{},modules:{}});const tt=ne(Je);tt.config.globalProperties.$ELEMENT={size:"small",zIndex:5e3},tt.use(ae),tt.use(oe),tt.use(ie),tt.use(se),tt.use(c),tt.use(le),tt.use(re),tt.use(ce),tt.use(de),tt.use(pe),tt.use(ue),tt.use(me),tt.use(et).use(Ze).use(Ke).use((function(e){e.config.globalProperties.$nextIndex=ge.bind(e),e.config.globalProperties.$axios=he,e.config.globalProperties.$delay=new be,e.config.globalProperties.$box=(...t)=>new Pe(e,...t)})).use((e=>{e.config.globalProperties.$filter={date:(e,t)=>e?I(e).format(t):"",point:(e,t)=>e?parseFloat(e).toFixed(t):e}})).mount("#app");export{Ge as S,Ye as T,ke as _};
