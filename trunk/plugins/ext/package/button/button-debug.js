/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 * 
 * http://www.extjs.com/license.txt
 */


Ext.Button = function(renderTo, config){
    Ext.apply(this, config);
    this.events = {
        
	    "click" : true,
        
	    "toggle" : true
    };
    if(this.menu){
        this.menu = Ext.menu.MenuMgr.get(this.menu);
    }
    if(renderTo){
        this.render(renderTo);
    }
};

Ext.extend(Ext.Button, Ext.util.Observable, {
    
    hidden : false,
    
    disabled : false,
    
    pressed : false,

    enableToggle: false,

    menuAlign : "tl-bl?",
    
    render : function(renderTo){
        var btn;
        if(!this.dhconfig){
            if(!this.template){
                if(!Ext.Button.buttonTemplate){
                    
                    Ext.Button.buttonTemplate = new Ext.Template(
                        '<table border="0" cellpadding="0" cellspacing="0" class="x-btn-wrap"><tbody><tr>',
                        '<td class="x-btn-left"><i>&#160;</i></td><td class="x-btn-center"><em><button class="x-btn-text" ext:qtip="{1:htmlEncode}">{0}</button></em></td><td class="x-btn-right"><i>&#160;</i></td>',
                        "</tr></tbody></table>");
                }
                this.template = Ext.Button.buttonTemplate;
            }
            btn = this.template.append(renderTo, [this.text || '&#160;', this.tooltip || ""], true);
            if(this.cls){
                btn.addClass(this.cls);
            }
            if(this.icon){
                btn.child("button:first").setStyle('background-image', 'url(' +this.icon +')');
            }
        }else{
            btn = Ext.DomHelper.append(Ext.get(renderTo).dom, this.dhconfig, true);
        }
        this.el = btn;
        if(this.menu){
            this.el.addClass("x-btn-with-menu");
            this.menu.on("show", this.onMenuShow, this);
            this.menu.on("hide", this.onMenuHide, this);
        }
        if(Ext.isIE && !Ext.isIE7){
            this.autoWidth.defer(1, this);
        }else{
            this.autoWidth();
        }
        btn.addClass("x-btn");
        btn.on("click", this.onClick, this);
        btn.on("mouseover", this.onMouseOver, this);
        btn.on("mouseout", this.onMouseOut, this);
        btn.on("mousedown", this.onMouseDown, this);
        btn.on("mouseup", this.onMouseUp, this);
        if(this.hidden){
            this.hide();
        }
        if(this.disabled){
            this.disable();
        }
        Ext.ButtonToggleMgr.register(this);
        if(this.pressed){
            this.el.addClass("x-btn-pressed");
        }
        if(this.repeat){
            var repeater = new Ext.util.ClickRepeater(btn,
                typeof this.repeat == "object" ? this.repeat : {}
            );
            repeater.on("click", this.onClick,  this);
        }
    },
    
    getEl : function(){
        return this.el;  
    },
    
    
    destroy : function(){
        Ext.ButtonToggleMgr.unregister(this);
        this.el.removeAllListeners();
        this.purgeListeners();
        this.el.remove();
    },
    
    autoWidth : function(){
        if(this.el){
            this.el.setWidth("auto");
            if(Ext.isIE7 && Ext.isStrict){
                var ib = this.el.child('button');
                if(ib && ib.getWidth() > 20){
                    ib.clip();
                    ib.setWidth(Ext.Element.measureText(ib, this.text).width+ib.getFrameWidth('lr'));
                }
            }
            if(this.minWidth){
                if(this.hidden){
                    this.el.beginMeasure();
                }
                if(this.el.getWidth() < this.minWidth){
                    this.el.setWidth(this.minWidth);
                }
                if(this.hidden){
                    this.el.endMeasure();
                }
            }
        }
    },
    
    setHandler : function(handler, scope){
        this.handler = handler;
        this.scope = scope;  
    },
    
    
    setText : function(text){
        this.text = text;
        this.el.child("td.x-btn-center button.x-btn-text").update(text);
        this.autoWidth();
    },
    
    
    getText : function(){
        return this.text;  
    },
    
    
    show: function(){
        this.hidden = false;
        this.el.setStyle("display", "");
    },
    
    
    hide: function(){
        this.hidden = true;
        this.el.setStyle("display", "none");
    },
    
    
    setVisible: function(visible){
        if(visible) {
            this.show();
        }else{
            this.hide();
        }
    },
    
    
    toggle : function(state){
        state = state === undefined ? !this.pressed : state;
        if(state != this.pressed){
            if(state){
                this.el.addClass("x-btn-pressed");
                this.pressed = true;
                this.fireEvent("toggle", this, true);
            }else{
                this.el.removeClass("x-btn-pressed");
                this.pressed = false;
                this.fireEvent("toggle", this, false);
            }
            if(this.toggleHandler){
                this.toggleHandler.call(this.scope || this, this, state);
            }
        }
    },
    
    
    focus : function(){
        this.el.child('button:first').focus(); 
    },
    
    
    disable : function(){
        this.el.addClass("x-btn-disabled");
        this.disabled = true;
    },
    
    
    enable : function(){
        this.el.removeClass("x-btn-disabled");
        this.disabled = false;
    },

    setDisabled : function(v){
        this[v !== true ? "enable" : "disable"]();
    },

    onClick : function(e){
        if(e){
            e.preventDefault();
        }
        if(!this.disabled){
            if(this.enableToggle){
                this.toggle();
            }
            if(this.menu && !this.menu.isVisible()){
                this.menu.show(this.el, this.menuAlign);
            }
            this.fireEvent("click", this, e);
            if(this.handler){
                this.handler.call(this.scope || this, this, e);
            }
        }
    },
    onMouseOver : function(e){
        if(!this.disabled){
            this.el.addClass("x-btn-over");
        }
    },
    onMouseOut : function(e){
        if(!e.within(this.el,  true)){
            this.el.removeClass("x-btn-over");
        }
    },
    onMouseDown : function(){
        if(!this.disabled){
            this.el.addClass("x-btn-click");
        }
    },
    onMouseUp : function(){
        this.el.removeClass("x-btn-click");
    },
    onMenuShow : function(e){
        this.el.addClass("x-btn-menu-active");
    },
    onMenuHide : function(e){
        this.el.removeClass("x-btn-menu-active");
    }   
});

Ext.ButtonToggleMgr = function(){
   var groups = {};
   
   function toggleGroup(btn, state){
       if(state){
           var g = groups[btn.toggleGroup];
           for(var i = 0, l = g.length; i < l; i++){
               if(g[i] != btn){
                   g[i].toggle(false);
               }
           }
       }
   }
   
   return {
       register : function(btn){
           if(!btn.toggleGroup){
               return;
           }
           var g = groups[btn.toggleGroup];
           if(!g){
               g = groups[btn.toggleGroup] = [];
           }
           g.push(btn);
           btn.on("toggle", toggleGroup);
       },
       
       unregister : function(btn){
           if(!btn.toggleGroup){
               return;
           }
           var g = groups[btn.toggleGroup];
           if(g){
               g.remove(btn);
               btn.un("toggle", toggleGroup);
           }
       }
   };
}();
