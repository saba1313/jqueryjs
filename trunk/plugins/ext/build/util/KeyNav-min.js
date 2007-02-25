/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 * 
 * http://www.extjs.com/license.txt
 */

Ext.KeyNav=function(el,_2){this.el=Ext.get(el);Ext.apply(this,_2);if(!this.disabled){this.disabled=true;this.enable();}};Ext.KeyNav.prototype={disabled:false,defaultEventAction:"stopEvent",prepareEvent:function(e){var k=e.getKey();var h=this.keyToHandler[k];if(h&&this[h]){e.stopPropagation();}if(k>=37&&k<=40){e.stopEvent();}},relay:function(e){var k=e.getKey();var h=this.keyToHandler[k];if(h&&this[h]){if(this.doRelay(e,this[h])!==true){e[this.defaultEventAction]();}}},doRelay:function(e,h){return h.call(this.scope||this,e);},enter:false,left:false,right:false,up:false,down:false,tab:false,esc:false,pageUp:false,pageDown:false,del:false,home:false,end:false,keyToHandler:{37:"left",39:"right",38:"up",40:"down",33:"pageUp",34:"pageDown",46:"del",36:"home",35:"end",13:"enter",27:"esc",9:"tab"},enable:function(){if(this.disabled){if(Ext.isIE){this.el.on("keydown",this.relay,this);}else{this.el.on("keydown",this.prepareEvent,this);this.el.on("keypress",this.relay,this);}this.disabled=false;}},disable:function(){if(!this.disabled){if(Ext.isIE){this.el.un("keydown",this.relay);}else{this.el.un("keypress",this.relay);}this.disabled=true;}}};
