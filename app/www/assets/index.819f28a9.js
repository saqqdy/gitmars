import{_ as r,T as e}from"./index.2793c8de.js";import{r as a,j as t,d as s,J as n,x as i,y as d,B as o}from"./vendor/vue_3.2.20.js.843b181b.js";const m={class:"terminal",ref:"terminal"},p=["id"];var l=r({name:"Xterm",components:{},props:{id:String,path:String},setup(r){const i=a(null),{getTerminal:d,fitAddon:o}=t(e),m=d(r.id,r.path);return s((()=>{m.term.open(i.value),m.term.focus()})),n((()=>{})),{termWrap:i}}},[["render",function(r,e,a,t,s,n){return i(),d("div",m,[o("div",{ref:"termWrap",id:a.id,class:"terminal-pane"},null,8,p)],512)}],["__scopeId","data-v-028cbdbf"]]);export{l as X};
