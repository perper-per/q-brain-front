import{a9 as X,aa as v,ab as z,ac as D,ad as h,ae as y,at as _,aj as g,U as E,af as C,Z as O}from"./index-ChEIvEbX.js";import{c as P}from"./use-timeout-DssJ_8Hl.js";const q={left:!0,right:!0,up:!0,down:!0,horizontal:!0,vertical:!0},T=Object.keys(q);q.all=!0;function A(s){const n={};for(const i of T)s[i]===!0&&(n[i]=!0);return Object.keys(n).length===0?q:(n.horizontal===!0?n.left=n.right=!0:n.left===!0&&n.right===!0&&(n.horizontal=!0),n.vertical===!0?n.up=n.down=!0:n.up===!0&&n.down===!0&&(n.vertical=!0),n.horizontal===!0&&n.vertical===!0&&(n.all=!0),n)}const Y=["INPUT","TEXTAREA"];function M(s,n){return n.event===void 0&&s.target!==void 0&&s.target.draggable!==!0&&typeof n.handler=="function"&&Y.includes(s.target.nodeName.toUpperCase())===!1&&(s.qClonedBy===void 0||s.qClonedBy.indexOf(n.uid)===-1)}function b(s,n,i){const d=E(s);let e,t=d.left-n.event.x,r=d.top-n.event.y,a=Math.abs(t),o=Math.abs(r);const u=n.direction;u.horizontal===!0&&u.vertical!==!0?e=t<0?"left":"right":u.horizontal!==!0&&u.vertical===!0?e=r<0?"up":"down":u.up===!0&&r<0?(e="up",a>o&&(u.left===!0&&t<0?e="left":u.right===!0&&t>0&&(e="right"))):u.down===!0&&r>0?(e="down",a>o&&(u.left===!0&&t<0?e="left":u.right===!0&&t>0&&(e="right"))):u.left===!0&&t<0?(e="left",a<o&&(u.up===!0&&r<0?e="up":u.down===!0&&r>0&&(e="down"))):u.right===!0&&t>0&&(e="right",a<o&&(u.up===!0&&r<0?e="up":u.down===!0&&r>0&&(e="down")));let m=!1;if(e===void 0&&i===!1){if(n.event.isFirst===!0||n.event.lastDir===void 0)return{};e=n.event.lastDir,m=!0,e==="left"||e==="right"?(d.left-=t,a=0,t=0):(d.top-=r,o=0,r=0)}return{synthetic:m,payload:{evt:s,touch:n.event.mouse!==!0,mouse:n.event.mouse===!0,position:d,direction:e,isFirst:n.event.isFirst,isFinal:i===!0,duration:Date.now()-n.event.time,distance:{x:a,y:o},offset:{x:t,y:r},delta:{x:d.left-n.event.lastX,y:d.top-n.event.lastY}}}}let B=0;const S=X({name:"touch-pan",beforeMount(s,{value:n,modifiers:i}){if(i.mouse!==!0&&v.has.touch!==!0)return;function d(t,r){i.mouse===!0&&r===!0?O(t):(i.stop===!0&&g(t),i.prevent===!0&&_(t))}const e={uid:"qvtp_"+B++,handler:n,modifiers:i,direction:A(i),noop:z,mouseStart(t){M(t,e)&&D(t)&&(h(e,"temp",[[document,"mousemove","move","notPassiveCapture"],[document,"mouseup","end","passiveCapture"]]),e.start(t,!0))},touchStart(t){if(M(t,e)){const r=t.target;h(e,"temp",[[r,"touchmove","move","notPassiveCapture"],[r,"touchcancel","end","passiveCapture"],[r,"touchend","end","passiveCapture"]]),e.start(t)}},start(t,r){if(v.is.firefox===!0&&y(s,!0),e.lastEvt=t,r===!0||i.stop===!0){if(e.direction.all!==!0&&(r!==!0||e.modifiers.mouseAllDir!==!0&&e.modifiers.mousealldir!==!0)){const u=t.type.indexOf("mouse")!==-1?new MouseEvent(t.type,t):new TouchEvent(t.type,t);t.defaultPrevented===!0&&_(u),t.cancelBubble===!0&&g(u),Object.assign(u,{qKeyEvent:t.qKeyEvent,qClickOutside:t.qClickOutside,qAnchorHandled:t.qAnchorHandled,qClonedBy:t.qClonedBy===void 0?[e.uid]:t.qClonedBy.concat(e.uid)}),e.initialEvent={target:t.target,event:u}}g(t)}const{left:a,top:o}=E(t);e.event={x:a,y:o,time:Date.now(),mouse:r===!0,detected:!1,isFirst:!0,isFinal:!1,lastX:a,lastY:o}},move(t){if(e.event===void 0)return;const r=E(t),a=r.left-e.event.x,o=r.top-e.event.y;if(a===0&&o===0)return;e.lastEvt=t;const u=e.event.mouse===!0,m=()=>{d(t,u);let l;i.preserveCursor!==!0&&i.preservecursor!==!0&&(l=document.documentElement.style.cursor||"",document.documentElement.style.cursor="grabbing"),u===!0&&document.body.classList.add("no-pointer-events--children"),document.body.classList.add("non-selectable"),P(),e.styleCleanup=p=>{if(e.styleCleanup=void 0,l!==void 0&&(document.documentElement.style.cursor=l),document.body.classList.remove("non-selectable"),u===!0){const w=()=>{document.body.classList.remove("no-pointer-events--children")};p!==void 0?setTimeout(()=>{w(),p()},50):w()}else p!==void 0&&p()}};if(e.event.detected===!0){e.event.isFirst!==!0&&d(t,e.event.mouse);const{payload:l,synthetic:p}=b(t,e,!1);l!==void 0&&(e.handler(l)===!1?e.end(t):(e.styleCleanup===void 0&&e.event.isFirst===!0&&m(),e.event.lastX=l.position.left,e.event.lastY=l.position.top,e.event.lastDir=p===!0?void 0:l.direction,e.event.isFirst=!1));return}if(e.direction.all===!0||u===!0&&(e.modifiers.mouseAllDir===!0||e.modifiers.mousealldir===!0)){m(),e.event.detected=!0,e.move(t);return}const f=Math.abs(a),c=Math.abs(o);f!==c&&(e.direction.horizontal===!0&&f>c||e.direction.vertical===!0&&f<c||e.direction.up===!0&&f<c&&o<0||e.direction.down===!0&&f<c&&o>0||e.direction.left===!0&&f>c&&a<0||e.direction.right===!0&&f>c&&a>0?(e.event.detected=!0,e.move(t)):e.end(t,!0))},end(t,r){if(e.event!==void 0){if(C(e,"temp"),v.is.firefox===!0&&y(s,!1),r===!0)e.styleCleanup!==void 0&&e.styleCleanup(),e.event.detected!==!0&&e.initialEvent!==void 0&&e.initialEvent.target.dispatchEvent(e.initialEvent.event);else if(e.event.detected===!0){e.event.isFirst===!0&&e.handler(b(t===void 0?e.lastEvt:t,e).payload);const{payload:a}=b(t===void 0?e.lastEvt:t,e,!0),o=()=>{e.handler(a)};e.styleCleanup!==void 0?e.styleCleanup(o):o()}e.event=void 0,e.initialEvent=void 0,e.lastEvt=void 0}}};if(s.__qtouchpan=e,i.mouse===!0){const t=i.mouseCapture===!0||i.mousecapture===!0?"Capture":"";h(e,"main",[[s,"mousedown","mouseStart",`passive${t}`]])}v.has.touch===!0&&h(e,"main",[[s,"touchstart","touchStart",`passive${i.capture===!0?"Capture":""}`],[s,"touchmove","noop","notPassiveCapture"]])},updated(s,n){const i=s.__qtouchpan;i!==void 0&&(n.oldValue!==n.value&&(typeof value!="function"&&i.end(),i.handler=n.value),i.direction=A(n.modifiers))},beforeUnmount(s){const n=s.__qtouchpan;n!==void 0&&(n.event!==void 0&&n.end(),C(n,"main"),C(n,"temp"),v.is.firefox===!0&&y(s,!1),n.styleCleanup!==void 0&&n.styleCleanup(),delete s.__qtouchpan)}});export{S as T,A as g,M as s};
