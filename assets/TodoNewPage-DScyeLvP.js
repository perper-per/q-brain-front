import{Q as n}from"./QInput-CDY8LMS6.js";import{u as q,Q as C,C as y,f as T}from"./ContainerComp-BczhJVIY.js";import{Q as x}from"./QCard-CE2otpHT.js";import{Q as V,a as m}from"./QItem-8UxAzF0w.js";import{u as B,V as N,r as S,e as d,k as u,q as a,h as t,g as r,f as w,B as D,Q as p,F as U,z as I,y as f,A}from"./index-C-xpmZAv.js";import{Q as L}from"./QList-PkyEnzbd.js";import{Q as E}from"./QPage-Bc7DMt7Q.js";import"./use-id-Beu2uHRI.js";import"./use-timeout-C9dFF4FH.js";import"./use-dark-C2GkM102.js";import"./private.use-form-C2pDNVHz.js";import"./QBtnDropdown-DYNqHm4z.js";import"./QBtnGroup-DDshPcgs.js";import"./QTooltip-DgCstHqf.js";import"./use-fullscreen-BvG0t_7e.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";const F={class:"q-mt-md"},P={class:"text-center text-primary"},z={class:"q-mt-md"},oe={__name:"TodoNewPage",setup(M){const b=B(),Q=q(),o=N({title:"",description:"",content:""}),s=S([]),k=()=>{s.value.push({id:Date.now()+Math.random().toString(36).substring(2,9),title:"",completed:!1})},g=i=>{s.value.splice(i,1)},_=i=>{if(i&&i.preventDefault(),!o.title.trim()){alert("請輸入待辦標題");return}const e=s.value.filter(l=>l.title.trim()!=="").map(l=>({id:l.id,title:l.title,completed:!1}));Q.value.unshift({...o,createdAt:Date.now(),updatedAt:T(Date.now()),completed:!1,subTasks:e}),b.push("/site/todo"),o.title="",o.description="",o.content="",s.value=[]};return(i,e)=>(d(),u(E,{padding:""},{default:a(()=>[t(y,null,{default:a(()=>[e[7]||(e[7]=r("h3",null,"新的待辦事項",-1)),r("form",{onSubmit:_},[t(n,{class:"q-mt-sm",outlined:"",modelValue:o.title,"onUpdate:modelValue":e[0]||(e[0]=l=>o.title=l),label:"標題"},null,8,["modelValue"]),t(n,{class:"q-mt-sm",outlined:"",modelValue:o.description,"onUpdate:modelValue":e[1]||(e[1]=l=>o.description=l),label:"描述",dense:""},null,8,["modelValue"]),t(x,{flat:"",bordered:"",class:"q-mt-sm"},{default:a(()=>[t(C,{modelValue:o.content,"onUpdate:modelValue":e[2]||(e[2]=l=>o.content=l),"min-height":"5rem"},null,8,["modelValue"])]),_:1}),r("div",F,[e[4]||(e[4]=r("div",{class:"text-subtitle1 q-mb-sm"},"子任務",-1)),t(L,{bordered:"",separator:"",class:"rounded-borders"},{default:a(()=>[(d(!0),w(U,null,D(s.value,(l,c)=>(d(),u(V,{key:c},{default:a(()=>[t(m,null,{default:a(()=>[t(n,{dense:"",outlined:"",modelValue:l.title,"onUpdate:modelValue":v=>l.title=v,label:"子任務標題"},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024),t(m,{side:""},{default:a(()=>[t(p,{flat:"",round:"",color:"negative",icon:"delete",onClick:v=>g(c)},null,8,["onClick"])]),_:2},1024)]),_:2},1024))),128)),s.value.length<10?(d(),u(V,{key:0,clickable:"",onClick:k},{default:a(()=>[t(m,null,{default:a(()=>[r("div",P,[t(I,{name:"add"}),e[3]||(e[3]=f(" 添加子任務 "))])]),_:1})]),_:1})):A("",!0)]),_:1})]),r("div",z,[t(p,{color:"grey",to:"/site/todo",type:"reset"},{default:a(()=>e[5]||(e[5]=[f("取消")])),_:1}),t(p,{class:"q-ml-sm",color:"positive",type:"submit"},{default:a(()=>e[6]||(e[6]=[f("創建")])),_:1})])],32)]),_:1})]),_:1}))}};export{oe as default};
