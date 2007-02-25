/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 * 
 * http://www.extjs.com/license.txt
 */

Ext.form.Field = function(config){
    Ext.form.Field.superclass.constructor.call(this, config);
    this.addEvents({
        focus : true,
        blur : true,
        specialkey: true
    });
};

Ext.extend(Ext.form.Field, Ext.Component,  {
    invalidClass : "x-form-invalid",
    invalidText : "The value in this field is invalid",
    focusClass : "x-form-focus",
    validationEvent : "keyup",
    validationDelay : 250,
    defaultAutoCreate : {tag: "input", type: "text", size: "20", autocomplete: "off"},
    fieldClass: "x-form-field",
    hasFocus : false,

    onRender : function(ct){
        if(this.el){
            this.el = Ext.get(this.el);
            ct.dom.appendChild(this.el.dom);
        }else {
            var cfg = typeof this.autoCreate == "object" ?
                      this.autoCreate : this.defaultAutoCreate;
            this.el = ct.createChild(cfg);
        }
        if(this.width || this.height){
            this.setSize(this.width || "", this.height || "");
        }
        if(this.style){
            this.el.applyStyles(this.style);
            delete this.style;
        }
        this.el.addClass([this.fieldClass, this.cls]);
    },

    afterRender : function(){
        this.initEvents();
    },

    fireKey : function(e){
        if(e.isNavKeyPress()){
            this.fireEvent("specialkey", this, e);
        }
    },

    initEvents : function(){
        this.el.on(Ext.isIE ? "keydown" : "keypress", this.fireKey,  this);
        this.el.on("focus", this.onFocus,  this);
        this.el.on("blur", this.onBlur,  this);
    },

    onFocus : function(){
        if(!Ext.isOpera){             this.el.addClass(this.focusClass);
        }
        this.hasFocus = true;
        this.fireEvent("focus", this);
    },

    onBlur : function(){
        this.el.removeClass(this.focusClass);
        this.hasFocus = false;
        if(this.validationEvent != "blur"){
            this.validate();
        }
        this.fireEvent("blur", this);
    },

    setSize : function(w, h){
        this.el.setSize(w, h);
        var h = this.el.dom.offsetHeight;     },

    isValid : function(){
        return this.validateValue(this.getValue());
    },

    validate : function(){
        if(this.validateValue(this.getValue())){
            this.clearInvalid();
        }
    },

    validateValue : function(value){
        return true;
    },
    
    markInvalid : function(msg){
        this.el.addClass(this.invalidClass);
        this.el.dom.title = (msg || this.invalidText);
    },

    clearInvalid : function(){
        this.el.removeClass(this.invalidClass);
        this.el.dom.title = "";
    },

    getValue : function(){
        return this.el.getValue();
    },

    setValue : function(v){
        this.el.dom.value = v;
        this.validate();
    }
});
Ext.form.TextField = function(config){
    Ext.form.TextField.superclass.constructor.call(this, config);
};

Ext.extend(Ext.form.TextField, Ext.form.Field,  {
    initEvents : function(){
        Ext.form.TextField.superclass.initEvents.call(this);
        this.el.on(this.validationEvent, this.validate, this, {buffer: this.validationDelay});
        if(this.selectOnFocus){
            this.el.on("focus", function(){
                try{
                    this.dom.select();
                }catch(e){}
            });
        }
    },

    validateValue : function(value){
        if(value.length < 1){              if(this.allowBlank){
                 this.clearInvalid();
                 return true;
             }else{
                 this.markInvalid(this.blankText);
                 return false;
             }
        }
        if(value.length < this.minLength){
            this.markInvalid(String.format(this.minLengthText, this.minLength));
            return false;
        }
        if(value.length > this.maxLength){
            this.markInvalid(String.format(this.maxLengthText, this.maxLength));
            return false;
        }
        if(typeof this.validator == "function"){
            var msg = this.validator(value);
            if(msg !== true){
                this.markInvalid(msg);
                return false;
            }
        }
        if(this.regex && !this.regex.test(value)){
            this.markInvalid(this.regexText);
            return false;
        }
        return true;
    },
    
    allowBlank : true,
    minLength : 0,
    maxLength : Number.MAX_VALUE,
    minLengthText : "The minimum length for this field is {0}",
    maxLengthText : "The maximum length for this field is {0}",
    selectOnFocus : false,
    blankText : "This field is required",
    validator : null,
    regex : null,
    regexText : ""
});
Ext.form.TextArea = function(config){
    Ext.form.TextArea.superclass.constructor.call(this, config);
    this.addEvents({
        autosize : true
    });
};

