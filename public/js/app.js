"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),Alerts=function(){function e(){_classCallCheck(this,e);var t=this;t.mdl=new Vue({el:"#alerts",data:{children:[]},methods:{acknowledge:function(e){t.close(e)}}}),t.uidNext=1}return _createClass(e,[{key:"push",value:function(e){var t=this,n=_.defaults(e,{_uid:t.uidNext,"class":"info",iconClass:"fa-info",message:"---",sticky:!1,title:"---"});t.mdl.children.push(n),n.sticky||_.delay(function(){t.close(n._uid)},5e3),t.uidNext++}},{key:"close",value:function(e){var t=this,n=_.findIndex(t.mdl.children,["_uid",e]),a=_.nth(t.mdl.children,n);n>=0&&a&&(a["class"]+=" exit",t.mdl.children.$set(n,a),_.delay(function(){t.mdl.children.$remove(a)},500))}}]),e}(),alerts;jQuery(document).ready(function(e){vex.defaultOptions.className="vex-theme-os",alerts=new Alerts,alertsData&&_.forEach(alertsData,function(e){alerts.push(e)})});