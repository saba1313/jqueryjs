/**
 * A method for submitting an HTML form using AJAX, as opposed to the
 * standard page-load way.
 *
 * This method attempts to mimic the functionality of the original form
 * as best as possible (duplicating the method, action, and exact contents
 * of the form).
 *
 * There are three different resulting operations that can occur, after
 * your form has been submitted.
 *
 * Additionally, an optional pre-submit callback can be provided. If it,
 * when called with the contents of the form, returns false, the form will
 * not be submitted.
 *
 * @example $("form").ajaxSubmit(function(){
 *   alert("all done!");
 * });
 * @desc The form is submitted and a callback is fired, letting you know when it's done.
 *
 * @example $("form").ajaxSubmit("#destination");
 * @desc The form is submitted and the resulting HTML contents are injected into the page, at your specified location.
 *
 * @example $("form").ajaxSubmit();
 * @desc The form is submitted and the results returned from the server are
 * automatically executed (useful for having the server return more Javascript commands to execute).
 *
 * @name ajaxSubmit
 * @type jQuery
 * @param target   arg for the target id element to render
 * @param post_cb  callback after any results are returned
 * @param pre_cb   callback function before submission
 * @return jQuery 
 * @see ajaxForm
 * @see load
 * @see $.ajax
 * @author Mark Constable (markc@renta.net)
 * @author G. vd Hoven
 * @author Mike Alsup
 * @author Sam Collett
 * @author John Resig
 */
$.fn.ajaxSubmit = function(target, post_cb, pre_cb, url, mth) {
	var vars = this.serialize();
	
	if (pre_cb && pre_cb.constructor == Function && pre_cb(vars) === false) return;

	var f = this.get(0);
	var url = url || f.action || '';
	var mth = mth || f.method || 'POST';

	if (target && target.constructor == Function)
		$.ajax(mth, url, $.param(vars), target);
	else if (target && target.constructor == String)
		$(target).load(url, vars, post_cb);
	else {
		vars.push({name: 'evaljs', value: 1});
		$.ajax(mth, url, $.param(vars), function(r) {
			eval(r.responseText);
		});
	}

	return this;
};

/**
 * Turn any HTML form into a form that submits using AJAX only.
 *
 * The advantage of using this method, instead of the ajaxSubmit()
 * and submit() methods, is to make absolutely sure that the
 * coordinates of <input type="image"/> elements are transmitted
 * correctly OR figuring out exactly which <input type="submit"/>
 * element was clicked to submit the form.
 *
 * If neither of the above points are important to you, then you
 * may want to stick with the ajaxSubmit() function.
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
 * @desc Call a browser function (for validation) and then (optionally) load server results to target ID.
 *
 * @example $('#form-id').ajaxForm('#target-id', post_callback, pre_callback);
 * @desc Call validation function first then load server results to target ID and then also call a browser function.
 *
 * @name ajaxForm
 * @param target   arg for the target id element to render
 * @param post_cb  callback after any results are returned
 * @param pre_cb   callback function before submission
 * @return jQuery
 * @type jQuery
 * @see serialize
 * @see submit
 * @see ajaxSubmit
 * @author Mark Constable (markc@renta.net)
 * @author G. vd Hoven
 * @author Mike Alsup
 * @author Sam Collett
 * @author John Resig
 */
$.fn.ajaxForm = function(target, post_cb, pre_cb) {
	return this.each(function(){
		$("input[@type=submit],input[@type=image]", this).click(function(ev){
			this.form.clicked = this;
			if (ev.offsetX != undefined) {
				this.form.clicked_x = ev.offsetX;
				this.form.clicked_y = ev.offsetY;
			} else {
				this.form.clicked_x = ev.pageX - this.offsetLeft;
				this.form.clicked_y = ev.pageY - this.offsetTop;
			}
		});
	}).submit(function(e){
		$(this).ajaxSubmit(target, post_cb, pre_cb);
		return false;
	});
};

/**
 * This function gathers form element variables into an array of objects
 * that can be passed to any AJAX function (such as $.post, $.ajax, or load).
 *
 * This function is primarily used by ajaxSubmit() and ajaxForm(), but can
 * be used standalone as long as you don't need the x and y coordinates
 * associated with an <input type="image"/> elements.
 *
 * @example var vars = $("#myForm").serialize();
 * $.post( "myscript.cgi", vars );
 * @desc Collect all the data from a form and submit it to a server-side application.
 *
 * @name serialize
 * @type Array<Object>
 * @see ajaxForm
 * @see ajaxSubmit
 * @see $.ajax
 * @see $.post
 * @see $.get
 * @author Mark Constable (markc@renta.net)
 * @author G. vd Hoven
 * @author Mike Alsup
 * @author Sam Collett
 * @author John Resig
 */
$.fn.serialize = function() {
	var a = [];
	var ok = {INPUT:true, TEXTAREA:true, OPTION:true};

	$('*', this).each(function() {
		var par = this.parentNode;
		var p = par.nodeName.toUpperCase();
		var n = this.name || p == 'OPTGROUP' && par.parentNode.name || p == 'SELECT' && par.name || this.id;

		if ( !n || this.disabled || this.type == 'reset' || 
			(this.type == 'checkbox' || this.type == 'radio') && !this.checked || 
			!ok[this.nodeName.toUpperCase()] ||
			(this.type == 'submit' || this.type == 'image') && this.form.clicked != this ||
			(p == 'SELECT' || p == 'OPTGROUP') && !this.selected ) return;

		if (this.type == 'image' && this.form.clicked_x)
			return a.push(
				{name: this.name+'_x', value: this.form.clicked_x},
				{name: this.name+'_y', value: this.form.clicked_y}
			);

		a.push({name: n, value: this.value});
	});

	return a;
};
