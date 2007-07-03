/*
 * jQuery form plugin
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */
 
// shrunk from http://jquery.com/dev/svn/trunk/plugins/form/form.js

//
// The :input selection expression was added in jQuery v1.0.2.
// Add it automatically here if it doesn't exist
//
if (!jQuery.expr[':']['input'])
    jQuery.extend(jQuery.expr[':'], {input: "a.nodeName.toLowerCase().match(/input|select|textarea|button/)" });

jQuery.fn.ajaxSubmit = function(options) {
    options = jQuery.extend({
        target:   null,
        url:      this.attr('action') || '',
        method:   this.attr('method') || 'GET',
        before:   null,
        after:    null,
        dataType: null, // 'xml', 'script', or 'json' (@see jQuery.httpData)
        semantic: false
    }, options || {});

    // remap 'after' to 'success' for the load and ajax methods
    options.success = options.success || options.after;

    var a = this.formToArray(options.semantic);

    // give pre-submit callback an opportunity to abort the submit
    if (options.before && options.before(a, this) === false) return;

    var q = jQuery.param(a);
    var get = (options.method && options.method.toUpperCase() == 'GET');

    if (get)
        // if url already has a '?' then append args after '&'
        options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;

    // perform a load on the target only if dataType is not provided
    if (!options.dataType && options.target)
        jQuery(options.target).load(options.url, get ? null : a, options.success);
    else {
        // remap 'method' to 'type' for the ajax method
        options.type = options.method;
        options.data = get ? null : q;  // data is null for 'get' or the query string for 'post'
        // pass options along to ajax method
        jQuery.ajax(options);
    }
    return this;
};

jQuery.fn.ajaxForm = function(options) {
    return this.each(function() {
        jQuery("input:submit,input:image", this).click(function(ev) {
            this.form.clk = this;

            if (ev.offsetX != undefined) {
                this.form.clk_x = ev.offsetX;
                this.form.clk_y = ev.offsetY;
            } else if (typeof jQuery.fn.offset == 'function') { // try to use dimensions plugin
                var offset = $(this).offset();
                this.form.clk_x = ev.pageX - offset.left;
                this.form.clk_y = ev.pageY - offset.top;
            } else {
                this.form.clk_x = ev.pageX - this.offsetLeft;
                this.form.clk_y = ev.pageY - this.offsetTop;
            }
        })
    }).submit(function(e) {
        jQuery(this).ajaxSubmit(options);
        return false;
    });
};


jQuery.fn.formToArray = function(semantic) {
    var a = [];
    var q = semantic ? ':input' : 'input,textarea,select,button';

    jQuery(q, this).each(function() {
        var n = this.name;
        var t = this.type;
        var tag = this.tagName.toLowerCase();

        if ( !n || this.disabled || t == 'reset' ||
            (t == 'checkbox' || t == 'radio') && !this.checked ||
            (t == 'submit' || t == 'image' || t == 'button') && this.form && this.form.clk != this ||
            tag == 'select' && this.selectedIndex == -1)
            return;

        if (t == 'image' && this.form.clk_x != undefined)
            return a.push(
                {name: n+'_x', value: this.form.clk_x},
                {name: n+'_y', value: this.form.clk_y}
            );

        if (tag == 'select') {
            // pass select element off to fieldValue to reuse the IE logic
            var val = jQuery.fieldValue(this, false); // pass false to optimize fieldValue
            if (t == 'select-multiple') {
                for (var i=0; i < val.length; i++)
                    a.push({name: n, value: val[i]});
            }
            else
                a.push({name: n, value: val});
        }
        else
            a.push({name: n, value: this.value});
    });
    return a;
};

jQuery.fn.formSerialize = function(semantic) {
    //hand off to jQuery.param for proper encoding
    return jQuery.param(this.formToArray(semantic));
};

jQuery.fn.fieldValue = function(successful) {
    var cbVal = [], cbName = null;

    // loop until we find a value
    for (var i = 0; i < this.length; i++) {
        var el = this[i];
        if (el.type == 'checkbox') {
            if (!cbName) cbName = el.name || 'unnamed';
            if (cbName != el.name) // return if we hit a checkbox with a different name
                return cbVal;
            var val = jQuery.fieldValue(el, successful);
            if (val !== null && typeof val != 'undefined') 
                cbVal.push(val);
        }
        else {
            var val = jQuery.fieldValue(el, successful);
            if (val !== null && typeof val != 'undefined') 
                return val;
        }
    }
    return cbVal;
};

jQuery.fieldValue = function(el, successful) {
    var n = el.name;
    var t = el.type;
    var tag = el.tagName.toLowerCase();
    if (typeof successful == 'undefined') successful = true;

    if (successful && ( !n || el.disabled || t == 'reset' ||
        (t == 'checkbox' || t == 'radio') && !el.checked ||
        (t == 'submit' || t == 'image' || t == 'button') && el.form && el.form.clk != el ||
        tag == 'select' && el.selectedIndex == -1))
            return null;
    
    if (tag == 'select') {
        var a = [];
        for(var i=0; i < el.options.length; i++) {
            var op = el.options[i];
            if (op.selected) {
                // extra pain for IE...
                var v = jQuery.browser.msie && !(op.attributes['value'].specified) ? op.text : op.value;
                if (t == 'select-one')
                    return v;
                a.push(v);
            }
        }
        return a;
    }
    return el.value;
};