Ext.extend(Ext.form.TextArea, Ext.form.TextField,  {
    minHeight : 60,

    initEvents : function(){
        Ext.form.TextArea.superclass.initEvents.call(this);
        if(this.grow){
            this.el.on("keyup", this.onKeyUp,  this, {buffer:50});
            this.el.on("click", this.autoSize,  this);
        }
    },

    onRender : function(ct){
        if(!this.el){
            this.defaultAutoCreate = {
                tag: "textarea",
                style:"width:300px;height:60px;",
                autocomplete: "off"
            };
        }
        Ext.form.TextArea.superclass.onRender.call(this, ct);
        if(this.grow){
            this.textSizeEl = Ext.DomHelper.append(document.body, {
                tag: "pre", cls: "x-form-grow-sizer"
            });
            this.el.setStyle("overflow", "hidden");
        }
    },

    onKeyUp : function(e){
        if(!e.isNavKeyPress() || e.getKey() == e.ENTER){
            this.autoSize();
        }
    },

    autoSize : function(){
        if(!this.grow){
            return;
        }
        var el = this.el;
        var v = el.dom.value;
        var ts = this.textSizeEl;
        Ext.fly(ts).setWidth(this.el.getWidth());
        if(v.length < 1){
            ts.innerHTML = "&#160;&#160;";
        }else{
                                    ts.innerHTML = v + "&#160;\n&#160;";        }
        var h = Math.max(ts.offsetHeight, this.minHeight);
        this.el.setHeight(h);
        this.fireEvent("autosize", this, h);
    },

    setValue : function(v){
        Ext.form.TextArea.superclass.setValue.call(this, v);
        this.autoSize();
    }
});
Ext.form.NumberField = function(config){
    Ext.form.NumberField.superclass.constructor.call(this, config);
};

Ext.extend(Ext.form.NumberField, Ext.form.TextField,  {
    fieldClass: "x-form-field x-form-num-field",
    
    initEvents : function(){
        Ext.form.NumberField.superclass.initEvents.call(this);
        var allowed = "0123456789";
        if(this.allowDecimals){
            allowed += this.decimalSeparator;
        }
        if(this.allowNegative){
            allowed += "-";
        }
        var keyPress = function(e){
            var k = e.getKey();
            if(!Ext.isIE && (e.isNavKeyPress() || k == e.BACKSPACE || k == e.DELETE)){
                return;
            }
            var c = e.getCharCode();
            if(allowed.indexOf(String.fromCharCode(c)) === -1){
                e.stopEvent();
            }
        };
        this.el.on("keypress", keyPress, this);
    },

    validateValue : function(value){
        if(!Ext.form.NumberField.superclass.validateValue.call(this, value)){
            return false;
        }
        if(value.length < 1){              return true;
        }
        if(!(/\d+/.test(value))){
            this.markInvalid(String.format(this.nanText, value));
            return false;
        }
        var num = this.parseValue(value);
        if(num < this.minValue){
            this.markInvalid(String.format(this.minText, this.minValue));
            return false;
        }
        if(num > this.maxValue){
            this.markInvalid(String.format(this.maxText, this.maxValue));
            return false;
        }
        return true;
    },


    parseValue : function(value){
        return parseFloat(String(value).replace(this.decimalSeparator, "."));
    },

    fixPrecision : function(value){
       if(!this.allowDecimals || this.decimalPrecision == -1 || isNaN(value) || value == 0 || !value){
           return value;
       }
                                                 var scale = Math.pow(10, this.decimalPrecision+1);
       var fixed = this.decimalPrecisionFcn(value * scale);
       fixed = this.decimalPrecisionFcn(fixed/10);
       return fixed / (scale/10);
    },

    allowDecimals : true,
    decimalSeparator : ".",
    decimalPrecision : 2,
    decimalPrecisionFcn : function(v){
        return Math.floor(v);
    },
    allowNegative : true,
    minValue : Number.NEGATIVE_INFINITY,
    maxValue : Number.MAX_VALUE,
    minText : "The minimum value for this field is {0}",
    maxText : "The maximum value for this field is {0}",
    nanText : "{0} is not a valid number"
});

Ext.form.DateField = function(config){
    Ext.form.DateField.superclass.constructor.call(this, config);
    if(typeof this.minValue == "string") this.minValue = this.parseDate(this.minValue);
    if(typeof this.maxValue == "string") this.maxValue = this.parseDate(this.maxValue);
    this.ddMatch = null;
    if(this.disabledDates){
        var dd = this.disabledDates;
        var re = "(?:";
        for(var i = 0; i < dd.length; i++){
            re += dd[i];
            if(i != dd.length-1) re += "|";
        }
        this.ddMatch = new RegExp(re + ")");
    }
};

