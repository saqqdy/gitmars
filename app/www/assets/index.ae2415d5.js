import{_ as r,T as e}from"./index.1e2cbf5a.js";import{r as a,k as s,d as t,R as n,s as i,v as d,J as o}from"./vendor/vue_3.2.23.js.2057d383.js";const m={class:"terminal",ref:"terminal"},p=["id"];var l=r({name:"Xterm",components:{},props:{id:String,path:String},setup(r){const i=a(null),{getTerminal:d,fitAddon:o}=s(e),m=d(r.id,r.path);return t((()=>{m.term.open(i.value),m.term.focus()})),n((()=>{})),{termWrap:i}}},[["render",function(r,e,a,s,t,n){return i(),d("div",m,[o("div",{ref:"termWrap",id:a.id,class:"terminal-pane"},null,8,p)],512)}],["__scopeId","data-v-028cbdbf"]]);export{l as X};
