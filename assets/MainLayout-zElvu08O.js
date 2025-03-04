import{Q as P,a as H,z as X,b as Z,c as x}from"./vue-boring-avatars-sk-mdFe2.js";import{i as ee,j as te,r as W,o as M,e as s,k as m,Q as $,u as ae,l as oe,m as le,n as Y,w as ne,d as se,p as re,q as t,s as de,h as e,v as u,f as y,t as n,x as A,y as r,z as v,A as w,F as I,B as N,C as _,g as ue,D as ie}from"./index-C-xpmZAv.js";import{Q as g}from"./QItemLabel-DFuciFK-.js";import{Q as i,a as l}from"./QItem-8UxAzF0w.js";import{Q as D}from"./QList-PkyEnzbd.js";import{Q as me}from"./use-id-Beu2uHRI.js";import{Q as ce}from"./QBtnDropdown-DYNqHm4z.js";import{Q as T}from"./QSeparator-Ddswcuea.js";import{C as k}from"./ClosePopup-JvNc_8_Q.js";import{u as fe}from"./use-quasar-Cq90yekB.js";import{u as pe}from"./useLocomotiveScroll-Dx60ro8D.js";import{_ as ve}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./use-prevent-scroll-uSPdFNBj.js";import"./use-timeout-C9dFF4FH.js";import"./use-dark-C2GkM102.js";import"./TouchPan-VmcQKHAK.js";import"./format-dCatN8Gn.js";import"./QBtnGroup-DDshPcgs.js";const he=ee({name:"QSpace",setup(){const q=te("div",{class:"q-space"});return()=>q}}),U={__name:"ThemeToggle",setup(q){document.startViewTransition||(document.startViewTransition=o=>o());const c=W(!1);function Q(o){document.startViewTransition(()=>{o==="dark"?(c.value=!0,document.documentElement.classList.add("dark"),localStorage.setItem("theme","dark")):(c.value=!1,document.documentElement.classList.remove("dark"),localStorage.setItem("theme","light"))})}M(()=>{const o=localStorage.getItem("theme");(o==="dark"||!o&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(c.value=!0,document.documentElement.classList.add("dark"))});const E=o=>{const h=`${Math.floor(o.clientX/window.innerWidth*100)}%`,b=`${Math.floor(o.clientY/window.innerHeight*100)}%`;document.documentElement.style=`--pointerX: ${h}; --pointerY: ${b};`},f=o=>{const h=`${Math.floor(o.touches[0].clientX/window.innerWidth*100)}%`,b=`${Math.floor(o.touches[0].clientY/window.innerHeight*100)}%`;document.documentElement.style=`--pointerX: ${h}; --pointerY: ${b};`};return M(()=>{const o=localStorage.getItem("theme");(o==="dark"||!o&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(c.value=!0,document.documentElement.classList.add("dark")),document.addEventListener("mousedown",E),document.addEventListener("touchstart",f)}),(o,h)=>(s(),m($,{flat:"",dense:"",round:"",icon:c.value?"dark_mode":"light_mode",onClick:h[0]||(h[0]=b=>Q(c.value?"light":"dark")),class:"theme-toggle"},null,8,["icon"]))}},_e={key:0},ge={key:1,class:"text-h6"},ke={key:0,class:"desktop-nav"},be={class:"mobile-menu-btn"},ye={__name:"MainLayout",setup(q){const c=ae(),{t:Q,locale:E}=oe(),f=le(),o=fe(),{initLocomotiveScroll:h,destroyLocomotiveScroll:b}=pe();let C=null;const S=Y(()=>f.username?.toLowerCase()),z=["#92A1C6","#146A7C","#F0AB3D","#C271B4","#C20D90"],d=W(!1),F=Y(()=>(o.screen.lt.sm,280));function R(){c.push("/site"),d.value=!1}const j=a=>{E.value=a},B=async()=>{try{await f.logout(),o.notify({type:"positive",message:Q("logout.success"),position:"top"}),c.push("/site/login"),d.value=!1}catch(a){console.error("Logout error:",a),o.notify({type:"negative",message:Q("logout.error"),position:"top"})}},V=[{text:"繁體中文",value:"zh-TW"},{text:"English",value:"en-US"}];ne(()=>o.screen.name,a=>{(a==="md"||a==="lg"||a==="xl")&&(d.value=!1)}),c.afterEach(()=>{setTimeout(()=>{C&&C.update(),d.value=!1},100)}),M(()=>{C=h(),window.locomotiveScroll=C,console.log("元件掛載，目前螢幕類型:",o.screen.name),console.log("是否為行動裝置:",o.screen.lt.md),window.addEventListener("resize",()=>{console.log("螢幕大小變化，目前螢幕類型:",o.screen.name),console.log("是否為行動裝置:",o.screen.lt.md)});const a=document.createElement("style");a.innerHTML=`
    body.body--dark .q-menu,
    body.body--dark .q-popover,
    body.body--dark .q-tooltip {
      background-color: #1d1d1d !important;
      color: #ffffff !important;
    }

    body.body--dark .q-menu *,
    body.body--dark .q-popover *,
    body.body--dark .q-tooltip * {
      background-color: #1d1d1d !important;
    }
  `,document.head.appendChild(a)}),se(()=>{b()});const O=()=>{c.push("/"),d.value=!1},G=()=>{console.log("選單按鈕點擊，目前抽屜狀態:",d.value),d.value=!d.value,console.log("抽屜新狀態:",d.value)};return(a,L)=>{const J=re("router-view");return s(),m(de,{view:"hHh Lpr lff"},{default:t(()=>[e(Z,{class:"main-header header-z-index fixed-header",bordered:""},{default:t(()=>[e(P,{class:"header-toolbar"},{default:t(()=>[e(H,{onClick:R,class:"cursor-pointer"},{default:t(()=>[u(o).screen.lt.sm?(s(),y("span",ge,n(a.$t("nav.shortTitle")||a.$t("nav.title").substring(0,3)),1)):(s(),y("span",_e,n(a.$t("nav.title")),1))]),_:1}),e(he),u(o).screen.lt.md?w("",!0):(s(),y("div",ke,[u(f).isLoggedIn?(s(),m($,{key:1,flat:""},{default:t(()=>[e(A,{size:"sm",class:"q-mr-sm"},{default:t(()=>[e(u(X),{size:25,variant:"beam",name:u(f).username,title:!0,colors:z},null,8,["name"])]),_:1}),r(" "+n(S.value)+" ",1),e(me,null,{default:t(()=>[e(D,{style:{"min-width":"150px"}},{default:t(()=>[e(i,{clickable:"",onClick:B},{default:t(()=>[e(l,null,{default:t(()=>[e(g,null,{default:t(()=>[e(v,{name:"logout",size:"sm",class:"q-mr-sm"}),r(" "+n(a.$t("nav.logout")),1)]),_:1})]),_:1})]),_:1}),e(i,{clickable:"",to:"/site/dashboard"},{default:t(()=>[e(l,null,{default:t(()=>[e(g,null,{default:t(()=>[e(v,{name:"dashboard",size:"sm",class:"q-mr-sm"}),r(" "+n(a.$t("nav.dashboard")),1)]),_:1})]),_:1})]),_:1}),u(f).role==="admin"?(s(),m(i,{key:0,clickable:"",to:{name:"admin"}},{default:t(()=>[e(l,null,{default:t(()=>[e(g,null,{default:t(()=>[e(v,{name:"admin_panel_settings",size:"sm",class:"q-mr-sm"}),r(" "+n(a.$t("nav.admin")),1)]),_:1})]),_:1})]),_:1})):w("",!0)]),_:1})]),_:1})]),_:1})):(s(),m($,{key:0,flat:"",label:a.$t("nav.login"),to:{name:"login"}},null,8,["label"])),e(ce,{flat:"",icon:"translate"},{default:t(()=>[e(D,null,{default:t(()=>[(s(),y(I,null,N(V,p=>_(e(i,{key:p.value,clickable:"",onClick:K=>a.$i18n.locale=p.value},{default:t(()=>[e(l,null,{default:t(()=>[e(g,null,{default:t(()=>[r(n(p.text),1)]),_:2},1024)]),_:2},1024)]),_:2},1032,["onClick"]),[[k]])),64))]),_:1})]),_:1}),e(U)])),ue("div",be,[u(o).screen.lt.md?(s(),m($,{key:0,dense:"",flat:"",round:"",icon:"menu",onClick:G})):w("",!0)])]),_:1})]),_:1}),e(x,{modelValue:d.value,"onUpdate:modelValue":L[1]||(L[1]=p=>d.value=p),side:"right",overlay:"",elevated:"",width:F.value,class:"mobile-drawer"},{default:t(()=>[e(P,{class:"drawer-header"},{default:t(()=>[e(H,null,{default:t(()=>[r(n(a.$t("nav.menu")),1)]),_:1}),e($,{flat:"",round:"",dense:"",icon:"close",onClick:L[0]||(L[0]=p=>d.value=!1)})]),_:1}),e(D,null,{default:t(()=>[a.$route.path!=="/"?_((s(),m(i,{key:0,clickable:"",onClick:O},{default:t(()=>[e(l,{avatar:""},{default:t(()=>[e(v,{name:"fas fa-dove"})]),_:1}),e(l,null,{default:t(()=>[r(n(a.$t("preface.return")),1)]),_:1})]),_:1})),[[k]]):w("",!0),a.$route.path!=="/"?(s(),m(T,{key:1})):w("",!0),u(f).isLoggedIn?(s(),y(I,{key:3},[e(i,null,{default:t(()=>[e(l,{avatar:""},{default:t(()=>[e(A,null,{default:t(()=>[e(u(X),{size:40,variant:"beam",name:u(f).username,title:!0,colors:z},null,8,["name"])]),_:1})]),_:1}),e(l,null,{default:t(()=>[e(g,null,{default:t(()=>[r(n(S.value),1)]),_:1}),e(g,{caption:""},{default:t(()=>[r(n(u(f).email),1)]),_:1})]),_:1})]),_:1}),e(T),_((s(),m(i,{clickable:"",to:{name:"dashboard"}},{default:t(()=>[e(l,{avatar:""},{default:t(()=>[e(v,{name:"dashboard"})]),_:1}),e(l,null,{default:t(()=>[r(n(a.$t("nav.dashboard")),1)]),_:1})]),_:1})),[[k]]),u(f).role==="admin"?_((s(),m(i,{key:0,clickable:"",to:{name:"admin"}},{default:t(()=>[e(l,{avatar:""},{default:t(()=>[e(v,{name:"admin_panel_settings"})]),_:1}),e(l,null,{default:t(()=>[r(n(a.$t("nav.admin")),1)]),_:1})]),_:1})),[[k]]):w("",!0),_((s(),m(i,{clickable:"",onClick:B},{default:t(()=>[e(l,{avatar:""},{default:t(()=>[e(v,{name:"logout"})]),_:1}),e(l,null,{default:t(()=>[r(n(a.$t("nav.logout")),1)]),_:1})]),_:1})),[[k]])],64)):_((s(),m(i,{key:2,clickable:"",to:{name:"login"}},{default:t(()=>[e(l,{avatar:""},{default:t(()=>[e(v,{name:"login"})]),_:1}),e(l,null,{default:t(()=>[r(n(a.$t("nav.login")),1)]),_:1})]),_:1})),[[k]]),e(T),e(g,{header:""},{default:t(()=>[r(n(a.$t("nav.language")),1)]),_:1}),(s(),y(I,null,N(V,p=>_(e(i,{key:p.value,clickable:"",onClick:K=>j(p.value)},{default:t(()=>[e(l,{avatar:""},{default:t(()=>[e(v,{name:"translate"})]),_:1}),e(l,null,{default:t(()=>[r(n(p.text),1)]),_:2},1024)]),_:2},1032,["onClick"]),[[k]])),64)),e(T),e(i,null,{default:t(()=>[e(l,{avatar:""},{default:t(()=>[e(v,{name:"brightness_medium"})]),_:1}),e(l,null,{default:t(()=>[r(n(a.$t("nav.theme")),1)]),_:1}),e(l,{side:""},{default:t(()=>[e(U)]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue","width"]),e(ie,{"data-scroll-container":""},{default:t(()=>[e(J)]),_:1})]),_:1})}}},Ye=ve(ye,[["__scopeId","data-v-bf997296"]]);export{Ye as default};