Ext.extend(Ext.form.DateField, Ext.form.TextField,  {
    defaultAutoCreate : {tag: "input", type: "text", size: "16", autocomplete: "off"},

    setSize : function(w, h){
        Ext.form.DateField.superclass.setSize.call(this, w, h);
        this.wrap.setWidth(w);
    },

    initEvents : function(){
        Ext.form.DateField.superclass.initEvents.call(this);
    },

    onRender : function(ct){
        Ext.form.DateField.superclass.onRender.call(this, ct);
        this.wrap = this.el.wrap({cls: "x-form-date-wrap"});
        this.trigger = this.wrap.createChild({
            tag: "a", href: "#", cls: "x-form-date-icon", html: "&#160;"});
        this.trigger.on("click", this.onTriggerClick, this, {preventDefault:true});
        this.wrap.setWidth(this.el.getWidth());
    },

    onFocus : function(){
        Ext.form.DateField.superclass.onFocus.call(this);
        Ext.get(document).on("mousedown", this.mimicBlur, this);
    },

    onBlur : function(){
            },

    mimicBlur : function(e, t){
        if(!this.wrap.contains(t) && (!this.menu || !this.menu.isVisible())){
            Ext.get(document).un("mousedown", this.mimicBlur);
            Ext.form.DateField.superclass.onBlur.call(this);
        }
    },

    validateValue : function(value){
        value = this.formatDate(value);
        if(!Ext.form.DateField.superclass.validateValue.call(this, value)){
            return false;
        }
        if(value.length < 1){              return true;
        }
        var svalue = value;
        value = this.parseDate(value);
        if(!value){
            this.markInvalid(String.format(this.invalidText, svalue, this.format));
            return false;
        }
        var time = value.getTime();
        if(this.minValue && time < this.minValue.getTime()){
            this.markInvalid(String.format(this.minText, this.formatDate(this.minValue)));
            return false;
        }
        if(this.maxValue && time > this.maxValue.getTime()){
            this.markInvalid(String.format(this.maxText, this.formatDate(this.maxValue)));
            return false;
        }
        if(this.disabledDays){
            var day = value.getDay();
            for(var i = 0; i < this.disabledDays.length; i++) {
            	if(day === this.disabledDays[i]){
            	    this.markInvalid(this.disabledDaysText);
                    return false;
            	}
            }
        }
        var fvalue = this.formatDate(value);
        if(this.ddMatch && this.ddMatch.test(fvalue)){
            this.markInvalid(String.format(this.disabledDatesText, fvalue));
            return false;
        }
        return true;
    },

    getValue : function(){
        return this.parseDate(Ext.form.DateField.superclass.getValue.call(this)) || "";
    },

    setValue : function(date){
        Ext.form.DateField.superclass.setValue.call(this, this.formatDate(date));
    },

    parseDate : function(value){
        return (!value || value instanceof Date) ?
               value : Date.parseDate(value, this.format);
    },

    formatDate : function(date){
        return (!date || !(date instanceof Date)) ?
               date : date.format(this.format);
    },

    onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.menu == null){
            this.menu = new Ext.menu.DateMenu({
                minDate : this.minValue,
                maxDate : this.maxValue,
                disabledDatesRE : this.ddMatch,
                disabledDatesText : this.disabledDatesText,
                disabledDays : this.disabledDays,
                disabledDaysText : this.disabledDaysText,
                format : this.format,
                minText : String.format(this.minText, this.formatDate(this.minValue)),
                maxText : String.format(this.maxText, this.formatDate(this.maxValue))
            });
            this.menu.on({
                "select": function(m, d){
                    this.setValue(d);
                },
                show : function(){                     this.el.addClass(this.focusClass);
                },
                hide : function(){
                    this.focus();
                },
                scope: this
            });
        }
        this.menu.picker.setValue(this.getValue() || new Date());
        this.menu.show(this.el, "tl-bl?");
    },

    format : "m/d/y",
    disabledDays : null,
    disabledDaysText : "Disabled",
    disabledDates : null,
    disabledDatesText : "Disabled",
    minValue : null,
    maxValue : null,
    minText : "The date in this field must be after {0}",
    maxText : "The date in this field must be before {0}",
    invalidText : "{0} is not a valid date - it must be in the format {1}"
});

Ext.form.Checkbox = function(config){
    Ext.form.Checkbox.superclass.constructor.call(this, config);
    this.addEvents({
        check : true
    });
};

