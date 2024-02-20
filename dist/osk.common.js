module.exports=function(t){var e={};function i(s){if(e[s])return e[s].exports;var n=e[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,i),n.l=!0,n.exports}return i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(s,n,function(e){return t[e]}.bind(null,n));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";i.r(e);class s{constructor(t){this.keyboard=t,this.actions={backspace:function(t,e){e.selectionStart>0&&e.selectionStart==e.selectionEnd?(e.selectionStart--,e.changeValue("")):e.changeValue("")},change_keyset:function(t,e){void 0!==t.action[1]&&(e.keyset=t.action[1],e.clear(),e.construct())},change_layout:function(t,e){void 0!==t.action[1]&&(e.layoutName=t.action[1],e.clear(),e.construct())},submit:function(t,e){void 0!==t.action[1]&&(e.pushtoOutput(),e.clear())}}}activate(t){"function"==typeof this.actions[t.action[0]]&&this.actions[t.action[0]](t,this.keyboard)}addAction(t,e){this.actions[t]=e}}class n{constructor(t,e,i){this.layouts={},this.layoutName=void 0===i?"en":i,this.keyset="default",this.container=!1,this.containerListenerAdded=!1,this.setContainer(e),this.selectionStart=0,this.selectionEnd=0,this.output=!1,this.outputIsInputField=!0,this.value="",this.events={change:[],layout:[],ready:[]},this.actions=new s(this),this.cbOnChange=!1,this.setOutput(t),this.setDefaultLayout(),this.construct()}on(t,e){"object"!=typeof this.events[t]&&(this.events[t]=[]),this.events[t].push(e)}trigger(){let t=Array.prototype.slice.call(arguments);if(t.length>0){let e=t[0];if(t.shift(),this.events[e]){let i;for(let s=0,n=this.events[e].length;s<n;s++)"function"==typeof(i=this.events[e][s])&&i.apply(this,t)}}}addLayout(t,e){this.layouts[t]=e}changeLayout(t,e){this.layoutName=t,this.keyset=e||"default",this.clear(),this.construct(),this.trigger("layout",this.layoutName,this.keyset)}setContainer(t){switch(typeof t){case"undefined":this.container=document.createElement("div"),this.container.classList.add("keyboard"),document.body.appendChild(this.container);break;case"string":this.container=document.getElementById(t);break;default:this.container=t}}setOutput(t){if(!t)return void console.warn("Input field not given",t);let e;if("string"==typeof t){if(e=document.getElementById(t),this.output=e,!this.output)return void console.warn("Input field not found",t)}else e=t,this.output=t;"input"!==this.getFieldType(this.output)&&(this.outputIsInputField=!1);let i=this.getFieldValue(e);this.value=i,this.selectionEnd=i.length,this.output&&(this.output.addEventListener("focus",()=>{this.updateFromOutput()}),this.output.addEventListener("keyup",()=>{this.updateFromOutput(),this.trigger("change",this.value)}),this.output.addEventListener("mouseup",()=>{this.updateFromOutput()}),this.output.addEventListener("input",()=>{this.updateFromOutput()}))}getFieldValue(t){if(!t)return"";switch(this.getFieldType(t)){case"input":return t.value;case"textarea":return t.innerText;default:return""}}updateFromOutput(){this.value=this.getFieldValue(this.output),this.getCaretPosition()}clear(){if(this.container)for(;this.container.firstChild;)this.container.removeChild(this.container.firstChild)}clearValue(){this.value="",this.selectionStart=0,this.selectionEnd=0,this.pushtoOutput()}getCurrentKeyset(){try{return this.layouts[this.layoutName].keys[this.keyset]}catch(t){return console.warn("Error! Probably no keyboard layout added!"),this.layouts.en.keys.default}}construct(){this.clear();let t="",e=this.getCurrentKeyset();for(let i in e){t+="<div class='keyboard-row keyboard-row-"+i+"'>";for(let s in e[i]){let n=e[i][s];switch(typeof n){case"string":t+="<div class='keyboard-key "+n+"' row='"+i+"' index='"+s+"'>"+n+"</div>";break;case"object":let e="";n.cls&&(e=n.cls),t+="<div class='keyboard-key keyboard-"+e+" "+n.key+"' object='' row='"+i+"' index='"+s+"'>"+n.key+"</div>"}}t+="</div>"}this.container.insertAdjacentHTML("beforeend",t),this.containerListenerAdded||(this.container.addEventListener("mousedown",t=>{this.getCaretPosition(),this.keyPressed(t.target),t.stopPropagation(),t.preventDefault()}),this.container.addEventListener("mouseup",t=>{this.keyReleased(t.target),t.stopPropagation()}),this.containerListenerAdded=!0,this.container.onselectstart=function(){return!1},this.container.onmousedown=function(){return!1}),this.rescale()}rescale(){if(!this.container)return;let t,e,i=0;for(let s=0;s<this.container.children.length;s++){let n=(t=this.container.children[s]).offsetHeight-t.clientHeight,o=t.offsetWidth-t.clientWidth;for(let i=0;i<t.children.length;i++){let s=0;o+=(s=(e=t.children[i]).offsetWidth<this.container.offsetWidth?e.offsetWidth:this.container.offsetWidth)+1,n=Math.max(n,this.container.offsetHeight)}t.width=o,t.height=n,i+=n}this.container.height=i,this.trigger("ready")}keyPressed(t){t.classList.add("keyboard-key-pressed");let e=this.getCurrentKeyset()[t.getAttribute("row")];if(!e)return;let i=e[t.getAttribute("index")];switch(typeof i){case"string":this.changeValue(i);break;case"object":void 0===i.action?this.changeValue(i.key):this.actions.activate(i)}this.pushtoOutput()}changeValue(t){let e=this.value.substring(0,this.selectionStart),i=this.value.substring(this.selectionEnd,this.value.length);this.value=""+e+t+i,this.selectionStart+=t.length,this.selectionEnd=this.selectionStart}pushtoOutput(){if(this.output){this.outputIsInputField?(this.output.value=this.value,this.output.selectionStart=this.selectionStart,this.output.selectionEnd=this.selectionEnd):this.output.innerHTML=this.value;let t=new Event("change"),e=new Event("keyup");this.output.dispatchEvent(t),this.output.dispatchEvent(e),this.trigger("change",this.value)}}getFieldType(t){return t&&t.tagName?t.tagName.toLowerCase():"nan"}getCaretPosition(){this.output&&this.outputIsInputField&&(this.selectionStart=this.output.selectionStart,this.selectionEnd=this.output.selectionEnd)}keyReleased(t){t.classList.remove("keyboard-key-pressed")}width(){return-1}height(){return-1}setDefaultLayout(){this.layouts.en={name:"English",keyboard:"US International",local_name:"English",lang:"en",keys:{default:[["1","2","3","4","5","6","7","8","9","0",{key:"&#171; Bksp",action:["backspace"],cls:"key2x"}],["q","w","e","r","t","y","u","i","o","p","\\"],["a","s","d","f","g","h","j","k","l",{key:"Enter",action:["submit"],cls:"key3x"}],[{key:"Shift",action:["change_keyset","shift"],cls:"key2x"},"z","x","c","v","b","n","m"],[{key:" ",cls:"key_spacebar"}]],shift:[["~","!","@","#","$","%","^","&","*","(",")",{key:"&#171; Bksp",action:"backspace",cls:"key2x"}],["Q","W","E","R","T","Y","U","I","O","P","{","}"],["A","S","D","F","G","H","J","K","L",{key:"Enter",action:["submit"],cls:"key3x"}],[{key:"Shift",action:["change_keyset","default"],cls:"key2x active"},"Z","X","C","V","B","N","M","<",">","?"],[{key:" ",cls:"key_spacebar"}]]}}}}i.d(e,"OSK",function(){return n}),i.d(e,"OSKActions",function(){return s})}]).OSK;