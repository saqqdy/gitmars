import{_ as a,T as r,S as e}from"./index.df4ab96c.js";import{b as t,H as s,A as n,ah as i,o,i as d,h as m}from"./vendor.2fe58688.js";const p={class:"terminal",ref:"terminal"},l=["id"];var c=a({name:"Xterm",components:{},props:{id:String,path:String},setup(a){const o=t(null),{getTerminal:d,fitAddon:m}=s(r);s(e);const p=d(a.id,a.path);return n((()=>{p.term.open(o.value),m.fit(),p.term.focus()})),i((()=>{})),{termWrap:o}}},[["render",function(a,r,e,t,s,n){return o(),d("div",p,[m("div",{ref:"termWrap",id:e.id,class:"terminal-pane"},null,8,l)],512)}],["__scopeId","data-v-0810b3d3"]]);export{c as X};
