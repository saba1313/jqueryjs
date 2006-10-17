/**
 * ajaxSubmit() provides a mechanism for submitting an HTML form using AJAX.
 *
 * All arguments are optional.
 *
 * If a target arg is provided, it is used to identify the element(s) to be updated with the 
 * server response.  The target argument can be a jQuery selector string, a jQuery object, or a DOM element.
 *
 * If a post-submit callback method is provided it is invoked after the response has been returned
 * from the server.  
 *
 * If neither target or post-submit arguments are provided then the data returned from the server (if any)
 * is evaluated in the global context.
 *
 * The pre-submit callback can be provided as a hook for running pre-submit logic or for validating the
 * form data.  If the pre-submit callback returns false the form will not be submitted. The pre-submit callback
 * is invoked with two arguments, the form data in array format, and the jQuery object.  The form
 * data array takes the form:
 *
 *     [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 *
 * The url and mth arguments can also be provided to override the form defaults.  If not provided,
 * the form emement's 'action' and 'method' properties will be used.
 *
 * The semantic argument can be used to force form serialization in semantic order.  If your form must
 * be submitted with name/value pairs in semantic order then pass true for this arg, otherwise pass false
 * (or nothing) to avoid the overhead for this logic (which can be significant for very large forms).
 *
 * @example $("#form-id").ajaxSubmit("#destination");
 * @desc The form is submitted and the resulting HTML contents are loaded into the #destination element.
 *
 * @example $("#form-id").ajaxSubmit(function(){
 *   alert("all done!");
 * });
 * @desc The form is submitted and a callback is fired, letting you know when it's done.
 *
 * @example $("#form-id").ajaxSubmit();
 * @desc The form is submitted and the results returned from the server are
 * automatically executed (useful for having the server return more Javascript commands to execute).
 *
 * @example $("#form-id").submit(function() {
 *     $(this).ajaxSubmit("#destination");
 *     return false;
 * });
 * @desc Typical way of binding this method to a form's submit event.
 *
 * @name ajaxSubmit
 * @type jQuery
 * @param target   jQuery selector string, jQuery object or DOM element which identifies the element(s) to update with the server response
 * @param post_cb  callback to be invoked after any results are returned
 * @param pre_cb   callback to be invoked after gathering the form data but before submitting the form to the server
 * @param url      url to invoke (if provided this will override the form's 'action' attribute)
 * @param mth      method to use, 'POST' or 'GET' (if provided this will override the form's 'method' attribute)
 * @param semantic true if serialization must maintain strict semantic ordering of elements (slower)
 * @return jQuery 
 * @see formToArray
 * @see ajaxForm
 * @see load
 * @see $.ajax
 * @author jQuery Community
 */
jQuery.fn.ajaxSubmit = function(target, post_cb, pre_cb, url, mth, semantic) {
    var a = this.formToArray(semantic);
    
    // give pre-callback opportunity to abort the submit
    if (pre_cb && pre_cb.constructor == Function && pre_cb(a, this) === false) return;

    url = url || this.attr('action') || '';
    mth = (mth || this.attr('method') || 'GET').toUpperCase();
    var q = jQuery.param(a);
    var get = mth == 'GET';

    if (get) url = url + '?' + q;
    
    // if no target or 'post' callback was provided then default to a callback
    // that evals the response
    var t = target || post_cb || function(r) {
            if (r.responseText) eval.call(window, r.responseText)
        };

    if (t && t.constructor != Function)
        jQuery(t).load(url, get ? null : a, post_cb);
    else
        jQuery.ajax({ url: url, success: t, data: get ? null : q, type: mth });
    return this;
};


