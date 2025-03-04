import{k as D,r as v,w as q,o as z,d as h,j as Q,p as a,f as S,t as c,g as n,y as A,x as y,Q as _,z as k}from"./index-ChEIvEbX.js";import{Q as E}from"./QInput-31XwM37w.js";import{a as T}from"./QChip-CIu4f-SK.js";import{Q as C,a as Y}from"./QTable-DwNV-mJC.js";import{Q as b}from"./QTooltip-CAN7VX1O.js";import{Q as x}from"./QBtnGroup-CMBSdMne.js";import{Q as I}from"./QPage-Bwyp-dA5.js";import{u as M}from"./use-quasar-k1OqkztX.js";import{d as H}from"./date-l4rClzUB.js";import{u as R}from"./axios-t725r0Kq.js";import"./use-id-XGsYUgwM.js";import"./use-timeout-DssJ_8Hl.js";import"./use-dark-DgvYGCCd.js";import"./private.use-form-CvI_8yss.js";import"./QSeparator-D5-eFTpF.js";import"./QVirtualScroll-DhLT1v9w.js";import"./QList-BcDIOcu2.js";import"./rtl-DFPa-2ov.js";import"./QItem-Buw9SMjs.js";import"./QItemLabel-DdcmUPBL.js";import"./QDialog-CLA_l8xs.js";import"./use-prevent-scroll-DVYV8yvm.js";import"./format-dCatN8Gn.js";import"./use-fullscreen-D82m5ohn.js";const G={class:"text-h5 q-mb-md"},ve={__name:"CommentsPage",setup(O){const{t:i}=D(),r=M(),{apiAuth:p}=R(),w=v(!1),d=v([]),m=v(""),s=v({sortBy:"createdAt",descending:!0,page:1,rowsPerPage:15,rowsNumber:0}),$=[{name:"author",label:i("admin.comments.author"),field:e=>e.author.username,align:"left"},{name:"content",label:i("admin.comments.content"),field:"content",align:"left"},{name:"date",label:i("admin.comments.date"),field:"createdAt",format:e=>H.formatDate(e,"YYYY/MM/DD HH:mm"),align:"left",sortable:!0},{name:"status",label:i("admin.comments.status"),field:"status",align:"left"},{name:"actions",label:i("admin.comments.actions"),field:"actions",align:"center"}],P=e=>({pending:"warning",approved:"positive",rejected:"negative"})[e]||"grey",l=async e=>{const{page:t,rowsPerPage:o,sortBy:u,descending:V}=e.pagination;w.value=!0;try{const g={page:t,limit:o,sortBy:u,order:V?"desc":"asc",search:m.value},{data:f}=await p.get("/api/comments",{params:g});f&&f.items?(d.value=f.items,s.value.rowsNumber=f.total||0):(d.value=[],s.value.rowsNumber=0),s.value.page=t,s.value.rowsPerPage=o}catch(g){console.error("Error loading comments:",g),d.value=[],r.notify({type:"negative",message:g.response?.data?.message||"載入失敗",position:"top"})}finally{w.value=!1}},j=async e=>{try{await p.patch(`/api/comments/${e.id}/approve`),await l({pagination:s.value}),r.notify({type:"positive",message:i("admin.comments.approveSuccess"),position:"top"})}catch(t){console.error("Error approving comment:",t),r.notify({type:"negative",message:t.response?.data?.message||"審核失敗",position:"top"})}},B=async e=>{try{await p.patch(`/api/comments/${e.id}/reject`),await l({pagination:s.value}),r.notify({type:"positive",message:i("admin.comments.rejectSuccess"),position:"top"})}catch(t){console.error("Error rejecting comment:",t),r.notify({type:"negative",message:t.response?.data?.message||"拒絕失敗",position:"top"})}},N=e=>{r.dialog({title:i("admin.comments.delete"),message:i("admin.comments.confirmDelete"),cancel:!0,persistent:!0}).onOk(async()=>{try{await p.delete(`/api/comments/${e.id}`),await l({pagination:s.value}),r.notify({type:"positive",message:i("admin.comments.deleteSuccess"),position:"top"})}catch(t){console.error("Error deleting comment:",t),r.notify({type:"negative",message:t.response?.data?.message||"刪除失敗",position:"top"})}})};return q(m,()=>{s.value.page=1,l({pagination:s.value})}),z(()=>{l({pagination:s.value})}),(e,t)=>(h(),Q(I,{class:"q-pa-md"},{default:a(()=>[S("div",G,c(e.$t("admin.comments.title")),1),n(Y,{rows:d.value,columns:$,"row-key":"id",loading:w.value,pagination:s.value,onRequest:l,filter:m.value,"virtual-scroll":"","virtual-scroll-slice-size":15,"virtual-scroll-item-size":48,"virtual-scroll-sticky-size-start":48},{"top-right":a(()=>[n(E,{borderless:"",dense:"",debounce:"300",modelValue:m.value,"onUpdate:modelValue":t[0]||(t[0]=o=>m.value=o),placeholder:"搜尋"},{append:a(()=>[n(A,{name:"search"})]),_:1},8,["modelValue"])]),"body-cell-status":a(o=>[n(C,{props:o},{default:a(()=>[n(T,{color:P(o.row.status),"text-color":"white",size:"sm"},{default:a(()=>[y(c(e.$t(`admin.comments.statuses.${o.row.status}`)),1)]),_:2},1032,["color"])]),_:2},1032,["props"])]),"body-cell-actions":a(o=>[n(C,{props:o},{default:a(()=>[n(x,{flat:""},{default:a(()=>[o.row.status==="pending"?(h(),Q(_,{key:0,flat:"",round:"",color:"positive",icon:"check",onClick:u=>j(o.row)},{default:a(()=>[n(b,null,{default:a(()=>[y(c(e.$t("admin.comments.approve")),1)]),_:1})]),_:2},1032,["onClick"])):k("",!0),o.row.status==="pending"?(h(),Q(_,{key:1,flat:"",round:"",color:"negative",icon:"close",onClick:u=>B(o.row)},{default:a(()=>[n(b,null,{default:a(()=>[y(c(e.$t("admin.comments.reject")),1)]),_:1})]),_:2},1032,["onClick"])):k("",!0),n(_,{flat:"",round:"",color:"negative",icon:"delete",onClick:u=>N(o.row)},{default:a(()=>[n(b,null,{default:a(()=>[y(c(e.$t("admin.comments.delete")),1)]),_:1})]),_:2},1032,["onClick"])]),_:2},1024)]),_:2},1032,["props"])]),_:1},8,["rows","loading","pagination","filter"])]),_:1}))}};export{ve as default};
