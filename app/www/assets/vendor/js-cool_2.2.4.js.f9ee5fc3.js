import"./core-js_3.18.3.js.a64c1281.js";
/*!
 * js-cool v2.2.4
 * 一些常用的JS方法，支持按需引入
 * (c) 2019-2021 saqqdy 
 * Released under the MIT License.
 */function t(n,o,r){if(n.addEventListener)n.addEventListener(o,r,!1);else{r.$$guid||(r.$$guid=t.guid++),n.events||(n.events={});var i=n.events[o];i||(i=n.events[o]={},n["on"+o]&&(i[0]=n["on"+o])),i[r.$$guid]=r,n["on"+o]=e}}function e(t){var e=!0,o=this;t=t||n(((o.ownerDocument||o.document||o).parentWindow||window).event);var r=this.events[t.type];for(var i in r)this.$$handleEvent=r[i],!1===this.$$handleEvent(t)&&(e=!1);return e}function n(t){return t.preventDefault=n.preventDefault,t.stopPropagation=n.stopPropagation,t}function o(t,e,n){t.removeEventListener?t.removeEventListener(e,n,!1):t.events&&t.events[e]&&delete t.events[e][n.$$guid]}function r(t,e){void 0===t&&(t=5e3),void 0===e&&(e=1e4);var n=[t];return Array.prototype.forEach.call(document.querySelectorAll("body > *"),(function(o){var r=+window.getComputedStyle(o).zIndex||0;r>t&&r<e&&n.push(r)})),n.sort((function(t,e){return e-t})),n[0]+1}function i(t,e){void 0===e&&(e=2);var n=new RegExp("^(.*\\..{"+e+"}).*$");return/^(\-|\+)?\d+(\.\d+)?$/.test(t=""+t)?parseFloat(t.replace(n,"$1")):(console.warn("请传入数字"),t)}function a(t){return-1!==Object.prototype.toString.call(t).indexOf("Array")}function u(t){return"object"===(null===(e=t)?e+"":"object"==typeof e||"function"==typeof e?{"[object Array]":"array","[object Boolean]":"boolean","[object Date]":"date","[object Function]":"function","[object Number]":"number","[object Object]":"object","[object RegExp]":"regexp","[object String]":"string"}[Object.prototype.toString.call(e)]||"object":typeof e)&&!function(t){return null!==t&&t===t.window}(t)&&Object.getPrototypeOf(t)===Object.prototype;var e}t.guid=1,n.preventDefault=function(){this.returnValue=!1},n.stopPropagation=function(){this.cancelBubble=!0};var c=function(){function t(e,n,o){for(var r in n)n.hasOwnProperty(r)&&(o&&(u(n[r])||a(n[r]))?(u(n[r])&&!u(e[r])&&(e[r]={}),a(n[r])&&!a(e[r])&&(e[r]=[]),t(e[r],n[r],o)):void 0!==n[r]&&(e[r]=n[r]))}return function(e){for(var n=[],o=1;o<arguments.length;o++)n[o-1]=arguments[o];var r=!1;return"boolean"==typeof e&&(r=e,e=n.shift()),n.forEach((function(n){t(e,n,r)})),e}}();function s(){return{map:{},register:function(t,e,n,o){var r=this;o?(this.map[t]||e(),this.map[t]={id:t,fn:e,time:n,boo:o,timeout:setTimeout((function(){r.destroy(t)}),n)}):(this.map[t]&&this.destroy(t),this.map[t]={id:t,fn:e,time:n,boo:o,timeout:setTimeout(e,n)})},destroy:function(t){this.map[t]&&(clearTimeout(this.map[t].timeout),delete this.map[t])}}}export{t as a,s as d,c as e,i as f,r as n,o as r};
