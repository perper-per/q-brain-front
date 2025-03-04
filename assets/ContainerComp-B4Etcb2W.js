import{ab as de,a2 as fe,i as u,aj as he,a8 as U,at as j,Q as O,y as pe,h as ge,r as z,m,w as H,o as me,a as ye,W as ve,Z as ke,H as Ce,d as we,e as Se,au as be}from"./index-ChEIvEbX.js";import{Q as Te}from"./QBtnDropdown-BwA6RLrf.js";import{Q as xe}from"./QTooltip-CAN7VX1O.js";import{a as D,Q as ze}from"./QItem-Buw9SMjs.js";import{a as Pe,u as qe}from"./use-dark-DgvYGCCd.js";import{u as Le,a as Be,b as $e}from"./use-fullscreen-D82m5ohn.js";import{u as _e}from"./QInput-31XwM37w.js";import{d as Ne}from"./use-id-XGsYUgwM.js";import{_ as Oe}from"./_plugin-vue_export-helper-DlAUqK2U.js";function Q(t,e){if(e&&t===e)return null;const o=t.nodeName.toLowerCase();if(["div","li","ul","ol","blockquote"].includes(o)===!0)return t;const r=window.getComputedStyle?window.getComputedStyle(t):t.currentStyle,l=r.display;return l==="block"||l==="table"?t:Q(t.parentNode)}function _(t,e,o){return!t||t===document.body?!1:o===!0&&t===e||(e===document?document.body:e).contains(t.parentNode)}function M(t,e,o){if(o||(o=document.createRange(),o.selectNode(t),o.setStart(t,0)),e.count===0)o.setEnd(t,e.count);else if(e.count>0)if(t.nodeType===Node.TEXT_NODE)t.textContent.length<e.count?e.count-=t.textContent.length:(o.setEnd(t,e.count),e.count=0);else for(let r=0;e.count!==0&&r<t.childNodes.length;r++)o=M(t.childNodes[r],e,o);return o}const He=/^https?:\/\//;class Ee{constructor(e,o){this.el=e,this.eVm=o,this._range=null}get selection(){if(this.el){const e=document.getSelection();if(_(e.anchorNode,this.el,!0)&&_(e.focusNode,this.el,!0))return e}return null}get hasSelection(){return this.selection!==null?this.selection.toString().length!==0:!1}get range(){const e=this.selection;return e!==null&&e.rangeCount?e.getRangeAt(0):this._range}get parent(){const e=this.range;if(e!==null){const o=e.startContainer;return o.nodeType===document.ELEMENT_NODE?o:o.parentNode}return null}get blockParent(){const e=this.parent;return e!==null?Q(e,this.el):null}save(e=this.range){e!==null&&(this._range=e)}restore(e=this._range){const o=document.createRange(),r=document.getSelection();e!==null?(o.setStart(e.startContainer,e.startOffset),o.setEnd(e.endContainer,e.endOffset),r.removeAllRanges(),r.addRange(o)):(r.selectAllChildren(this.el),r.collapseToEnd())}savePosition(){let e=-1,o;const r=document.getSelection(),l=this.el.parentNode;if(r.focusNode&&_(r.focusNode,l))for(o=r.focusNode,e=r.focusOffset;o&&o!==l;)o!==this.el&&o.previousSibling?(o=o.previousSibling,e+=o.textContent.length):o=o.parentNode;this.savedPos=e}restorePosition(e=0){if(this.savedPos>0&&this.savedPos<e){const o=window.getSelection(),r=M(this.el,{count:this.savedPos});r&&(r.collapse(!1),o.removeAllRanges(),o.addRange(r))}}hasParent(e,o){const r=o?this.parent:this.blockParent;return r!==null?r.nodeName.toLowerCase()===e.toLowerCase():!1}hasParents(e,o,r=this.parent){return r===null?!1:e.includes(r.nodeName.toLowerCase())===!0?!0:o===!0?this.hasParents(e,o,r.parentNode):!1}is(e,o){if(this.selection===null)return!1;switch(e){case"formatBlock":return o==="DIV"&&this.parent===this.el||this.hasParent(o,o==="PRE");case"link":return this.hasParent("A",!0);case"fontSize":return document.queryCommandValue(e)===o;case"fontName":const r=document.queryCommandValue(e);return r===`"${o}"`||r===o;case"fullscreen":return this.eVm.inFullscreen.value;case"viewsource":return this.eVm.isViewingSource.value;case void 0:return!1;default:const l=document.queryCommandState(e);return o!==void 0?l===o:l}}getParentAttribute(e){return this.parent!==null?this.parent.getAttribute(e):null}can(e){if(e==="outdent")return this.hasParents(["blockquote","li"],!0);if(e==="indent")return this.hasParents(["li"],!0);if(e==="link")return this.selection!==null||this.is("link")}apply(e,o,r=de){if(e==="formatBlock")["BLOCKQUOTE","H1","H2","H3","H4","H5","H6"].includes(o)&&this.is(e,o)&&(e="outdent",o=null),o==="PRE"&&this.is(e,"PRE")&&(o="P");else if(e==="print"){r();const l=window.open();l.document.write(`
        <!doctype html>
        <html>
          <head>
            <title>Print - ${document.title}</title>
          </head>
          <body>
            <div>${this.el.innerHTML}</div>
          </body>
        </html>
      `),l.print(),l.close();return}else if(e==="link"){const l=this.getParentAttribute("href");if(l===null){const d=this.selectWord(this.selection),a=d?d.toString():"";if(!a.length&&(!this.range||!this.range.cloneContents().querySelector("img")))return;this.eVm.editLinkUrl.value=He.test(a)?a:"https://",document.execCommand("createLink",!1,this.eVm.editLinkUrl.value),this.save(d.getRangeAt(0))}else this.eVm.editLinkUrl.value=l,this.range.selectNodeContents(this.parent),this.save();return}else if(e==="fullscreen"){this.eVm.toggleFullscreen(),r();return}else if(e==="viewsource"){this.eVm.isViewingSource.value=this.eVm.isViewingSource.value===!1,this.eVm.setContent(this.eVm.props.modelValue),r();return}document.execCommand(e,!1,o),r()}selectWord(e){if(e===null||e.isCollapsed!==!0||e.modify===void 0)return e;const o=document.createRange();o.setStart(e.anchorNode,e.anchorOffset),o.setEnd(e.focusNode,e.focusOffset);const r=o.collapsed?["backward","forward"]:["forward","backward"];o.detach();const l=e.focusNode,d=e.focusOffset;return e.collapse(e.anchorNode,e.anchorOffset),e.modify("move",r[0],"character"),e.modify("move",r[1],"word"),e.extend(l,d),e.modify("extend",r[1],"character"),e.modify("extend",r[0],"word"),e}}function K(t,e,o){e.handler?e.handler(t,o,o.caret):o.runCmd(e.cmd,e.param)}function E(t){return u("div",{class:"q-editor__toolbar-group"},t)}function W(t,e,o,r=!1){const l=r||(e.type==="toggle"?e.toggled?e.toggled(t):e.cmd&&t.caret.is(e.cmd,e.param):!1),d=[];if(e.tip&&t.$q.platform.is.desktop){const a=e.key?u("div",[u("small",`(CTRL + ${String.fromCharCode(e.key)})`)]):null;d.push(u(xe,{delay:1e3},()=>[u("div",{innerHTML:e.tip}),a]))}return u(O,{...t.buttonProps.value,icon:e.icon!==null?e.icon:void 0,color:l?e.toggleColor||t.props.toolbarToggleColor:e.color||t.props.toolbarColor,textColor:l&&!t.props.toolbarPush?null:e.textColor||t.props.toolbarTextColor,label:e.label,disable:e.disable?typeof e.disable=="function"?e.disable(t):!0:!1,size:"sm",onClick(a){o&&o(),K(a,e,t)}},()=>d)}function Re(t,e){const o=e.list==="only-icons";let r=e.label,l=e.icon!==null?e.icon:void 0,d,a;function p(){v.component.proxy.hide()}if(o)a=e.options.map(s=>{const y=s.type===void 0?t.caret.is(s.cmd,s.param):!1;return y&&(r=s.tip,l=s.icon!==null?s.icon:void 0),W(t,s,p,y)}),d=t.toolbarBackgroundClass.value,a=[E(a)];else{const s=t.props.toolbarToggleColor!==void 0?`text-${t.props.toolbarToggleColor}`:null,y=t.props.toolbarTextColor!==void 0?`text-${t.props.toolbarTextColor}`:null,b=e.list==="no-icons";a=e.options.map(f=>{const P=f.disable?f.disable(t):!1,w=f.type===void 0?t.caret.is(f.cmd,f.param):!1;w&&(r=f.tip,l=f.icon!==null?f.icon:void 0);const T=f.htmlTip;return u(ze,{active:w,activeClass:s,clickable:!0,disable:P,dense:!0,onClick(x){p(),t.contentRef.value!==null&&t.contentRef.value.focus(),t.caret.restore(),K(x,f,t)}},()=>[b===!0?null:u(D,{class:w?s:y,side:!0},()=>u(pe,{name:f.icon!==null?f.icon:void 0})),u(D,T?()=>u("div",{class:"text-no-wrap",innerHTML:f.htmlTip}):f.tip?()=>u("div",{class:"text-no-wrap"},f.tip):void 0)])}),d=[t.toolbarBackgroundClass.value,y]}const C=e.highlight&&r!==e.label,v=u(Te,{...t.buttonProps.value,noCaps:!0,noWrap:!0,color:C?t.props.toolbarToggleColor:t.props.toolbarColor,textColor:C&&!t.props.toolbarPush?null:t.props.toolbarTextColor,label:e.fixedLabel?e.label:r,icon:e.fixedIcon?e.icon!==null?e.icon:void 0:l,contentClass:d,onShow:s=>t.emit("dropdownShow",s),onHide:s=>t.emit("dropdownHide",s),onBeforeShow:s=>t.emit("dropdownBeforeShow",s),onBeforeHide:s=>t.emit("dropdownBeforeHide",s)},()=>a);return v}function Fe(t){if(t.caret)return t.buttons.value.filter(e=>!t.isViewingSource.value||e.find(o=>o.cmd==="viewsource")).map(e=>E(e.map(o=>t.isViewingSource.value&&o.cmd!=="viewsource"?!1:o.type==="slot"?fe(t.slots[o.slot]):o.type==="dropdown"?Re(t,o):W(t,o))))}function Ae(t,e,o,r={}){const l=Object.keys(r);if(l.length===0)return{};const d={default_font:{cmd:"fontName",param:t,icon:o,tip:e}};return l.forEach(a=>{const p=r[a];d[a]={cmd:"fontName",param:p,icon:o,tip:p,htmlTip:`<font face="${p}">${p}</font>`}}),d}function je(t){if(t.caret){const e=t.props.toolbarColor||t.props.toolbarTextColor;let o=t.editLinkUrl.value;const r=()=>{t.caret.restore(),o!==t.editLinkUrl.value&&document.execCommand("createLink",!1,o===""?" ":o),t.editLinkUrl.value=null};return[u("div",{class:`q-mx-xs text-${e}`},`${t.$q.lang.editor.url}: `),u("input",{key:"qedt_btm_input",class:"col q-editor__link-input",value:o,onInput:l=>{he(l),o=l.target.value},onKeydown:l=>{if(U(l)!==!0)switch(l.keyCode){case 13:return j(l),r();case 27:j(l),t.caret.restore(),(!t.editLinkUrl.value||t.editLinkUrl.value==="https://")&&document.execCommand("unlink"),t.editLinkUrl.value=null;break}}}),E([u(O,{key:"qedt_btm_rem",tabindex:-1,...t.buttonProps.value,label:t.$q.lang.label.remove,noCaps:!0,onClick:()=>{t.caret.restore(),document.execCommand("unlink"),t.editLinkUrl.value=null}}),u(O,{key:"qedt_btm_upd",...t.buttonProps.value,label:t.$q.lang.label.update,noCaps:!0,onClick:r})])]}}const De=Object.prototype.toString,N=Object.prototype.hasOwnProperty,Ie=new Set(["Boolean","Number","String","Function","Array","Date","RegExp"].map(t=>"[object "+t+"]"));function I(t){if(t!==Object(t)||Ie.has(De.call(t))===!0||t.constructor&&N.call(t,"constructor")===!1&&N.call(t.constructor.prototype,"isPrototypeOf")===!1)return!1;let e;for(e in t);return e===void 0||N.call(t,e)}function J(){let t,e,o,r,l,d,a=arguments[0]||{},p=1,C=!1;const v=arguments.length;for(typeof a=="boolean"&&(C=a,a=arguments[1]||{},p=2),Object(a)!==a&&typeof a!="function"&&(a={}),v===p&&(a=this,p--);p<v;p++)if((t=arguments[p])!==null)for(e in t)o=a[e],r=t[e],a!==r&&(C===!0&&r&&((l=Array.isArray(r))||I(r)===!0)?(l===!0?d=Array.isArray(o)===!0?o:[]:d=I(o)===!0?o:{},a[e]=J(C,d,r)):r!==void 0&&(a[e]=r));return a}const tt=ge({name:"QEditor",props:{...Pe,...Le,modelValue:{type:String,required:!0},readonly:Boolean,disable:Boolean,minHeight:{type:String,default:"10rem"},maxHeight:String,height:String,definitions:Object,fonts:Object,placeholder:String,toolbar:{type:Array,validator:t=>t.length===0||t.every(e=>e.length),default:()=>[["left","center","right","justify"],["bold","italic","underline","strike"],["undo","redo"]]},toolbarColor:String,toolbarBg:String,toolbarTextColor:String,toolbarToggleColor:{type:String,default:"primary"},toolbarOutline:Boolean,toolbarPush:Boolean,toolbarRounded:Boolean,paragraphTag:{type:String,validator:t=>["div","p"].includes(t),default:"div"},contentStyle:Object,contentClass:[Object,Array,String],square:Boolean,flat:Boolean,dense:Boolean},emits:[...Be,"update:modelValue","keydown","click","focus","blur","dropdownShow","dropdownHide","dropdownBeforeShow","dropdownBeforeHide","linkShow","linkHide"],setup(t,{slots:e,emit:o}){const{proxy:r}=ve(),{$q:l}=r,d=qe(t,l),{inFullscreen:a,toggleFullscreen:p}=$e(),C=_e(),v=z(null),s=z(null),y=z(null),b=z(!1),f=m(()=>!t.readonly&&!t.disable);let P,w,T=t.modelValue;document.execCommand("defaultParagraphSeparator",!1,t.paragraphTag),P=window.getComputedStyle(document.body).fontFamily;const x=m(()=>t.toolbarBg?` bg-${t.toolbarBg}`:""),G=m(()=>({type:"a",flat:t.toolbarOutline!==!0&&t.toolbarPush!==!0,noWrap:!0,outline:t.toolbarOutline,push:t.toolbarPush,rounded:t.toolbarRounded,dense:!0,color:t.toolbarColor,disable:!f.value,size:"sm"})),q=m(()=>{const n=l.lang.editor,i=l.iconSet.editor;return{bold:{cmd:"bold",icon:i.bold,tip:n.bold,key:66},italic:{cmd:"italic",icon:i.italic,tip:n.italic,key:73},strike:{cmd:"strikeThrough",icon:i.strikethrough,tip:n.strikethrough,key:83},underline:{cmd:"underline",icon:i.underline,tip:n.underline,key:85},unordered:{cmd:"insertUnorderedList",icon:i.unorderedList,tip:n.unorderedList},ordered:{cmd:"insertOrderedList",icon:i.orderedList,tip:n.orderedList},subscript:{cmd:"subscript",icon:i.subscript,tip:n.subscript,htmlTip:"x<subscript>2</subscript>"},superscript:{cmd:"superscript",icon:i.superscript,tip:n.superscript,htmlTip:"x<superscript>2</superscript>"},link:{cmd:"link",disable:c=>c.caret&&!c.caret.can("link"),icon:i.hyperlink,tip:n.hyperlink,key:76},fullscreen:{cmd:"fullscreen",icon:i.toggleFullscreen,tip:n.toggleFullscreen,key:70},viewsource:{cmd:"viewsource",icon:i.viewSource,tip:n.viewSource},quote:{cmd:"formatBlock",param:"BLOCKQUOTE",icon:i.quote,tip:n.quote,key:81},left:{cmd:"justifyLeft",icon:i.left,tip:n.left},center:{cmd:"justifyCenter",icon:i.center,tip:n.center},right:{cmd:"justifyRight",icon:i.right,tip:n.right},justify:{cmd:"justifyFull",icon:i.justify,tip:n.justify},print:{type:"no-state",cmd:"print",icon:i.print,tip:n.print,key:80},outdent:{type:"no-state",disable:c=>c.caret&&!c.caret.can("outdent"),cmd:"outdent",icon:i.outdent,tip:n.outdent},indent:{type:"no-state",disable:c=>c.caret&&!c.caret.can("indent"),cmd:"indent",icon:i.indent,tip:n.indent},removeFormat:{type:"no-state",cmd:"removeFormat",icon:i.removeFormat,tip:n.removeFormat},hr:{type:"no-state",cmd:"insertHorizontalRule",icon:i.hr,tip:n.hr},undo:{type:"no-state",cmd:"undo",icon:i.undo,tip:n.undo,key:90},redo:{type:"no-state",cmd:"redo",icon:i.redo,tip:n.redo,key:89},h1:{cmd:"formatBlock",param:"H1",icon:i.heading1||i.heading,tip:n.heading1,htmlTip:`<h1 class="q-ma-none">${n.heading1}</h1>`},h2:{cmd:"formatBlock",param:"H2",icon:i.heading2||i.heading,tip:n.heading2,htmlTip:`<h2 class="q-ma-none">${n.heading2}</h2>`},h3:{cmd:"formatBlock",param:"H3",icon:i.heading3||i.heading,tip:n.heading3,htmlTip:`<h3 class="q-ma-none">${n.heading3}</h3>`},h4:{cmd:"formatBlock",param:"H4",icon:i.heading4||i.heading,tip:n.heading4,htmlTip:`<h4 class="q-ma-none">${n.heading4}</h4>`},h5:{cmd:"formatBlock",param:"H5",icon:i.heading5||i.heading,tip:n.heading5,htmlTip:`<h5 class="q-ma-none">${n.heading5}</h5>`},h6:{cmd:"formatBlock",param:"H6",icon:i.heading6||i.heading,tip:n.heading6,htmlTip:`<h6 class="q-ma-none">${n.heading6}</h6>`},p:{cmd:"formatBlock",param:t.paragraphTag,icon:i.heading,tip:n.paragraph},code:{cmd:"formatBlock",param:"PRE",icon:i.code,htmlTip:`<code>${n.code}</code>`},"size-1":{cmd:"fontSize",param:"1",icon:i.size1||i.size,tip:n.size1,htmlTip:`<font size="1">${n.size1}</font>`},"size-2":{cmd:"fontSize",param:"2",icon:i.size2||i.size,tip:n.size2,htmlTip:`<font size="2">${n.size2}</font>`},"size-3":{cmd:"fontSize",param:"3",icon:i.size3||i.size,tip:n.size3,htmlTip:`<font size="3">${n.size3}</font>`},"size-4":{cmd:"fontSize",param:"4",icon:i.size4||i.size,tip:n.size4,htmlTip:`<font size="4">${n.size4}</font>`},"size-5":{cmd:"fontSize",param:"5",icon:i.size5||i.size,tip:n.size5,htmlTip:`<font size="5">${n.size5}</font>`},"size-6":{cmd:"fontSize",param:"6",icon:i.size6||i.size,tip:n.size6,htmlTip:`<font size="6">${n.size6}</font>`},"size-7":{cmd:"fontSize",param:"7",icon:i.size7||i.size,tip:n.size7,htmlTip:`<font size="7">${n.size7}</font>`}}}),R=m(()=>{const n=t.definitions||{},i=t.definitions||t.fonts?J(!0,{},q.value,n,Ae(P,l.lang.editor.defaultFont,l.iconSet.editor.font,t.fonts)):q.value;return t.toolbar.map(c=>c.map(h=>{if(h.options)return{type:"dropdown",icon:h.icon,label:h.label,size:"sm",dense:!0,fixedLabel:h.fixedLabel,fixedIcon:h.fixedIcon,highlight:h.highlight,list:h.list,options:h.options.map(ue=>i[ue])};const k=i[h];return k?k.type==="no-state"||n[h]&&(k.cmd===void 0||q.value[k.cmd]&&q.value[k.cmd].type==="no-state")?k:Object.assign({type:"toggle"},k):{type:"slot",slot:h}}))}),g={$q:l,props:t,slots:e,emit:o,inFullscreen:a,toggleFullscreen:p,runCmd:B,isViewingSource:b,editLinkUrl:y,toolbarBackgroundClass:x,buttonProps:G,contentRef:s,buttons:R,setContent:L};H(()=>t.modelValue,n=>{T!==n&&(T=n,L(n,!0))}),H(y,n=>{o(`link${n?"Show":"Hide"}`)});const X=m(()=>t.toolbar&&t.toolbar.length!==0),Z=m(()=>{const n={},i=c=>{c.key&&(n[c.key]={cmd:c.cmd,param:c.param})};return R.value.forEach(c=>{c.forEach(h=>{h.options?h.options.forEach(i):i(h)})}),n}),Y=m(()=>a.value?t.contentStyle:[{minHeight:t.minHeight,height:t.height,maxHeight:t.maxHeight},t.contentStyle]),V=m(()=>`q-editor q-editor--${b.value===!0?"source":"default"}`+(t.disable===!0?" disabled":"")+(a.value===!0?" fullscreen column":"")+(t.square===!0?" q-editor--square no-border-radius":"")+(t.flat===!0?" q-editor--flat":"")+(t.dense===!0?" q-editor--dense":"")+(d.value===!0?" q-editor--dark q-dark":"")),ee=m(()=>[t.contentClass,"q-editor__content",{col:a.value,"overflow-auto":a.value||t.maxHeight}]),te=m(()=>t.disable===!0?{"aria-disabled":"true"}:{});function oe(){if(s.value!==null){const n=`inner${b.value===!0?"Text":"HTML"}`,i=s.value[n];i!==t.modelValue&&(T=i,o("update:modelValue",i))}}function ne(n){if(o("keydown",n),n.ctrlKey!==!0||U(n)===!0){S();return}const i=n.keyCode,c=Z.value[i];if(c!==void 0){const{cmd:h,param:k}=c;ke(n),B(h,k,!1)}}function ie(n){S(),o("click",n)}function re(n){if(s.value!==null){const{scrollTop:i,scrollHeight:c}=s.value;w=c-i}g.caret.save(),o("blur",n)}function le(n){Ce(()=>{s.value!==null&&w!==void 0&&(s.value.scrollTop=s.value.scrollHeight-w)}),o("focus",n)}function ae(n){const i=v.value;if(i!==null&&i.contains(n.target)===!0&&(n.relatedTarget===null||i.contains(n.relatedTarget)!==!0)){const c=`inner${b.value===!0?"Text":"HTML"}`;g.caret.restorePosition(s.value[c].length),S()}}function se(n){const i=v.value;i!==null&&i.contains(n.target)===!0&&(n.relatedTarget===null||i.contains(n.relatedTarget)!==!0)&&(g.caret.savePosition(),S())}function F(){w=void 0}function A(n){g.caret.save()}function L(n,i){if(s.value!==null){i===!0&&g.caret.savePosition();const c=`inner${b.value===!0?"Text":"HTML"}`;s.value[c]=n,i===!0&&(g.caret.restorePosition(s.value[c].length),S())}}function B(n,i,c=!0){$(),g.caret.restore(),g.caret.apply(n,i,()=>{$(),g.caret.save(),c&&S()})}function S(){setTimeout(()=>{y.value=null,r.$forceUpdate()},1)}function $(){Ne(()=>{s.value!==null&&s.value.focus({preventScroll:!0})})}function ce(){return s.value}return me(()=>{g.caret=r.caret=new Ee(s.value,g),L(t.modelValue),S(),document.addEventListener("selectionchange",A)}),ye(()=>{document.removeEventListener("selectionchange",A)}),Object.assign(r,{runCmd:B,refreshToolbar:S,focus:$,getContentEl:ce}),()=>{let n;if(X.value){const i=[u("div",{key:"qedt_top",class:"q-editor__toolbar row no-wrap scroll-x"+x.value},Fe(g))];y.value!==null&&i.push(u("div",{key:"qedt_btm",class:"q-editor__toolbar row no-wrap items-center scroll-x"+x.value},je(g))),n=u("div",{key:"toolbar_ctainer",class:"q-editor__toolbars-container"},i)}return u("div",{ref:v,class:V.value,style:{height:a.value===!0?"100%":null},...te.value,onFocusin:ae,onFocusout:se},[n,u("div",{ref:s,style:Y.value,class:ee.value,contenteditable:f.value,placeholder:t.placeholder,...C.listeners.value,onInput:oe,onKeydown:ne,onClick:ie,onBlur:re,onFocus:le,onMousedown:F,onTouchstartPassive:F})])}}});function ot(){const t=localStorage.getItem("todo-notes"),e=t?JSON.parse(t):[],o=z(e);return H(o,r=>{localStorage.setItem("todo-notes",JSON.stringify(r))},{deep:!0}),o}function nt(t){const e=new Date(t),o=e.toLocaleDateString("zh-TW",{year:"numeric",month:"2-digit",day:"2-digit"}),r=e.toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit",second:"2-digit"});return`${o} ${r}`}const Ue={},Qe={class:"q-mr-auto q-ml-auto",style:{"max-width":"700px"}};function Me(t,e){return we(),Se("div",Qe,[be(t.$slots,"default")])}const it=Oe(Ue,[["render",Me]]);export{it as C,tt as Q,nt as f,ot as u};