/**
 * ajaxForm() provides a mechanism for fully automating form submission.
 *
 * The advantages of using this method instead of ajaxSubmit() are:
 *
 * 1: This method will include coordinates for <input type="image" /> elements (if the element is used to submit the form).
 * 2. This method will include the submit element's name/value data (for the element that was used to submit the form).
 * 3. This method binds the submit() method to the form for you.
 *
 * Note that for accurate x/y coordinates of image submit elements in ALL browsers
 * you need to also use the "dimensions" plugin (this method will auto-detect its presence).
 *
 * All arguments are optional.
 *
 * If a target arg is provided, it is used to identify the element(s) to be updated with the 
 * server response.  The target argument can be a jQuery selector string, a jQuery object, or a DOM element.
 *
 * If a post-submit callback method is provided it is invoked after the response has been returned
 * from the server.  
 *
 * If neither target or post-submit arguments are provided then the data returned from the server (if any)
 * is evaluated in the global context.
 *
 * The pre-submit callback can be provided as a hook for running pre-submit logic or for validating the
 * form data.  If the pre-submit callback returns false the form will not be submitted. The pre-submit callback
 * is invoked with two arguments, 1) the form data in array format, and 2) the jQuery object.  The form
 * data array takes the form:
 *
 *     [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 *
 * The semantic argument can be used to force form serialization in semantic order.  If your form must
 * be submitted with name/value pairs in semantic order then pass true for this arg, otherwise pass false
 * (or nothing) to avoid the overhead for this logic (which can be significant for very large forms).
 *
 * @example $('#form-id').ajaxForm();
 * @desc Just eval the results returned from the backend.
 *
 * @example $('#form-id').ajaxForm('#target-id');
 * @desc Render backend results directly to target ID (expects (x)HTML).
 *
 * @example $('#form-id').ajaxForm(post_callback);
 * @desc Submit to backend URL (form action) then call this function.
 *
 * @example $('#form-id').ajaxForm('#target-id', post_callback);
 * @desc Load target ID with backend results then call a function.
 *
 * @example $('#form-id').ajaxForm('#target-id', null, pre_callback);
 * @desc Call a browser function (for validation) and then load server results to target ID.
 *
 * @example $('#form-id').ajaxForm('#target-id', post_callback, pre_callback);
 * @desc Call validation function first then load server results to target ID and then call post_callback function.
 *
 * @name ajaxForm
 * @param target   jQuery selector string, jQuery object or DOM element which identifies the element(s) to update with the server response
 * @param post_cb  callback to be invoked after any results are returned
 * @param pre_cb   callback to be invoked after gathering the form data but before submitting the form to the server
 * @param semantic true if serialization must maintain strict semantic ordering of elements (slower)
 * @return jQuery
 * @type jQuery
 * @see formToArray
 * @see ajaxSubmit
 * @author jQuery Community
 */
jQuery.fn.ajaxForm = function(target, post_cb, pre_cb, semantic) {
    return this.each(function() {
        jQuery("input[@type=submit],input[@type=image]", this).click(function(ev) {
            this.form.clk = this;
            
            if (ev.offsetX != undefined) {
                this.form.clk_x = ev.offsetX;
                this.form.clk_y = ev.offsetY;
            } else if (typeof jQuery.fn.offset == 'function') { // use dimensions plugin if it's installed
                var offset = $(this).offset();
                this.form.clk_x = ev.pageX - offset.left;
                this.form.clk_y = ev.pageY - offset.top;
            } else {
                this.form.clk_x = ev.pageX - this.offsetLeft;
                this.form.clk_y = ev.pageY - this.offsetTop;
            }
        })
    }).submit(function(e) {
        jQuery(this).ajaxSubmit(target, post_cb, pre_cb, null, null, semantic);
        return false;
    });
};


/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * ajaxSubmit() and ajaxForm() methods.
 *
 * The semantic argument can be used to force form serialization in semantic order.  If your form must
 * be submitted with name/value pairs in semantic order then pass true for this arg, otherwise pass false
 * (or nothing) to avoid the overhead for this logic (which can be significant for very large forms).
 *
 * @example var data = $("#myForm").formToArray();
 * $.post( "myscript.cgi", data );
 * @desc Collect all the data from a form and submit it to a server-side application.
 *
 * @name formToArray
 * @param semantic true if serialization must maintain strict semantic ordering of elements (slower)
 * @type Array<Object>
 * @see ajaxForm
 * @see ajaxSubmit
 * @author jQuery Community
 */
jQuery.fn.formToArray = function(semantic) {
    var a = [];
    var q = semantic ? ':input' : 'input,textarea,select,button';
    
    jQuery(q, this).each(function() {
        var n = this.name;
        var t = this.type;

        if ( !n || this.disabled || t == 'reset' ||
            (t == 'checkbox' || t == 'radio') && !this.checked ||
            (t == 'submit' || t == 'image' || t == 'button') && this.form && this.form.clk != this ||
            this.tagName.toLowerCase() == 'select' && this.selectedIndex == -1)
            return;

        if (t == 'image' && this.form.clk_x != undefined)
            return a.push(
                {name: n+'_x', value: this.form.clk_x},
                {name: n+'_y', value: this.form.clk_y}
            );

        if (t == 'select-multiple') {
            jQuery('option:selected', this).each( function() {
                a.push({name: n, value: this.value});
            });
            return;
        }
        a.push({name: n, value: this.value});
    });
    return a;
};

/**
 * serializes form data into a 'submittable' string.  This method will return a string 
 * in the format: name1=value1&name2=value2
 *
 * The semantic argument can be used to force form serialization in semantic order.  If your form must
 * be submitted with name/value pairs in semantic order then pass true for this arg, otherwise pass false
 * (or nothing) to avoid the overhead for this logic (which can be significant for very large forms).
 *
 * @example var data = $("#myForm").serialize();
 * $.ajax('POST', "myscript.cgi", data);
 * @desc Collect all the data from a form into a single string
 *
 * @name serialize
 * @param semantic true if serialization must maintain strict semantic ordering of elements (slower)
 * @type String
 * @see formToArray
 * @author jQuery Community
 */
jQuery.fn.serialize = function(semantic) {
    //hand off to jQuery.param for proper encoding
    return jQuery.param(this.formToArray(semantic));
};