Ext.extend(Ext.form.Checkbox, Ext.form.Field,  {
    focusClass : "x-form-check-focus",
    fieldClass: "x-form-field",
    checked: false,
    setSize : function(w, h){
        this.wrap.setSize(w, h);
        this.el.alignTo(this.wrap, 'c-c');
    },
    onRender : function(ct){
        if(!this.el){
            this.defaultAutoCreate = {
                tag: "input", type: 'checkbox',
                autocomplete: "off"
            };
        }
        Ext.form.Checkbox.superclass.onRender.call(this, ct);
        this.wrap = this.el.wrap({cls: "x-form-check-wrap"});
    },

    getValue : function(){
        if(this.rendered){
            return this.el.dom.checked;
        }
        return false;
    },

    setValue : function(v){
        this.checked = (v === true || v === 'true' || v == '1');
        if(this.rendered){
            this.el.dom.checked = this.checked;
        }
    }
});
Ext.Editor = function(field, config){
    Ext.Editor.superclass.constructor.call(this, config);
    this.field = field;
    this.addEvents({
        "beforestartedit" : true,
        "startedit" : true,
        "beforecomplete" : true,
        "complete" : true,
        "specialkey" : true
    });
};

Ext.extend(Ext.Editor, Ext.Component, {
    value : "",
    alignment: "c-c?",
    shadow : "frame",
    updateEl : false,
    onRender : function(ct){
        this.el = new Ext.Layer({
            shadow: this.shadow,
            cls: "xeditor",
            parentEl : ct,
            shim : this.shim,
            shadowOffset:3
        });
        this.el.setStyle("overflow", Ext.isGecko ? "auto" : "hidden");
        this.field.render(this.el);
        this.field.show();
        this.field.on("blur", this.onBlur, this);
        this.relayEvents(this.field,  ["specialkey"]);
        if(this.field.grow){
            this.field.on("autosize", this.el.sync,  this.el, {delay:1});
        }
    },

    startEdit : function(el, value){
        if(this.editing){
            this.completeEdit();
        }
        this.boundEl = Ext.get(el);
        var v = value !== undefined ? value : this.boundEl.dom.innerHTML;
        if(this.fireEvent("beforestartedit", this, this.boundEl, v) === false){
            return;
        }
        if(!this.rendered){
            this.render(this.parentEl || document.body);
        }
        this.startValue = v;
        this.field.setValue(v);
        if(this.autoSize){
            var sz = this.boundEl.getSize();
            switch(this.autoSize){
                case "width":
                this.field.setSize(sz.width,  "");
                break;
                case "height":
                this.field.setSize("",  sz.height);
                break;
                default:
                this.field.setSize(sz.width,  sz.height);
            }
        }
        this.el.alignTo(this.boundEl, this.alignment);
        this.editing = true;
        if(Ext.QuickTips){
            Ext.QuickTips.disable();
        }
        this.show();
    },

    realign : function(){
        this.el.alignTo(this.boundEl, this.alignment);
    },

    completeEdit : function(remainVisible){
        var v = this.getValue();
        if(this.revertInvalid !== false && !this.field.isValid()){
            v = this.startValue;
            this.cancelEdit(true);
        }
        if(v == this.startValue && this.ignoreNoChange){
            this.editing = false;
            this.hide();
        }
        if(this.fireEvent("beforecomplete", this, v, this.startValue) !== false){
            this.editing = false;
            if(this.updateEl && this.boundEl){
                this.boundEl.update(v);
            }
            if(remainVisible !== true){
                this.hide();
            }
            this.fireEvent("complete", this, v, this.startValue);
        }
    },

    onShow : function(){
        this.el.show();
        if(this.hideEl !== false){
            this.boundEl.hide();
        }
        this.field.show();
        this.field.focus();
        this.fireEvent("startedit", this.boundEl, this.startValue);
    },

    cancelEdit : function(remainVisible){
        this.setValue(this.startValue);
        if(remainVisible !== true){
            this.hide();
        }
    },

    onBlur : function(){
        if(this.allowBlur !== true && this.editing){
            this.completeEdit();
        }
    },

    onHide : function(){
        if(this.editing){
            this.completeEdit();
            return;
        }
        this.field.blur();
        this.el.hide();
        if(this.hideEl !== false){
            this.boundEl.show();
        }
        if(Ext.QuickTips){
            Ext.QuickTips.enable();
        }
    },

    setValue : function(v){
        this.field.setValue(v);
    },

    getValue : function(){
        return this.field.getValue();
    }
});
