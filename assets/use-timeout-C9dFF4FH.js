import{bc as A,w as T,aZ as H,o as R,Y as M,J as y,a1 as S,d as x,aF as P}from"./index-C-xpmZAv.js";function v(){if(window.getSelection!==void 0){const u=window.getSelection();u.empty!==void 0?u.empty():u.removeAllRanges!==void 0&&(u.removeAllRanges(),A.is.mobile!==!0&&u.addRange(document.createRange()))}else document.selection!==void 0&&document.selection.empty()}const B={modelValue:{type:Boolean,default:null},"onUpdate:modelValue":[Function,Array]},D=["beforeShow","show","beforeHide","hide"];function F({showing:u,canShow:a,hideOnRouteChange:l,handleShow:d,handleHide:s,processOnMount:U}){const r=M(),{props:n,emit:t,proxy:c}=r;let o;function w(e){u.value===!0?f(e):m(e)}function m(e){if(n.disable===!0||e!==void 0&&e.qAnchorHandled===!0||a!==void 0&&a(e)!==!0)return;const i=n["onUpdate:modelValue"]!==void 0;i===!0&&(t("update:modelValue",!0),o=e,y(()=>{o===e&&(o=void 0)})),(n.modelValue===null||i===!1)&&p(e)}function p(e){u.value!==!0&&(u.value=!0,t("beforeShow",e),d!==void 0?d(e):t("show",e))}function f(e){if(n.disable===!0)return;const i=n["onUpdate:modelValue"]!==void 0;i===!0&&(t("update:modelValue",!1),o=e,y(()=>{o===e&&(o=void 0)})),(n.modelValue===null||i===!1)&&b(e)}function b(e){u.value!==!1&&(u.value=!1,t("beforeHide",e),s!==void 0?s(e):t("hide",e))}function V(e){n.disable===!0&&e===!0?n["onUpdate:modelValue"]!==void 0&&t("update:modelValue",!1):e===!0!==u.value&&(e===!0?p:b)(o)}T(()=>n.modelValue,V),l!==void 0&&H(r)===!0&&T(()=>c.$route.fullPath,()=>{l.value===!0&&u.value===!0&&f()}),U===!0&&R(()=>{V(n.modelValue)});const g={show:m,hide:f,toggle:w};return Object.assign(c,g),g}function I(){let u=null;const a=M();function l(){u!==null&&(clearTimeout(u),u=null)}return S(l),x(l),{removeTimeout:l,registerTimeout(d,s){l(),P(a)===!1&&(u=setTimeout(()=>{u=null,d()},s))}}}export{B as a,D as b,v as c,F as d,I as u};
