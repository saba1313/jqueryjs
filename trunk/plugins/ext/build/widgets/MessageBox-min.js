/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 * 
 * http://www.extjs.com/license.txt
 */

Ext.MessageBox=function(){var _1,_2,_3;var _4,_5,_6,_7,_8,pp;var _a,_b,_c;var _d=function(_e){_1.hide();Ext.callback(_2.fn,_2.scope||window,[_e,_b.dom.value],1);};var _f=function(){if(_2&&_2.cls){_1.el.removeClass(cls);}};var _10=function(b){var _12=0;if(!b){_a["ok"].hide();_a["cancel"].hide();_a["yes"].hide();_a["no"].hide();return _12;}for(var k in _a){if(typeof _a[k]!="function"){if(b[k]){_a[k].show();_a[k].setText(typeof b[k]=="string"?b[k]:Ext.MessageBox.buttonText[k]);_12+=_a[k].el.getWidth()+15;}else{_a[k].hide();}}}return _12;};return {getDialog:function(){if(!_1){_1=new Ext.BasicDialog("x-msg-box",{autoCreate:true,shadow:true,draggable:true,resizable:false,constraintoviewport:false,fixedcenter:true,collapsible:false,shim:true,modal:true,width:400,height:100,buttonAlign:"center",closeClick:function(){if(_2&&_2.buttons&&_2.buttons.no&&!_2.buttons.cancel){_d("no");}else{_d("cancel");}}});_1.on("hide",_f);_3=_1.mask;_1.addKeyListener(27,_1.hide,_1);_a={};var bt=this.buttonText;_a["ok"]=_1.addButton(bt["ok"],_d.createCallback("ok"));_a["yes"]=_1.addButton(bt["yes"],_d.createCallback("yes"));_a["no"]=_1.addButton(bt["no"],_d.createCallback("no"));_a["cancel"]=_1.addButton(bt["cancel"],_d.createCallback("cancel"));_4=_1.body.createChild({tag:"div",html:"<span class=\"ext-mb-text\"></span><br /><input type=\"text\" class=\"ext-mb-input\"><textarea class=\"ext-mb-textarea\"></textarea><div class=\"ext-mb-progress-wrap\"><div class=\"ext-mb-progress\"><div class=\"ext-mb-progress-bar\">&#160;</div></div></div>"});_5=_4.dom.firstChild;_6=Ext.get(_4.dom.childNodes[2]);_6.enableDisplayMode();_6.addKeyListener([10,13],function(){if(_1.isVisible()&&_2&&_2.buttons){if(_2.buttons.ok){_d("ok");}else{if(_2.buttons.yes){_d("yes");}}}});_7=Ext.get(_4.dom.childNodes[3]);_7.enableDisplayMode();_8=Ext.get(_4.dom.childNodes[4]);_8.enableDisplayMode();var pf=_8.dom.firstChild;pp=Ext.get(pf.firstChild);pp.setHeight(pf.offsetHeight);}return _1;},updateText:function(_16){if(!_1.isVisible()&&!_2.width){_1.resizeTo(this.maxWidth,100);}_5.innerHTML=_16;var w=Math.max(Math.min(_2.width||_5.offsetWidth,this.maxWidth),Math.max(_2.minWidth||this.minWidth,_c));if(_2.prompt){_b.setWidth(w);}if(_1.isVisible()){_1.fixedcenter=false;}_1.setContentSize(w,_4.getHeight());if(_1.isVisible()){_1.fixedcenter=true;}return this;},updateProgress:function(_18,_19){if(_19){this.updateText(_19);}pp.setWidth(Math.floor(_18*_8.dom.firstChild.offsetWidth));return this;},isVisible:function(){return _1&&_1.isVisible();},hide:function(){if(this.isVisible()){_1.hide();}},show:function(_1a){var d=this.getDialog();_2=_1a;d.setTitle(_2.title||"&#160;");d.close.setDisplayed(_2.closable!==false);_b=_6;_2.prompt=_2.prompt||(_2.multiline?true:false);if(_2.prompt){if(_2.multiline){_6.hide();_7.show();_7.setHeight(typeof _2.multiline=="number"?_2.multiline:this.defaultTextHeight);_b=_7;}else{_6.show();_7.hide();}}else{_6.hide();_7.hide();}_8.setDisplayed(_2.progress===true);this.updateProgress(0);_b.dom.value=_2.value||"";if(_2.prompt){_1.setDefaultButton(_b);}else{var bs=_2.buttons;var db=null;if(bs&&bs.ok){db=_a["ok"];}else{if(bs&&bs.yes){db=_a["yes"];}}_1.setDefaultButton(db);}_c=_10(_2.buttons);this.updateText(_2.msg);if(_2.cls){d.el.addClass(_2.cls);}d.modal=_2.modal!==false;d.mask=_2.modal!==false?_3:false;if(!d.isVisible()){d.animateTarget=null;d.show(_1a.animEl);}return this;},progress:function(_1e,msg){this.show({title:_1e,msg:msg,buttons:false,progress:true,closable:false,minWidth:this.minProgressWidth});return this;},alert:function(_20,msg,fn,_23){this.show({title:_20,msg:msg,buttons:this.OK,fn:fn,scope:_23});return this;},confirm:function(_24,msg,fn,_27){this.show({title:_24,msg:msg,buttons:this.YESNO,fn:fn,scope:_27});return this;},prompt:function(_28,msg,fn,_2b,_2c){this.show({title:_28,msg:msg,buttons:this.OKCANCEL,fn:fn,minWidth:250,scope:_2b,prompt:true,multiline:_2c});return this;},OK:{ok:true},YESNO:{yes:true,no:true},OKCANCEL:{ok:true,cancel:true},YESNOCANCEL:{yes:true,no:true,cancel:true},defaultTextHeight:75,maxWidth:600,minWidth:100,minProgressWidth:250,buttonText:{ok:"OK",cancel:"Cancel",yes:"Yes",no:"No"}};}();Ext.Msg=Ext.MessageBox;
