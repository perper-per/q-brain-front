import{Q as ye}from"./QList-rM9Z_DP2.js";import{a as qe,u as Me}from"./use-dark-D0HcajEw.js";import{i as se,n as R,j as y,a7 as Ve,$ as ue,ag as Ee,r as B,w as j,aR as Ae,L as fe,a4 as de,a5 as Se,d as ve,M as Te,aS as _e,o as ke,aT as Re,aU as ne,V as xe}from"./index-CDoy4HMt.js";import{r as Z}from"./rtl-DFPa-2ov.js";const Fe=["horizontal","vertical","cell","none"],Be=se({name:"QMarkupTable",props:{...qe,dense:Boolean,flat:Boolean,bordered:Boolean,square:Boolean,wrapCells:Boolean,separator:{type:String,default:"horizontal",validator:e=>Fe.includes(e)}},setup(e,{slots:o}){const f=ue(),s=Me(e,f.proxy.$q),m=R(()=>`q-markup-table q-table__container q-table__card q-table--${e.separator}-separator`+(s.value===!0?" q-table--dark q-table__card--dark q-dark":"")+(e.dense===!0?" q-table--dense":"")+(e.flat===!0?" q-table--flat":"")+(e.bordered===!0?" q-table--bordered":"")+(e.square===!0?" q-table--square":"")+(e.wrapCells===!1?" q-table--no-wrap":""));return()=>y("div",{class:m.value},[y("table",{class:"q-table"},Ve(o.default))])}});function Oe(e,o){return y("div",e,[y("table",{class:"q-table"},o)])}const E=1e3,He=["start","center","end","start-force","center-force","end-force"],me=Array.prototype.filter,Ce=window.getComputedStyle(document.body).overflowAnchor===void 0?Ee:function(e,o){e!==null&&(e._qOverflowAnimationFrame!==void 0&&cancelAnimationFrame(e._qOverflowAnimationFrame),e._qOverflowAnimationFrame=requestAnimationFrame(()=>{if(e===null)return;e._qOverflowAnimationFrame=void 0;const f=e.children||[];me.call(f,m=>m.dataset&&m.dataset.qVsAnchor!==void 0).forEach(m=>{delete m.dataset.qVsAnchor});const s=f[o];s&&s.dataset&&(s.dataset.qVsAnchor="")}))};function C(e,o){return e+o}function K(e,o,f,s,m,i,p,q){const h=e===window?document.scrollingElement||document.documentElement:e,z=m===!0?"offsetWidth":"offsetHeight",r={scrollStart:0,scrollViewSize:-p-q,scrollMaxSize:0,offsetStart:-p,offsetEnd:-q};if(m===!0?(e===window?(r.scrollStart=window.pageXOffset||window.scrollX||document.body.scrollLeft||0,r.scrollViewSize+=document.documentElement.clientWidth):(r.scrollStart=h.scrollLeft,r.scrollViewSize+=h.clientWidth),r.scrollMaxSize=h.scrollWidth,i===!0&&(r.scrollStart=(Z===!0?r.scrollMaxSize-r.scrollViewSize:0)-r.scrollStart)):(e===window?(r.scrollStart=window.pageYOffset||window.scrollY||document.body.scrollTop||0,r.scrollViewSize+=document.documentElement.clientHeight):(r.scrollStart=h.scrollTop,r.scrollViewSize+=h.clientHeight),r.scrollMaxSize=h.scrollHeight),f!==null)for(let S=f.previousElementSibling;S!==null;S=S.previousElementSibling)S.classList.contains("q-virtual-scroll--skip")===!1&&(r.offsetStart+=S[z]);if(s!==null)for(let S=s.nextElementSibling;S!==null;S=S.nextElementSibling)S.classList.contains("q-virtual-scroll--skip")===!1&&(r.offsetEnd+=S[z]);if(o!==e){const S=h.getBoundingClientRect(),w=o.getBoundingClientRect();m===!0?(r.offsetStart+=w.left-S.left,r.offsetEnd-=w.width):(r.offsetStart+=w.top-S.top,r.offsetEnd-=w.height),e!==window&&(r.offsetStart+=r.scrollStart),r.offsetEnd+=r.scrollMaxSize-r.offsetStart}return r}function ce(e,o,f,s){o==="end"&&(o=(e===window?document.body:e)[f===!0?"scrollWidth":"scrollHeight"]),e===window?f===!0?(s===!0&&(o=(Z===!0?document.body.scrollWidth-document.documentElement.clientWidth:0)-o),window.scrollTo(o,window.pageYOffset||window.scrollY||document.body.scrollTop||0)):window.scrollTo(window.pageXOffset||window.scrollX||document.body.scrollLeft||0,o):f===!0?(s===!0&&(o=(Z===!0?e.scrollWidth-e.offsetWidth:0)-o),e.scrollLeft=o):e.scrollTop=o}function L(e,o,f,s){if(f>=s)return 0;const m=o.length,i=Math.floor(f/E),p=Math.floor((s-1)/E)+1;let q=e.slice(i,p).reduce(C,0);return f%E!==0&&(q-=o.slice(i*E,f).reduce(C,0)),s%E!==0&&s!==m&&(q-=o.slice(s,p*E).reduce(C,0)),q}const ge={virtualScrollSliceSize:{type:[Number,String],default:10},virtualScrollSliceRatioBefore:{type:[Number,String],default:1},virtualScrollSliceRatioAfter:{type:[Number,String],default:1},virtualScrollItemSize:{type:[Number,String],default:24},virtualScrollStickySizeStart:{type:[Number,String],default:0},virtualScrollStickySizeEnd:{type:[Number,String],default:0},tableColspan:[Number,String]},Ye=Object.keys(ge),Le={virtualScrollHorizontal:Boolean,onVirtualScroll:Function,...ge};function Pe({virtualScrollLength:e,getVirtualScrollTarget:o,getVirtualScrollEl:f,virtualScrollItemSizeComputed:s}){const m=ue(),{props:i,emit:p,proxy:q}=m,{$q:h}=q;let z,r,S,w=[],d;const _=B(0),A=B(0),k=B({}),x=B(null),V=B(null),F=B(null),g=B({from:0,to:0}),I=R(()=>i.tableColspan!==void 0?i.tableColspan:100);s===void 0&&(s=R(()=>i.virtualScrollItemSize));const ee=R(()=>s.value+";"+i.virtualScrollHorizontal),we=R(()=>ee.value+";"+i.virtualScrollSliceRatioBefore+";"+i.virtualScrollSliceRatioAfter);j(we,()=>{H()}),j(ee,X);function X(){U(r,!0)}function le(l){U(l===void 0?r:l)}function P(l,t){const a=o();if(a==null||a.nodeType===8)return;const v=K(a,f(),x.value,V.value,i.virtualScrollHorizontal,h.lang.rtl,i.virtualScrollStickySizeStart,i.virtualScrollStickySizeEnd);S!==v.scrollViewSize&&H(v.scrollViewSize),W(a,v,Math.min(e.value-1,Math.max(0,parseInt(l,10)||0)),0,He.indexOf(t)!==-1?t:r!==-1&&l>r?"end":"start")}function he(){const l=o();if(l==null||l.nodeType===8)return;const t=K(l,f(),x.value,V.value,i.virtualScrollHorizontal,h.lang.rtl,i.virtualScrollStickySizeStart,i.virtualScrollStickySizeEnd),a=e.value-1,v=t.scrollMaxSize-t.offsetStart-t.offsetEnd-A.value;if(z===t.scrollStart)return;if(t.scrollMaxSize<=0){W(l,t,0,0);return}S!==t.scrollViewSize&&H(t.scrollViewSize),Y(g.value.from);const b=Math.floor(t.scrollMaxSize-Math.max(t.scrollViewSize,t.offsetEnd)-Math.min(d[a],t.scrollViewSize/2));if(b>0&&Math.ceil(t.scrollStart)>=b){W(l,t,a,t.scrollMaxSize-t.offsetEnd-w.reduce(C,0));return}let u=0,c=t.scrollStart-t.offsetStart,M=c;if(c<=v&&c+t.scrollViewSize>=_.value)c-=_.value,u=g.value.from,M=c;else for(let n=0;c>=w[n]&&u<a;n++)c-=w[n],u+=E;for(;c>0&&u<a;)c-=d[u],c>-t.scrollViewSize?(u++,M=c):M=d[u]+c;W(l,t,u,M)}function W(l,t,a,v,b){const u=typeof b=="string"&&b.indexOf("-force")!==-1,c=u===!0?b.replace("-force",""):b,M=c!==void 0?c:"start";let n=Math.max(0,a-k.value[M]),T=n+k.value.total;T>e.value&&(T=e.value,n=Math.max(0,T-k.value.total)),z=t.scrollStart;const $=n!==g.value.from||T!==g.value.to;if($===!1&&c===void 0){re(a);return}const{activeElement:ae}=document,O=F.value;$===!0&&O!==null&&O!==ae&&O.contains(ae)===!0&&(O.addEventListener("focusout",te),setTimeout(()=>{O!==null&&O.removeEventListener("focusout",te)})),Ce(O,a-n);const pe=c!==void 0?d.slice(n,a).reduce(C,0):0;if($===!0){const N=T>=g.value.from&&n<=g.value.to?g.value.to:T;g.value={from:n,to:N},_.value=L(w,d,0,n),A.value=L(w,d,T,e.value),requestAnimationFrame(()=>{g.value.to!==T&&z===t.scrollStart&&(g.value={from:g.value.from,to:T},A.value=L(w,d,T,e.value))})}requestAnimationFrame(()=>{if(z!==t.scrollStart)return;$===!0&&Y(n);const N=d.slice(n,a).reduce(C,0),Q=N+t.offsetStart+_.value,ie=Q+d[a];let G=Q+v;if(c!==void 0){const ze=N-pe,J=t.scrollStart+ze;G=u!==!0&&J<Q&&ie<J+t.scrollViewSize?J:c==="end"?ie-t.scrollViewSize:Q-(c==="start"?0:Math.round((t.scrollViewSize-d[a])/2))}z=G,ce(l,G,i.virtualScrollHorizontal,h.lang.rtl),re(a)})}function Y(l){const t=F.value;if(t){const a=me.call(t.children,n=>n.classList&&n.classList.contains("q-virtual-scroll--skip")===!1),v=a.length,b=i.virtualScrollHorizontal===!0?n=>n.getBoundingClientRect().width:n=>n.offsetHeight;let u=l,c,M;for(let n=0;n<v;){for(c=b(a[n]),n++;n<v&&a[n].classList.contains("q-virtual-scroll--with-prev")===!0;)c+=b(a[n]),n++;M=c-d[u],M!==0&&(d[u]+=M,w[Math.floor(u/E)]+=M),u++}}}function te(){F.value!==null&&F.value!==void 0&&F.value.focus()}function U(l,t){const a=1*s.value;(t===!0||Array.isArray(d)===!1)&&(d=[]);const v=d.length;d.length=e.value;for(let u=e.value-1;u>=v;u--)d[u]=a;const b=Math.floor((e.value-1)/E);w=[];for(let u=0;u<=b;u++){let c=0;const M=Math.min((u+1)*E,e.value);for(let n=u*E;n<M;n++)c+=d[n];w.push(c)}r=-1,z=void 0,_.value=L(w,d,0,g.value.from),A.value=L(w,d,g.value.to,e.value),l>=0?(Y(g.value.from),Te(()=>{P(l)})):D()}function H(l){if(l===void 0&&typeof window<"u"){const c=o();c!=null&&c.nodeType!==8&&(l=K(c,f(),x.value,V.value,i.virtualScrollHorizontal,h.lang.rtl,i.virtualScrollStickySizeStart,i.virtualScrollStickySizeEnd).scrollViewSize)}S=l;const t=parseFloat(i.virtualScrollSliceRatioBefore)||0,a=parseFloat(i.virtualScrollSliceRatioAfter)||0,v=1+t+a,b=l===void 0||l<=0?1:Math.ceil(l/s.value),u=Math.max(1,b,Math.ceil((i.virtualScrollSliceSize>0?i.virtualScrollSliceSize:10)/v));k.value={total:Math.ceil(u*v),start:Math.ceil(u*t),center:Math.ceil(u*(.5+t)),end:Math.ceil(u*(1+t)),view:b}}function be(l,t){const a=i.virtualScrollHorizontal===!0?"width":"height",v={["--q-virtual-scroll-item-"+a]:s.value+"px"};return[l==="tbody"?y(l,{class:"q-virtual-scroll__padding",key:"before",ref:x},[y("tr",[y("td",{style:{[a]:`${_.value}px`,...v},colspan:I.value})])]):y(l,{class:"q-virtual-scroll__padding",key:"before",ref:x,style:{[a]:`${_.value}px`,...v}}),y(l,{class:"q-virtual-scroll__content",key:"content",ref:F,tabindex:-1},t.flat()),l==="tbody"?y(l,{class:"q-virtual-scroll__padding",key:"after",ref:V},[y("tr",[y("td",{style:{[a]:`${A.value}px`,...v},colspan:I.value})])]):y(l,{class:"q-virtual-scroll__padding",key:"after",ref:V,style:{[a]:`${A.value}px`,...v}})]}function re(l){r!==l&&(i.onVirtualScroll!==void 0&&p("virtualScroll",{index:l,from:g.value.from,to:g.value.to-1,direction:l<r?"decrease":"increase",ref:q}),r=l)}H();const D=Ae(he,h.platform.is.ios===!0?120:35);fe(()=>{H()});let oe=!1;return de(()=>{oe=!0}),Se(()=>{if(oe!==!0)return;const l=o();z!==void 0&&l!==void 0&&l!==null&&l.nodeType!==8?ce(l,z,i.virtualScrollHorizontal,h.lang.rtl):P(r)}),ve(()=>{D.cancel()}),Object.assign(q,{scrollTo:P,reset:X,refresh:le}),{virtualScrollSliceRange:g,virtualScrollSliceSizeComputed:k,setVirtualScrollSize:H,onVirtualScrollEvt:D,localResetVirtualScroll:U,padVirtualScroll:be,scrollTo:P,reset:X,refresh:le}}const We={list:ye,table:Be},$e=["list","table","__qtable"],Ue=se({name:"QVirtualScroll",props:{...Le,type:{type:String,default:"list",validator:e=>$e.includes(e)},items:{type:Array,default:()=>[]},itemsFn:Function,itemsSize:Number,scrollTarget:_e},setup(e,{slots:o,attrs:f}){let s;const m=B(null),i=R(()=>e.itemsSize>=0&&e.itemsFn!==void 0?parseInt(e.itemsSize,10):Array.isArray(e.items)?e.items.length:0),{virtualScrollSliceRange:p,localResetVirtualScroll:q,padVirtualScroll:h,onVirtualScrollEvt:z}=Pe({virtualScrollLength:i,getVirtualScrollTarget:_,getVirtualScrollEl:d}),r=R(()=>{if(i.value===0)return[];const V=(F,g)=>({index:p.value.from+g,item:F});return e.itemsFn===void 0?e.items.slice(p.value.from,p.value.to).map(V):e.itemsFn(p.value.from,p.value.to-p.value.from).map(V)}),S=R(()=>"q-virtual-scroll q-virtual-scroll"+(e.virtualScrollHorizontal===!0?"--horizontal":"--vertical")+(e.scrollTarget!==void 0?"":" scroll")),w=R(()=>e.scrollTarget!==void 0?{}:{tabindex:0});j(i,()=>{q()}),j(()=>e.scrollTarget,()=>{k(),A()});function d(){return m.value.$el||m.value}function _(){return s}function A(){s=Re(d(),e.scrollTarget),s.addEventListener("scroll",z,ne.passive)}function k(){s!==void 0&&(s.removeEventListener("scroll",z,ne.passive),s=void 0)}function x(){let V=h(e.type==="list"?"div":"tbody",r.value.map(o.default));return o.before!==void 0&&(V=o.before().concat(V)),xe(o.after,V)}return fe(()=>{q()}),ke(()=>{A()}),Se(()=>{A()}),de(()=>{k()}),ve(()=>{k()}),()=>{if(o.default===void 0){console.error("QVirtualScroll: default scoped slot is required for rendering");return}return e.type==="__qtable"?Oe({ref:m,class:"q-table__middle "+S.value},x()):y(We[e.type],{...f,ref:m,class:[f.class,S.value],...w.value},x)}}});export{Ue as Q,Pe as a,Ye as c,Oe as g,Le as u};
