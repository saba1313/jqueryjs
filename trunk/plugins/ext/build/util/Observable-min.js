/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 * 
 * http://www.extjs.com/license.txt
 */

Ext.util.Observable=function(){};Ext.util.Observable.prototype={fireEvent:function(){var ce=this.events[arguments[0].toLowerCase()];if(typeof ce=="object"){return ce.fire.apply(ce,Array.prototype.slice.call(arguments,1));}else{return true;}},filterOptRe:/^(?:scope|delay|buffer|single)$/,addListener:function(_2,fn,_4,o){if(typeof _2=="object"){o=_2;for(var e in o){if(this.filterOptRe.test(e)){continue;}if(typeof o[e]=="function"){this.addListener(e,o[e],o.scope,o);}else{this.addListener(e,o[e].fn,o[e].scope,o[e]);}}return;}o=(!o||typeof o=="boolean")?{}:o;_2=_2.toLowerCase();var ce=this.events[_2];if(!ce){throw "Event does not exist: \""+_2+"\".";}if(typeof ce=="boolean"){ce=new Ext.util.Event(this,_2);this.events[_2]=ce;}ce.addListener(fn,_4,o);},removeListener:function(_8,fn,_a){var ce=this.events[_8.toLowerCase()];if(typeof ce=="object"){ce.removeListener(fn,_a);}},purgeListeners:function(){for(var _c in this.events){if(typeof this.events[_c]=="object"){this.events[_c].clearListeners();}}},relayEvents:function(o,_e){var _f=function(_10){return function(){return this.fireEvent.apply(this,Ext.combine(_10,Array.prototype.slice.call(arguments,0)));};};for(var i=0,len=_e.length;i<len;i++){var _13=_e[i];if(!this.events[_13]){this.events[_13]=true;}o.on(_13,_f(_13),this);}},addEvents:function(o){if(!this.events){this.events={};}Ext.applyIf(this.events,o);},hasListener:function(_15){var e=this.events[_15];return typeof e=="object"&&e.listeners.length>0;}};Ext.util.Observable.prototype.on=Ext.util.Observable.prototype.addListener;Ext.util.Observable.prototype.un=Ext.util.Observable.prototype.removeListener;Ext.util.Observable.capture=function(o,fn,_19){o.fireEvent=o.fireEvent.createInterceptor(fn,_19);};Ext.util.Observable.releaseCapture=function(o){o.fireEvent=Ext.util.Observable.prototype.fireEvent;};(function(){var _1b=function(h,o,_1e){var _1f=new Ext.util.DelayedTask();return function(){_1f.delay(o.buffer,h,_1e,Array.prototype.slice.call(arguments,0));};};var _20=function(h,e,fn,_24){return function(){e.removeListener(fn,_24);return h.apply(_24,arguments);};};var _25=function(h,o,_28){return function(){var _29=Array.prototype.slice.call(arguments,0);setTimeout(function(){h.apply(_28,_29);},o.delay||10);};};Ext.util.Event=function(obj,_2b){this.name=_2b;this.obj=obj;this.listeners=[];};Ext.util.Event.prototype={addListener:function(fn,_2d,_2e){var o=_2e||{};_2d=_2d||this.obj;if(!this.isListening(fn,_2d)){var l={fn:fn,scope:_2d,options:o};var h=fn;if(o.delay){h=_25(h,o,_2d);}if(o.single){h=_20(h,this,fn,_2d);}if(o.buffer){h=_1b(h,o,_2d);}l.fireFn=h;this.listeners.push(l);}},findListener:function(fn,_33){_33=_33||this.obj;var ls=this.listeners;for(var i=0,len=ls.length;i<len;i++){var l=ls[i];if(l.fn==fn&&l.scope==_33){return i;}}return -1;},isListening:function(fn,_39){return this.findListener(fn,_39)!=-1;},removeListener:function(fn,_3b){var _3c;if((_3c=this.findListener(fn,_3b))!=-1){this.listeners.splice(_3c,1);return true;}return false;},clearListeners:function(){this.listeners=[];},fire:function(){var _3d=Array.prototype.slice.call(arguments,0);var ls=this.listeners,_3f;for(var i=0,len=ls.length;i<len;i++){var l=ls[i];if(l.fireFn.apply(l.scope,arguments)===false){return false;}}return true;}};})();
