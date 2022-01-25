"use strict";(globalThis.webpackChunksen_swap=globalThis.webpackChunksen_swap||[]).push([[727],{64182:(e,t,s)=>{s.r(t),s.d(t,{AccountProvider:()=>C,MintProvider:()=>Q,PoolProvider:()=>m,UIProvider:()=>c,WalletProvider:()=>v,useAccount:()=>j,useMint:()=>Z,usePool:()=>g,useUI:()=>h,useWallet:()=>I,withAccount:()=>R,withMint:()=>U,withPool:()=>p,withUI:()=>d,withWallet:()=>y});var n=s(92950),i=s(99019),r=s(87358),a=s(45263);const o=(0,n.createContext)({}),c=e=>{let{children:t,appId:s,style:c={},antd:l=!1}=e;const{ui:d}=(0,r.Qy)((e=>e)),h=(0,n.useMemo)((()=>({ui:d})),[d]),u=l?{getPopupContainer:()=>document.getElementById(s),..."object"===typeof l?l:{}}:void 0;return(0,a.jsx)(o.Provider,{value:h,children:(0,a.jsx)("section",{id:s,style:{height:"100%",backgroundColor:"transparent",...c},children:u?(0,a.jsx)(i.ConfigProvider,{...u,children:t}):t})})},l=e=>{let{children:t}=e;return(0,a.jsx)(o.Consumer,{children:e=>n.Children.map(t,(t=>(0,n.cloneElement)(t,{...e})))})},d=e=>{class t extends n.Component{render(){const{forwardedRef:t,...s}=this.props;return(0,a.jsx)(l,{children:(0,a.jsx)(e,{ref:t,...s})})}}return(0,n.forwardRef)(((e,s)=>(0,a.jsx)(t,{...e,ref:s})))},h=()=>(0,n.useContext)(o),u=(0,n.createContext)({}),m=e=>{let{children:t}=e;const{pools:s}=(0,r.Qy)((e=>e)),i=(0,n.useMemo)((()=>({pools:s})),[s]);return(0,a.jsx)(u.Provider,{value:i,children:t})},f=e=>{let{children:t}=e;return(0,a.jsx)(u.Consumer,{children:e=>n.Children.map(t,(t=>(0,n.cloneElement)(t,{...e})))})},p=e=>{class t extends n.Component{render(){const{forwardedRef:t,...s}=this.props;return(0,a.jsx)(f,{children:(0,a.jsx)(e,{ref:t,...s})})}}return(0,n.forwardRef)(((e,s)=>(0,a.jsx)(t,{...e,ref:s})))},g=()=>(0,n.useContext)(u),w=(0,n.createContext)({}),v=e=>{let{children:t}=e;const{wallet:s}=(0,r.Qy)((e=>e)),i=(0,n.useMemo)((()=>({wallet:s})),[s]);return(0,a.jsx)(w.Provider,{value:i,children:t})},x=e=>{let{children:t}=e;return(0,a.jsx)(w.Consumer,{children:e=>n.Children.map(t,(t=>(0,n.cloneElement)(t,{...e})))})},y=e=>{class t extends n.Component{render(){const{forwardedRef:t,...s}=this.props;return(0,a.jsx)(x,{children:(0,a.jsx)(e,{ref:t,...s})})}}return(0,n.forwardRef)(((e,s)=>(0,a.jsx)(t,{...e,ref:s})))},I=()=>(0,n.useContext)(w),k=(0,n.createContext)({}),C=e=>{let{children:t}=e;const{accounts:s}=(0,r.Qy)((e=>e)),i=(0,n.useMemo)((()=>({accounts:s})),[s]);return(0,a.jsx)(k.Provider,{value:i,children:t})},b=e=>{let{children:t}=e;return(0,a.jsx)(k.Consumer,{children:e=>n.Children.map(t,(t=>(0,n.cloneElement)(t,{...e})))})},R=e=>{class t extends n.Component{render(){const{forwardedRef:t,...s}=this.props;return(0,a.jsx)(b,{children:(0,a.jsx)(e,{ref:t,...s})})}}return(0,n.forwardRef)(((e,s)=>(0,a.jsx)(t,{...e,ref:s})))},j=()=>(0,n.useContext)(k);var q=s(33015),M=s(20418),E=s(95418);const P=new M.Z,L=(0,n.createContext)({}),Q=e=>{let{children:t}=e;const s=(0,r.u5)(),{mints:i,pools:o}=(0,r.Qy)((e=>e)),c=(0,n.useCallback)((async function(){return await s((0,q.ih)(...arguments)).unwrap()}),[s]),l=(0,n.useCallback)((async e=>{var t;if(!E.account.isAddress(e))throw new Error("Invalid mint address");const s=await P.findByAddress(e);if(null!==s&&void 0!==s&&s.decimals)return s.decimals;if(Object.values(o).findIndex((t=>{let{mint_lpt:s}=t;return s===e}))>=0)return 9;const n=await c({address:e});if(null!==(t=n[e])&&void 0!==t&&t.decimals)return n[e].decimals;throw new Error("Cannot find mint decimals")}),[c,o]),d=(0,n.useMemo)((()=>({mints:i,getMint:c,getDecimals:l,tokenProvider:P})),[i,c,l]);return(0,a.jsx)(L.Provider,{value:d,children:t})},S=e=>{let{children:t}=e;return(0,a.jsx)(L.Consumer,{children:e=>n.Children.map(t,(t=>(0,n.cloneElement)(t,{...e})))})},U=e=>{class t extends n.Component{render(){const{forwardedRef:t,...s}=this.props;return(0,a.jsx)(S,{children:(0,a.jsx)(e,{ref:t,...s})})}}return(0,n.forwardRef)(((e,s)=>(0,a.jsx)(t,{...e,ref:s})))},Z=()=>(0,n.useContext)(L)},20418:(e,t,s)=>{s.d(t,{Z:()=>f});var n=s(11796),i=s(67845),r=s(63805),a=s(55852);const o=e=>({symbol:"SOL",name:"Solana",address:"11111111111111111111111111111111",decimals:9,chainId:e,extensions:{coingeckoId:"solana"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"}),c=e=>({symbol:"SNTR",name:"Sentre",address:"5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ",decimals:9,chainId:e,extensions:{coingeckoId:"sentre"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M/logo.png"}),l=[o(103),c(103),{symbol:"wBTC",name:"Wrapped Bitcoin",address:"8jk4eJymMfNZV9mkRNxJEt2VJ3pRvdJvD5FE94GXGBPM",decimals:9,chainId:103,extensions:{coingeckoId:"bitcoin"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/qfnqNqs3nCAHjnyCgLRDbBtq4p2MtHZxw8YjSyYhPoL/logo.png"},{symbol:"wETH",name:"Ethereum",address:"27hdcZv7RtuMp75vupThR3T4KLsL61t476eosMdoec4c",decimals:9,chainId:103,extensions:{coingeckoId:"ethereum"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/FeGn77dhg1KXRRFeSwwMiykZnZPw5JXW6naf2aQgZDQf/logo.png"},{symbol:"UNI",name:"Uniswap",address:"FVZFSXu3yn17YdcxLD72TFDUqkdE5xZvcW18EUpRQEbe",decimals:9,chainId:103,extensions:{coingeckoId:"uniswap"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/3MVa4e32PaKmPxYUQ6n8vFkWtCma68Ld7e7fTktWDueQ/logo.png"},{symbol:"USDC",name:"USD Coin",address:"2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj",decimals:9,chainId:103,extensions:{coingeckoId:"usd-coin"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"}],{sol:{chainId:d}}=a.Z,h=/[\W_]+/g,u={tokenize:"full",context:!0,minlength:3},m={document:{id:"address",index:[{field:"symbol",...u},{field:"name",...u}]}};const f=class{constructor(){this.tokenMap=void 0,this.engine=void 0,this.chainId=void 0,this.cluster=void 0,this.loading=void 0,this.queue=void 0,this._init=async()=>this.tokenMap.size?[this.tokenMap,this.engine]:new Promise((async e=>{if(this.loading)return this.queue.push(e);this.loading=!0;let t=await(await(new i.DK).resolve()).filterByChainId(this.chainId).getList();for("devnet"===this.cluster&&(t=t.concat(l)),t="testnet"===this.cluster?t.concat([c(102),o(102)]):t.concat([o(101)]),t.forEach((e=>this.tokenMap.set(e.address,e))),this.engine=new n.Document(m),this.tokenMap.forEach((e=>{let{address:t,...s}=e;return this.engine.add(t,s)})),e([this.tokenMap,this.engine]);this.queue.length;)this.queue.shift()([this.tokenMap,this.engine]);this.loading=!1})),this.all=async()=>{const[e]=await this._init();return Array.from(e.values())},this.findByAddress=async e=>{const[t]=await this._init();return t.get(e)},this.find=async(e,t)=>{const[s,n]=await this._init();let i=[];return e.split(h).forEach((e=>n.search(e,t).forEach((e=>{let{result:t}=e;return t.forEach((e=>{if(i.findIndex((t=>{let{address:s}=t;return s===e}))<0){const t=s.get(e);t&&i.push(t)}}))})))),i},this.tokenMap=new Map,this.engine=void 0,this.chainId=d,this.cluster=r.ef,this.loading=!1,this.queue=[],this._init()}}},21411:(e,t,s)=>{s.d(t,{R:()=>a});var n=s(15822),i=s(85964),r=s(67751);class a{static getSingleFlight(e){const t=JSON.stringify(e);if(this.mapInstance.has(t)){const e=this.mapInstance.get(t);if(e)return e}let s=new o(e);return this.mapInstance.set(t,s),s}static async load(e,t){let s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};"object"===typeof e&&(e=JSON.stringify(e));let n=a.getSingleFlight(s);a.mapInstance.set(e,n);const r=new i.g(e);return n.load(r,t)}}a.mapInstance=new Map;class o{constructor(e){this.config=void 0,this.intervalRequest=void 0,this.timeLogs=[],this.mapRequestCalling=new Map,this.requestQueue=[],this.config=Object.assign(n.Dt,e)}async load(e,t){const s=r.U.get(e.key);if(s)return Promise.resolve(s);let n=!1,i=this.mapRequestCalling.get(e.key);return i||(i=e,n=!0,this.mapRequestCalling.set(i.key,i)),new Promise(((e,s)=>{if(!i)return s("Not found request!");i.add(e,s),n&&this.fetch(i,t)}))}fetch(e,t){if(!this.validateLimit())return this.addRequestQueue(e,t);this.createTimeLogs(),t().then((t=>{r.U.set(e.key,t,this.config.cache),e.resolves(t)})).catch((t=>{e.rejects(t)})).finally((()=>{this.mapRequestCalling.delete(e.key),this.fetchRequestQueue(t)}))}fetchRequestQueue(e){if(!this.validateLimit())return;const t=this.requestQueue.shift();t&&this.load(t,e),0===this.requestQueue.length&&this.intervalRequest&&clearInterval(this.intervalRequest)}addRequestQueue(e,t){var s;this.requestQueue.push(e),this.intervalRequest=setInterval((()=>{this.fetchRequestQueue(t)}),null===(s=this.config.limit)||void 0===s?void 0:s.time)}validateLimit(){return!0}createTimeLogs(){var e;if(!this.config.limit)return;const t=(new Date).getTime();this.timeLogs.push(t),this.timeLogs.length>(null===(e=this.config.limit)||void 0===e?void 0:e.calls)&&this.timeLogs.shift()}}},3007:(e,t,s)=>{s.d(t,{Z:()=>c,f:()=>l});var n=s(15454),i=s.n(n),r=s(95418),a=s(83868);class o{constructor(e){if(this.dbName=void 0,this.driver=void 0,this.ipfs=void 0,this.createInstance=e=>i().createInstance({driver:this.driver,name:this.dbName,storeName:e}),this.dropInstance=async e=>{const t=this.createInstance(e);return await t.clear(),await i().dropInstance({name:this.dbName,storeName:e})},this.all=async()=>{let e={};const t=(await this.createInstance("sentre").getItem("appIds")||[]).flat().concat(["sentre"]);for(const s of t){e[s]={};const t=this.createInstance(s);await t.iterate(((t,n)=>{e[s][n]=t}))}return e},this.fetch=async e=>await this.ipfs.get(e),this.backup=async()=>{const e=await this.all();return await this.ipfs.set(e)},this.restore=async e=>{const t=await this.fetch(e);for(const s in t){const e=await this.createInstance(s);for(const n in t[s]){const i=t[s][n];await e.setItem(n,i)}}return t},!r.account.isAddress(e))throw new Error("Invalid address");this.dbName=e,this.driver=[i().WEBSQL,i().LOCALSTORAGE],this.ipfs=new a.Z}}const c=o,l=(e,t)=>r.account.isAddress(e)?new o(e).createInstance(t):void 0},63805:(e,t,s)=>{s.d(t,{OB:()=>i,ef:()=>r,Eu:()=>a});var n=s(53933);const i="production",r=(()=>{switch(n.Z.get("network")){case"devnet":return"devnet";case"testnet":return"testnet";default:return"mainnet"}})(),a=e=>(n.Z.set("network",e),window.location.reload())}}]);
//# sourceMappingURL=727.5bc60ff5.chunk.js.map