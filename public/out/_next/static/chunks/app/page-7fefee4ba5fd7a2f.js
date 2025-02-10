(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{14923:()=>{},47790:()=>{},73776:()=>{},15340:()=>{},79838:()=>{},87648:()=>{},67806:(e,a,t)=>{Promise.resolve().then(t.bind(t,59766))},59766:(e,a,t)=>{"use strict";t.r(a),t.d(a,{default:()=>S});var s=t(95155),n=t(12115),r=t(76046),o=t(25863),i=t(78562),l=t(55467),c=t(10810),d=t(22678),u=t(90507),p=t(6765),f=t(91888),g=t(22282),h=t(55768),y=t(67396),_=t(71510),x=t.n(_);let m=function(e){let{handleSelectPasskey:a}=e,[t,r]=(0,n.useState)([]),[_,m]=(0,n.useState)("");return(0,n.useEffect)(()=>{r((0,h.Ud)())},[]),(0,s.jsx)(i.A,{className:x().paperContainer,elevation:3,children:(0,s.jsxs)(l.A,{className:x().stackContainer,spacing:4,children:[(0,s.jsx)(c.A,{variant:"h1",className:x().title,sx:{color:"text.primary",fontWeight:700,letterSpacing:"-0.025em"},children:"Connect to your account"}),t.length>0?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(d.A,{fullWidth:!0,children:[(0,s.jsx)(u.A,{id:"passkey-select-label",sx:{color:"text.secondary"},children:"Select a Passkey"}),(0,s.jsx)(p.A,{labelId:"passkey-select-label",id:"passkey-select",value:_,label:"Select a Passkey",onChange:e=>m(e.target.value),sx:{"& .MuiSelect-select":{color:"text.primary"}},children:t.map((e,a)=>(0,s.jsxs)(f.A,{value:e.rawId,sx:{color:"text.primary"},children:["Passkey ",a+1," - ID: ",e.rawId.slice(0,10),"..."]},e.rawId))})]}),(0,s.jsx)(g.A,{startIcon:(0,s.jsx)(o.A,{}),variant:"contained",onClick:()=>{let e=t.find(e=>e.rawId===_);e&&a(e)},disabled:!_,fullWidth:!0,className:x().loginButton,sx:{backgroundColor:"primary.main","&:hover":{backgroundColor:"primary.dark"}},children:"Login with Passkey"})]}):(0,s.jsx)(c.A,{className:x().noPasskeysText,sx:{color:"text.secondary"},children:"No passkeys found. Please create an account first."}),(0,s.jsxs)(c.A,{className:x().signupText,sx:{color:"text.secondary"},children:["Don't have an account?"," ",(0,s.jsx)(y.default,{href:"/signup",className:x().signupLink,style:{color:"primary.main"},children:"Sign up"})]})]})})};var k=t(70703),b=t(79985);let S=function(){let e=(0,r.useRouter)(),[a,t]=(0,n.useState)();async function o(){let a=await (0,h.v0)();(0,h.dQ)(a),t(a),e.push("/dashboard")}async function i(a){t(a),e.push("/dashboard?passkeyId=".concat(a.rawId))}return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(b.A,{}),a?(0,s.jsx)(k.A,{passkey:a,onSafeAddress:e=>{console.log("Safe address:",e)}}):(0,s.jsx)(m,{handleCreatePasskey:o,handleSelectPasskey:i})]})}},70703:(e,a,t)=>{"use strict";t.d(a,{A:()=>m});var s=t(95155),n=t(78562),r=t(55467),o=t(10810),i=t(78984),l=t(96854),c=t(66656),d=t(22282),u=t(28121),p=t(12115),f=t(65494);let g=async e=>{let{signer:a,safeAddress:t}=e;try{console.log("[Deployment] Initializing Safe with paymaster...");let e=await u.Safe4337Pack.init({provider:f.E0,signer:a,bundlerUrl:f.L8,paymasterOptions:{isSponsored:!0,paymasterUrl:f.zx},options:{owners:[],threshold:1}}),s=await e.protocolKit.getAddress();console.log("[Deployment] Signer address:",s),console.log("[Deployment] Reinitializing with owner...");let n=await u.Safe4337Pack.init({provider:f.E0,signer:a,bundlerUrl:f.L8,paymasterOptions:{isSponsored:!0,paymasterUrl:f.zx},options:{owners:[s],threshold:1}}),r=await n.protocolKit.getAddress();if(console.log("[Deployment] Calculated address:",r),r!==t)throw console.error("[Deployment] Address mismatch:",{calculatedAddress:r,safeAddress:t}),Error("Safe address mismatch");console.log("[Deployment] Creating deployment transaction...");let o=await n.createTransaction({transactions:[{to:t,data:"0x",value:"0"}]});console.log("[Deployment] Signing operation...");let i=await n.signSafeOperation(o);console.log("[Deployment] Executing transaction...");let l=await n.executeTransaction({executable:i});return console.log("[Deployment] Transaction executed, userOpHash:",l),l}catch(e){throw console.error("[Deployment] Failed:",e),e}};var h=t(60932),y=t.n(h);async function _(e){if(!e)throw Error("Safe address is required");try{let a="".concat("https://safe-transaction-base-sepolia.safe.global/api","/v1/safes/").concat(e,"/balances/");console.log("Fetching USDC balance from:",a);let t=await fetch(a);if(!t.ok)throw console.error("Safe API error:",{status:t.status,statusText:t.statusText,url:a}),Error("Safe API error: ".concat(t.status," ").concat(t.statusText));let s=await t.json();console.log("Safe API balances response:",s);let n=s.find(e=>{var a;return(null===(a=e.tokenAddress)||void 0===a?void 0:a.toLowerCase())===f._g.toLowerCase()});if(console.log("USDC balance found:",n),!n)return"0.00";let r=parseFloat(n.balance)/Math.pow(10,n.decimals||6);return console.log("Parsed USDC balance:",r),r.toFixed(2)}catch(e){throw console.error("Failed to fetch USDC balance:",e),e}}var x=t(7515);let m=function(e){let{passkey:a,onSafeAddress:t}=e,[h,m]=(0,p.useState)(!0),[k,b]=(0,p.useState)(),[S,w]=(0,p.useState)(!1),[A,j]=(0,p.useState)(!1),[C,v]=(0,p.useState)(!1),[D,T]=(0,p.useState)(),L=(0,p.useCallback)(async()=>{m(!0);try{let e=await u.Safe4337Pack.init({provider:f.E0,signer:a,bundlerUrl:f.L8,paymasterOptions:{isSponsored:!0,paymasterUrl:f.zx},options:{owners:[],threshold:1}}),s=await e.protocolKit.getAddress(),n=await u.Safe4337Pack.init({provider:f.E0,signer:a,bundlerUrl:f.L8,paymasterOptions:{isSponsored:!0,paymasterUrl:f.zx},options:{owners:[s],threshold:1}}),r=await n.protocolKit.getAddress(),o=await n.protocolKit.isSafeDeployed();b(r),t(r),w(o),m(!1)}catch(e){console.error("Failed to initialize Safe:",e),m(!1)}},[a,t]);(0,p.useEffect)(()=>{L()},[L]);let N=async()=>{if(k)try{j(!0),await g({signer:a,safeAddress:k}),await L()}catch(e){console.error("Deployment failed:",e)}finally{j(!1)}},P="https://app.safe.global/home?safe=basesep:".concat(k);return(0,p.useEffect)(()=>{let e=async()=>{if(k)try{v(!0);let e=await _(k);console.log("Fetched USDC balance:",e),T(e)}catch(e){console.error("Failed to fetch balances:",e),T("0.00")}finally{v(!1)}},a=setTimeout(()=>{e()},1e3);return()=>clearTimeout(a)},[k]),(0,s.jsx)(n.A,{className:y().container,children:(0,s.jsxs)(r.A,{className:y().stack,children:[(0,s.jsxs)(r.A,{direction:"row",spacing:1,alignItems:"center",justifyContent:"center",children:[(0,s.jsx)(o.A,{className:y().balanceTitle,children:"Balance"}),(0,s.jsx)(i.A,{title:(0,s.jsxs)("span",{children:["Your USDC balance available to buy farm tokens. ",(0,s.jsx)("br",{}),"Get free USDC from the ",(0,s.jsx)("a",{href:"https://faucet.circle.com/",target:"_blank",rel:"noopener noreferrer",style:{color:"primary.main",textDecoration:"underline"},children:"Circle Faucet"}),"."]}),children:(0,s.jsx)(x.A,{sx:{fontSize:16,color:"#5C745D"}})})]}),h||C?(0,s.jsx)(l.A,{size:12,className:y().loading}):(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(r.A,{direction:"row",spacing:1,alignItems:"center",justifyContent:"center",children:(0,s.jsxs)(o.A,{className:y().balanceValue,children:["$",D||"0.00"]})}),(0,s.jsx)(o.A,{textAlign:"center",fontSize:"0.875rem",children:(0,s.jsx)(c.A,{href:P,target:"_blank",underline:"hover",color:"text",children:(0,s.jsx)(i.A,{title:k,children:(0,s.jsx)("span",{className:y().addressContainer,children:function(e){let a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:6,t=e.slice(0,a),s=e.slice(e.length-a);return"".concat(t,"...").concat(s)}(k||"")})})})}),!S&&(0,s.jsx)(r.A,{direction:"row",spacing:1,alignItems:"center",justifyContent:"center",children:(0,s.jsx)(d.A,{variant:"contained",onClick:N,disabled:A,className:y().deployButton,children:A?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(l.A,{size:20,color:"inherit"}),"Activating..."]}):"Activate your account"})})]})]})})}},79985:(e,a,t)=>{"use strict";t.d(a,{A:()=>i});var s=t(95155),n=t(92995),r=t(16458),o=t.n(r);function i(){return(0,s.jsxs)(n.A,{severity:"info",className:o().alert,children:["This is a test website running on Base Sepolia Testnet. Use test USDC from the ",(0,s.jsx)("a",{href:"https://faucet.circle.com/",target:"_blank",rel:"noopener noreferrer",className:o().link,children:"Circle Faucet"}),"."]})}},65494:(e,a,t)=>{"use strict";t.d(a,{E0:()=>r,KT:()=>s,L8:()=>o,PU:()=>i,_g:()=>l,zx:()=>n});let s="safe_passkey_list",n="https://api.pimlico.io/v2/base-sepolia/rpc?apikey=pim_TeYKjc6gDoVgnHL2bCF3WZ",r="https://sepolia.base.org",o="https://api.pimlico.io/v2/".concat("84532","/rpc?apikey=").concat("pim_TeYKjc6gDoVgnHL2bCF3WZ"),i="0x489C7835862c55B4A00efE4C68B695d66009D6f7",l="0x036CbD53842c5426634e7929541eC2318f3dCF7e"},55768:(e,a,t)=>{"use strict";t.d(a,{Ud:()=>i,dQ:()=>o,v0:()=>r});var s=t(48838),n=t(65494);async function r(){let e="Safe Owner",a=await navigator.credentials.create({publicKey:{pubKeyCredParams:[{alg:-7,type:"public-key"}],challenge:crypto.getRandomValues(new Uint8Array(32)),rp:{name:"Safe SmartAccount"},user:{displayName:e,id:crypto.getRandomValues(new Uint8Array(32)),name:e},timeout:6e4,attestation:"none"}});if(!a)throw Error("Passkey creation failed: No credential was returned.");let t=await (0,s.extractPasskeyData)(a);return console.log("Created Passkey:",t),t}function o(e){let a=i();a.push(e),localStorage.setItem(n.KT,JSON.stringify(a))}function i(){let e=localStorage.getItem(n.KT);return e?JSON.parse(e):[]}},71510:e=>{e.exports={paperContainer:"Login_paperContainer__6ecrT",stackContainer:"Login_stackContainer__1uHzS",title:"Login_title__eVvxE",noPasskeysText:"Login_noPasskeysText__Y1Eh1",signupText:"Login_signupText__cWegb",signupLink:"Login_signupLink__A_Z2p",loginButton:"Login_loginButton__prZXx"}},60932:e=>{e.exports={container:"safeaccountdetails_container__Kffb_",stack:"safeaccountdetails_stack__Z5azX",balanceTitle:"safeaccountdetails_balanceTitle__7tisd",balanceValue:"safeaccountdetails_balanceValue__Cm_ja",loading:"safeaccountdetails_loading__Fulgx",addressStack:"safeaccountdetails_addressStack__NfaKd",addressContainer:"safeaccountdetails_addressContainer__k0Y8a",pendingLabel:"safeaccountdetails_pendingLabel__IgcYS",pendingLabelText:"safeaccountdetails_pendingLabelText__9A8lZ",deployButton:"safeaccountdetails_deployButton__PaD6f",infoIcon:"safeaccountdetails_infoIcon___AL8y",addressLink:"safeaccountdetails_addressLink__yha_v",buttonStack:"safeaccountdetails_buttonStack__TnwJx",faucetMessage:"safeaccountdetails_faucetMessage__D4V5f"}},16458:e=>{e.exports={alert:"TestNetworkBanner_alert__VuNGH",link:"TestNetworkBanner_link__6_prD"}}},e=>{var a=a=>e(e.s=a);e.O(0,[643,49,770,12,320,683,944,581,467,905,342,129,441,517,358],()=>a(67806)),_N_E=e.O()}]);