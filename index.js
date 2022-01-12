var sen_swap;(()=>{"use strict";var e={28688:(e,r,t)=>{var n={"./bootstrap":()=>Promise.all([t.e(757),t.e(902),t.e(550),t.e(774),t.e(587),t.e(855),t.e(950),t.e(537),t.e(55),t.e(577)]).then((()=>()=>t(55841))),"./static":()=>Promise.all([t.e(950),t.e(898)]).then((()=>()=>t(19898))),"./providers":()=>Promise.all([t.e(757),t.e(902),t.e(774),t.e(950),t.e(537),t.e(204)]).then((()=>()=>t(59624)))},a=(e,r)=>(t.R=r,r=t.o(n,e)?n[e]():Promise.resolve().then((()=>{throw new Error('Module "'+e+'" does not exist in container.')})),t.R=void 0,r),o=(e,r)=>{if(t.S){var n=t.S.default,a="default";if(n&&n!==e)throw new Error("Container initialization failed as it has already been initialized with a different share scope");return t.S[a]=e,t.I(a,r)}};t.d(r,{get:()=>a,init:()=>o})},47459:(e,r,t)=>{var n=new Error;e.exports=new Promise(((e,r)=>{if("undefined"!==typeof senhub)return e();t.l("https://descartesnetwork.github.io/senhub/index.js",(t=>{if("undefined"!==typeof senhub)return e();var a=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;n.message="Loading script failed.\n("+a+": "+o+")",n.name="ScriptExternalLoadError",n.type=a,n.request=o,r(n)}),"senhub")})).then((()=>senhub))}},r={};function t(n){var a=r[n];if(void 0!==a)return a.exports;var o=r[n]={id:n,loaded:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}t.m=e,t.c=r,t.amdO={},(()=>{var e="function"===typeof Symbol?Symbol("webpack then"):"__webpack_then__",r="function"===typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",n=e=>{e&&(e.forEach((e=>e.r--)),e.forEach((e=>e.r--?e.r++:e())))},a=e=>!--e.r&&e(),o=(e,r)=>e?e.push(r):a(r);t.a=(t,i,s)=>{var l,u,f,d=s&&[],c=t.exports,p=!0,h=!1,m=(r,t,n)=>{h||(h=!0,t.r+=r.length,r.map(((r,a)=>r[e](t,n))),h=!1)},v=new Promise(((e,r)=>{f=r,u=()=>(e(c),n(d),d=0)}));v[r]=c,v[e]=(e,r)=>{if(p)return a(e);l&&m(l,e,r),o(d,e),v.catch(r)},t.exports=v,i((t=>{if(!t)return u();var i,s;l=(t=>t.map((t=>{if(null!==t&&"object"===typeof t){if(t[e])return t;if(t.then){var i=[];t.then((e=>{s[r]=e,n(i),i=0}));var s={};return s[e]=(e,r)=>(o(i,e),t.catch(r)),s}}var l={};return l[e]=e=>a(e),l[r]=t,l})))(t);var f=new Promise(((e,t)=>{(i=()=>e(s=l.map((e=>e[r])))).r=0,m(l,i,t)}));return i.r?f:s})).then(u,f),p=!1}})(),t.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return t.d(r,{a:r}),r},(()=>{var e,r=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__;t.t=function(n,a){if(1&a&&(n=this(n)),8&a)return n;if("object"===typeof n&&n){if(4&a&&n.__esModule)return n;if(16&a&&"function"===typeof n.then)return n}var o=Object.create(null);t.r(o);var i={};e=e||[null,r({}),r([]),r(r)];for(var s=2&a&&n;"object"==typeof s&&!~e.indexOf(s);s=r(s))Object.getOwnPropertyNames(s).forEach((e=>i[e]=()=>n[e]));return i.default=()=>n,t.d(o,i),o}})(),t.d=(e,r)=>{for(var n in r)t.o(r,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})},t.f={},t.e=e=>Promise.all(Object.keys(t.f).reduce(((r,n)=>(t.f[n](e,r),r)),[])),t.u=e=>"static/js/"+e+"."+{18:"39ead17e",47:"5de0b5ac",55:"1840a699",58:"87ccd91c",108:"1b266ff5",181:"ea7f80ec",204:"a1cbc09e",275:"e93f1a9d",276:"7b5f7daa",338:"67b951aa",361:"ac11aac8",366:"b32a6476",402:"e0dcee7b",404:"01f8ba72",431:"789a7a4d",455:"f5370806",521:"1304f1c5",537:"a51e1285",550:"3028bb2d",577:"02625e2d",587:"aa08ae07",693:"04ca2b75",757:"681b98d3",771:"d72aa3c5",774:"7a72b790",855:"f091a244",898:"e65dd0d0",902:"cbbcf376",935:"85fae076",950:"b5ad3e61"}[e]+".chunk.js",t.miniCssF=e=>"static/css/"+e+".fbe0f1fb.chunk.css",t.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}(),t.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),t.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),(()=>{var e={},r="sen_swap:";t.l=(n,a,o,i)=>{if(e[n])e[n].push(a);else{var s,l;if(void 0!==o)for(var u=document.getElementsByTagName("script"),f=0;f<u.length;f++){var d=u[f];if(d.getAttribute("src")==n||d.getAttribute("data-webpack")==r+o){s=d;break}}s||(l=!0,(s=document.createElement("script")).charset="utf-8",s.timeout=120,t.nc&&s.setAttribute("nonce",t.nc),s.setAttribute("data-webpack",r+o),s.src=n),e[n]=[a];var c=(r,t)=>{s.onerror=s.onload=null,clearTimeout(p);var a=e[n];if(delete e[n],s.parentNode&&s.parentNode.removeChild(s),a&&a.forEach((e=>e(t))),r)return r(t)},p=setTimeout(c.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=c.bind(null,s.onerror),s.onload=c.bind(null,s.onload),l&&document.head.appendChild(s)}}})(),t.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),(()=>{var r={577:[49142]},n={49142:["default","./providers",47459]};t.f.remotes=(a,o)=>{t.o(r,a)&&r[a].forEach((r=>{var a=t.R;a||(a=[]);var i=n[r];if(!(a.indexOf(i)>=0)){if(a.push(i),i.p)return o.push(i.p);var s=t=>{t||(t=new Error("Container missing")),"string"===typeof t.message&&(t.message+='\nwhile loading "'+i[1]+'" from '+i[2]),e[r]=()=>{throw t},i.p=0},l=(e,r,t,n,a,l)=>{try{var u=e(r,t);if(!u||!u.then)return a(u,n,l);var f=u.then((e=>a(e,n)),s);if(!l)return f;o.push(i.p=f)}catch(d){s(d)}},u=(e,r,t)=>l(r.get,i[1],a,0,f,t),f=t=>{i.p=1,e[r]=e=>{e.exports=t()}};l(t,i[2],0,0,((e,r,n)=>e?l(t.I,i[0],0,e,u,n):s()),1)}}))}})(),(()=>{t.S={};var e={},r={};t.I=(n,a)=>{a||(a=[]);var o=r[n];if(o||(o=r[n]={}),!(a.indexOf(o)>=0)){if(a.push(o),e[n])return e[n];t.o(t.S,n)||(t.S[n]={});var i=t.S[n],s="sen_swap",l=(e,r,t,n)=>{var a=i[e]=i[e]||{},o=a[r];(!o||!o.loaded&&(!n!=!o.eager?n:s>o.from))&&(a[r]={get:t,from:s,eager:!!n})},u=[];if("default"===n)l("@reduxjs/toolkit","1.6.2",(()=>t.e(361).then((()=>()=>t(21361))))),l("antd","4.18.2",(()=>Promise.all([t.e(757),t.e(550),t.e(275),t.e(950),t.e(181)]).then((()=>()=>t(99275))))),l("react-dom","17.0.2",(()=>Promise.all([t.e(108),t.e(950)]).then((()=>()=>t(81108))))),l("react-redux","7.2.5",(()=>Promise.all([t.e(771),t.e(950),t.e(181)]).then((()=>()=>t(59771))))),l("react-router-dom","5.3.0",(()=>Promise.all([t.e(521),t.e(950),t.e(402)]).then((()=>()=>t(9402))))),l("react","17.0.2",(()=>t.e(276).then((()=>()=>t(7276))))),(e=>{var r=e=>{return r="Initialization of sharing external failed: "+e,"undefined"!==typeof console&&console.warn&&console.warn(r);var r};try{var o=t(e);if(!o)return;var i=e=>e&&e.init&&e.init(t.S[n],a);if(o.then)return u.push(o.then(i,r));var s=i(o);if(s&&s.then)u.push(s.catch(r))}catch(l){r(l)}})(47459);return u.length?e[n]=Promise.all(u).then((()=>e[n]=1)):e[n]=1}}})(),t.v=(e,r,n,a)=>{var o=fetch(t.p+""+n+".module.wasm");return"function"===typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(o,a).then((r=>Object.assign(e,r.instance.exports))):o.then((e=>e.arrayBuffer())).then((e=>WebAssembly.instantiate(e,a))).then((r=>Object.assign(e,r.instance.exports)))},(()=>{var e;t.g.importScripts&&(e=t.g.location+"");var r=t.g.document;if(!e&&r&&(r.currentScript&&(e=r.currentScript.src),!e)){var n=r.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),t.p=e})(),(()=>{var e=e=>{var r=e=>e.split(".").map((e=>+e==e?+e:e)),t=/^([^-+]+)?(?:-([^+]+))?(?:\+(.+))?$/.exec(e),n=t[1]?r(t[1]):[];return t[2]&&(n.length++,n.push.apply(n,r(t[2]))),t[3]&&(n.push([]),n.push.apply(n,r(t[3]))),n},r=(r,t)=>{r=e(r),t=e(t);for(var n=0;;){if(n>=r.length)return n<t.length&&"u"!=(typeof t[n])[0];var a=r[n],o=(typeof a)[0];if(n>=t.length)return"u"==o;var i=t[n],s=(typeof i)[0];if(o!=s)return"o"==o&&"n"==s||"s"==s||"u"==o;if("o"!=o&&"u"!=o&&a!=i)return a<i;n++}},n=e=>{var r=e[0],t="";if(1===e.length)return"*";if(r+.5){t+=0==r?">=":-1==r?"<":1==r?"^":2==r?"~":r>0?"=":"!=";for(var a=1,o=1;o<e.length;o++)a--,t+="u"==(typeof(s=e[o]))[0]?"-":(a>0?".":"")+(a=2,s);return t}var i=[];for(o=1;o<e.length;o++){var s=e[o];i.push(0===s?"not("+l()+")":1===s?"("+l()+" || "+l()+")":2===s?i.pop()+" "+i.pop():n(s))}return l();function l(){return i.pop().replace(/^\((.+)\)$/,"$1")}},a=(r,t)=>{if(0 in r){t=e(t);var n=r[0],o=n<0;o&&(n=-n-1);for(var i=0,s=1,l=!0;;s++,i++){var u,f,d=s<r.length?(typeof r[s])[0]:"";if(i>=t.length||"o"==(f=(typeof(u=t[i]))[0]))return!l||("u"==d?s>n&&!o:""==d!=o);if("u"==f){if(!l||"u"!=d)return!1}else if(l)if(d==f)if(s<=n){if(u!=r[s])return!1}else{if(o?u>r[s]:u<r[s])return!1;u!=r[s]&&(l=!1)}else if("s"!=d&&"n"!=d){if(o||s<=n)return!1;l=!1,s--}else{if(s<=n||f<d!=o)return!1;l=!1}else"s"!=d&&"n"!=d&&(l=!1,s--)}}var c=[],p=c.pop.bind(c);for(i=1;i<r.length;i++){var h=r[i];c.push(1==h?p()|p():2==h?p()&p():h?a(h,t):!p())}return!!p()},o=(e,t)=>{var n=e[t];return Object.keys(n).reduce(((e,t)=>!e||!n[e].loaded&&r(e,t)?t:e),0)},i=(e,r,t)=>"Unsatisfied version "+r+" of shared singleton module "+e+" (required "+n(t)+")",s=(e,r,t,n)=>{var s=o(e,t);return a(n,s)||"undefined"!==typeof console&&console.warn&&console.warn(i(t,s,n)),l(e[t][s])},l=e=>(e.loaded=1,e.get()),u=e=>function(r,n,a,o){var i=t.I(r);return i&&i.then?i.then(e.bind(e,r,t.S[r],n,a,o)):e(r,t.S[r],n,a,o)},f=u(((e,r,n,a,o)=>r&&t.o(r,n)?s(r,0,n,a):o())),d={},c={92950:()=>f("default","react",[1,17,0,2],(()=>t.e(276).then((()=>()=>t(7276))))),12181:()=>f("default","react-dom",[1,17,0,2],(()=>t.e(108).then((()=>()=>t(81108))))),19289:()=>f("default","@reduxjs/toolkit",[1,1,6,2],(()=>t.e(361).then((()=>()=>t(21361))))),99019:()=>f("default","antd",[1,4,18,2],(()=>Promise.all([t.e(550),t.e(275),t.e(181)]).then((()=>()=>t(99275))))),55754:()=>f("default","react-redux",[1,7,2,5],(()=>Promise.all([t.e(771),t.e(181)]).then((()=>()=>t(59771))))),45055:()=>f("default","react-router-dom",[1,5,3,0],(()=>Promise.all([t.e(521),t.e(693)]).then((()=>()=>t(9402)))))},p={55:[45055],181:[12181],537:[19289,99019,55754],950:[92950]};t.f.consumes=(e,r)=>{t.o(p,e)&&p[e].forEach((e=>{if(t.o(d,e))return r.push(d[e]);var n=r=>{d[e]=0,t.m[e]=n=>{delete t.c[e],n.exports=r()}},a=r=>{delete d[e],t.m[e]=n=>{throw delete t.c[e],r}};try{var o=c[e]();o.then?r.push(d[e]=o.then(n).catch(a)):n(o)}catch(i){a(i)}}))}})(),(()=>{var e=e=>new Promise(((r,n)=>{var a=t.miniCssF(e),o=t.p+a;if(((e,r)=>{for(var t=document.getElementsByTagName("link"),n=0;n<t.length;n++){var a=(i=t[n]).getAttribute("data-href")||i.getAttribute("href");if("stylesheet"===i.rel&&(a===e||a===r))return i}var o=document.getElementsByTagName("style");for(n=0;n<o.length;n++){var i;if((a=(i=o[n]).getAttribute("data-href"))===e||a===r)return i}})(a,o))return r();((e,r,t,n)=>{var a=document.createElement("link");a.rel="stylesheet",a.type="text/css",a.onerror=a.onload=o=>{if(a.onerror=a.onload=null,"load"===o.type)t();else{var i=o&&("load"===o.type?"missing":o.type),s=o&&o.target&&o.target.href||r,l=new Error("Loading CSS chunk "+e+" failed.\n("+s+")");l.code="CSS_CHUNK_LOAD_FAILED",l.type=i,l.request=s,a.parentNode.removeChild(a),n(l)}},a.href=r,document.head.appendChild(a)})(e,o,r,n)})),r={811:0};t.f.miniCss=(t,n)=>{r[t]?n.push(r[t]):0!==r[t]&&{577:1}[t]&&n.push(r[t]=e(t).then((()=>{r[t]=0}),(e=>{throw delete r[t],e})))}})(),(()=>{var e={811:0};t.f.j=(r,n)=>{var a=t.o(e,r)?e[r]:void 0;if(0!==a)if(a)n.push(a[2]);else if(/^(181|537|55|950)$/.test(r))e[r]=0;else{var o=new Promise(((t,n)=>a=e[r]=[t,n]));n.push(a[2]=o);var i=t.p+t.u(r),s=new Error;t.l(i,(n=>{if(t.o(e,r)&&(0!==(a=e[r])&&(e[r]=void 0),a)){var o=n&&("load"===n.type?"missing":n.type),i=n&&n.target&&n.target.src;s.message="Loading chunk "+r+" failed.\n("+o+": "+i+")",s.name="ChunkLoadError",s.type=o,s.request=i,a[1](s)}}),"chunk-"+r,r)}};var r=(r,n)=>{var a,o,[i,s,l]=n,u=0;if(i.some((r=>0!==e[r]))){for(a in s)t.o(s,a)&&(t.m[a]=s[a]);if(l)l(t)}for(r&&r(n);u<i.length;u++)o=i[u],t.o(e,o)&&e[o]&&e[o][0](),e[i[u]]=0},n=globalThis.webpackChunksen_swap=globalThis.webpackChunksen_swap||[];n.forEach(r.bind(null,0)),n.push=r.bind(null,n.push.bind(n))})();var n=t(28688);sen_swap=n})();
//# sourceMappingURL=index.js.map