/*
 * Form Validation: jQuery form validation plug-in v1.0 beta 1
 *
 * Copyright (c) 2006 J鰎n Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

/**
 * Validates either a single(!) form on submit or a list
 * of elements immediately. 
 * Shows and hides error labels accordingly.
 *
 * @example $("#myform").validate();
 * @desc Validates a form on submit. Rules are read from metadata.
 *
 * @example $("input.blur").blur(function() {
 *   $(this).validate();
 * });
 * @desc Validates all input elements on blur event (element looses focus).
 *
 * @example $("myform").validate({
 *   submitHandler: function(form) {
 *   	$(form).ajaxSubmit();
 *   }
 * });
 * @desc Uses form plugin's ajaxSubmit method to handle the form submit.
 *
 * @example $("#myform").validate({
 *   rules: {
 *     firstname: { required: true },
 *     age: { number: true },
 *     password: { min: 5, max: 32 }
 *   },
 *   messages {
 *     password: "Please enter a password between 5 and 32 characters long."
 *   }
 * });
 * @desc Validate a form on submit. Rules are specified for three element,
 * and a message is customized for the "password" element.
 *
 * @example $("#myform").validate({
 *   errorClass: "invalid",
 *   errorContainer: $("ul#messageBox"),
 *   errorWrapper: "li",
 *   debug: true
 * });
 * @desc Validates a form on submit.
 *
 * The class used to search, create and display error labels is changed "invalid".
 * This is also added to invalid elements.
 *
 * All error labels are displayed inside an unordered list with the ID "messageBox", as
 * specified by the jQuery object passed as errorContainer option. All error elements
 * are wrapped inside an li element, to create a list of messages.
 *
 * To ease the setup of the form, debug option is set to true, prevent a submit
 * of the form no matter if it is valid or not.
 * @before <ul id="messageBox">
 *   <li><label for="firstname" class="invalid">Please specify your firstname!</label></li>
 * </ul>
 * <form id="myform" action="/login" method="post">
 *   <label for="firstname">Firstname</label><input id="firstname" name="fname" class="{required:true}" />
 *   <label for="lastname">Lastname</label><input id="lastname" name="lname" title="Your lastname, please!" class="{required:true}" />
 * </form>
 * @result <ul id="messageBox">
 *   <li><label for="firstname" class="invalid">Please specify your firstname!</label></li>
 *   <li><label for="lastname" class="invalid">Your lastname, please!</label></li>
 * </ul>
 * <form id="myform" action="/login" method="post">
 *   <label for="firstname">Firstname</label><input id="firstname" name="fname" class="{required:true}" />
 *   <label for="lastname">Lastname</label><input id="lastname" name="lname" title="Your lastname, please!" class="{required:true}" />
 * </form>
 *
 *
 * @param Object options
 * @option String errorClass Use this class to look for existing error labels and add it to
 *		invalid elements, default is "error"
 * @option jQuery errorContainer Search and append error labels inside or to this container, no default
 * @option jQuery errorLabelContainer Search and append error labels inside or to this container, no default;
 *		If specified, this container is used instead of the errorContainer, but both are shown and hidden when necessary
 * @option String errorWrapper Wrap error labels with the specified tagName, eg "li", no default
 * @option Boolean debug If true, the form is not submitted and certain errors are display on the console
 * @option Boolean focusInvalid Focus the last active or first invalid element. Default is true.
 * @option Function submitHandler Callback for handling the actual
 *		submit when the form is valid, default just submits the form
 * @option Object messages Key/value pairs defining custom messages.
 *		Key is the ID or name (for radio/checkbox inputs) of an element,
 *		value the message to display for that element.
 *		Can be specified for one or more elements. If not present,
 *		the title attribute or the default message for that rule is used.
 * @option Object rules Key/value pairs defining custom rules.
 *		Key is the ID or name (for radio/checkbox inputs) of an element,
 *		value is an object consiting of rule/parameter pairs, eg. {required: true, min: 3}
 *		If not specified, rules are read from metadata via metadata plugin.
 *
 * @name validate
 * @type $.validator
 * @cat Plugins/Validate
 */

(function($) { 

$.fn.validate = function(options) {
	var v = new $.validator(options);
	if( this.is('form') ) {
		// select all valid inputs inside the form (no submit or reset buttons)
		v.elements = $(":input:not(:submit):not(:reset)", this);

		v.currentForm = this[0];

		// listen for focus events to save reference to last focused element
		v.elements.focus(function() {
			v.lastActive = this;
		});
		// validate the form on submit
		this.submit(function(event) {
			if(v.settings.debug) {
				// prevent form submit to be able to see console output
				event.preventDefault();
			}
			return v.validateForm();
		});
	} else {
		// validate all elements immediately
		this.each(function() {
			v.hideElementErrors(this);
			v.validateElement(this);
		});
		v.showErrors();
	}
	return v;
};

// constructor for validate object
var v = $.validator = function(options) {
	// intialize properties
	this.errorList = {}

	// override defaults with client settings
	this.settings = $.extend($.extend({}, $.validator.defaults), options || {});
};

/**
 * Default settings for validation.
 *
 * @see validate(Object)
 * @name $.validator.defaults
 * @type Object<String, Object>
 * @cat Plugins/Validate
 */ 
v.defaults = {

	/*
	 * the class used to mark error labels,
	 * eg. <label for="text" class="error">Error text</label>
	 * and fields with errors
	 */
	errorClass: "error",

	/*
	 * the container to show and hide when 
	 * displaying errors, a jQuery object
	 */
	errorContainer: null,

	/*
	 * The container to put error labels in, can or should be put inside
	 * the errorContainer
	 */
	errorLabelContainer: null,

	/*
	 * eg. li to wrap error labels in list element
	 * currently nothing more then one tagName supported
	 */
	errorWrapper: null,

	/*
	 * Override to true to prevent form submit.
	 * Very useful to debug rules, a submit would remove
	 * all console output.
	 */
	debug: false,

	/*
	 * Focus the last active or first invalid element.
	 * WARNING: Can crash browsers when combined with blur-validation.
	 */
	focusInvalid: true,

	/*
	 * If specified, the form submission is delegated to this handler.
	 * The callback is called with the current form as an argument.
	 *
	 * A callback that uses the form plugin to handle the form
	 * submission would look like this:
	 * var handler = function(form) {
	 * 	 $(form).ajaxSubmit(options);
	 * };
	 * $('#myform').validate({
	 *   submitHandler: handler
	 * });
	 */
	submitHandler: null
};

// methods for validator object
v.prototype = {

	/*
	 * Validates a form.
	 * Prevents the form from being submitted if it is invalid
	 * (or if debug mode is on).
	 */
	validateForm: function() {

		// reset errors
		this.errorList = {};

		// set a reference to the current form, to be used as a search context
		this.context = this.currentForm;

		var errorContainer = this.settings.errorLabelContainer || this.settings.errorContainer;
		if(errorContainer) {
			errorContainer.hide();
			this.context = errorContainer;
		}

		// hide all error labels for the form
		var labels = $("label." + this.settings.errorClass, this.context).hide();
		this.elements.removeClass(this.settings.errorClass);
		if( this.settings.errorWrapper ) {
			labels.parents(this.settings.errorWrapper).hide();
		}

		// validate elements
		var v = this;
		this.elements.each(function() {
			v.validateElement(this);
		});

		// check if the form is valid and return
		return this.isFormValid();
	},

	/*
	 * Searches the given element for rules and then
	 * tests the element to these rules.
	 */
	validateElement: function(element) {
		var value = $(element).val();
		var rules = this.findRules(element);
		for( var i=0, rule; rule = rules[i]; i++ ) {
			try {
				var method = v.methods[rule.name];
				if( !method)
					throw "No method found with name " + rule.name;
				if( !method(value, element, rule.parameters) ) {
					// add the error to the array of errors for the element
					var id = ( /radio|checkbox/i.test(element.type) ) ? element.name : element.id;
					if(!id && this.settings.debug) {
						console.error("could not find id/name for element, please check the element (see next line)");
						console.debug(element);
					}
					var list = this.errorList[id] || (this.errorList[id] = []);
					list[list.length] = method.message;
				}
			} catch(e) {
				if(this.settings.debug) {
					console.error("exception occured when checking element " + element.id
						 + ", check the '" + rule.name + "' method");
				}
				throw e;
			}
		}
	},

	/*
	 * Searches for all error labels associated
	 * with the given element and hides them.
	 * To hide labels for a form, use hideFormErrors().
	 */
	hideElementErrors: function(element) {
		var id = /radio|checkbox/i.test(element.type) ? element.name : element.id;
		var errorLabel = $("label." + this.settings.errorClass + "[@for=" + id + "]", this.context).hide();
		if( this.settings.errorWrapper ) {
			errorLabel.parents(this.settings.errorWrapper).hide();
		}
	},

	/*
	 * Check if the validated form has errors or not,
	 * if it has, display them.
	 */
	isFormValid: function() {
		var count = 0;
		// iterate over properties and count them
		for( var i in this.errorList ) {
			count++;
		}
		// if form has no errors
		if(count == 0) {
			// delgate submission if possible
			if(this.settings.submitHandler) {
				// delegate submission to handler
				this.settings.submitHandler(this.currentForm);
				return false;
			}
			return true;
		} else {
			// form has errors, display them and do not submit
			this.showErrors();
			return false;
		}
	},

	/*
	 * Display an error label for every invalid element.
	 * If there is more than one error, only the label
	 * associated with the first error is displayed.
	 * The first invalid element is also focused.
	 */
	showErrors: function() {
		if(this.settings.errorContainer)
			this.settings.errorContainer.show();
		if(this.settings.errorLabelContainer)
			this.settings.errorLabelContainer.show();
		var first = true;
		for(var elementID in this.errorList) {
			if( first && this.settings.focusInvalid ) {
				// check if the last focused element is invalid
				if( this.lastActive && this.errorList[this.lastActive.id])
					// focus it
					this.lastActive.focus();
				// otherwise, find the firt invalid lement
				else {
					// focus the first invalid element
					// does not work with elementID being a name
					try {
						var element = $("#"+elementID);
						if(!element.length)
							element = $('[@name='+elementID+']', this.context);
						element[0].focus();
					} catch(e) { if( this.settings.debug ) console.error(e); }
				}
				first = false;
			}
			// display the error label for the first failed method
			this.showError(elementID, this.errorList[elementID][0]);
		}
	},

	/*
	 * Searches for an error label inside an errorContainer (if specified) or
	 * the current form or, when validating single elements, inside the document.
	 * If errors are not specified for every rule, it searches for a generic error.
	 * Check settings and markup, if the form is invalid, but no error is displayed.
	 */
	showError: function(elementID, message) {
		$("#"+elementID).addClass(this.settings.errorClass);
		var errorLabel = $("label." + this.settings.errorClass, this.context)
			.filter("[@for=" + elementID + "]");
		var w = this.settings.errorWrapper;
		if(errorLabel.size()) {
			errorLabel.show();
			if( w ) {
				errorLabel.parents(w).show();
			}
		} else {
			// create label with custom message or title or default message
			var m = this.settings.messages;
			var message = (m && m[elementID]) || $('#'+elementID).attr('title') || message || "<strong>Warning: No message defined for " + elementID + "</strong>";
			// display default message
			// TODO can't change message
			var errorLabel = $("<label>").attr("for", elementID).addClass("error").html(message);
			var w = this.settings.errorWrapper;
			if(w) {
				errorLabel = errorLabel.show().wrap("<" + w + "></" + w + ">").parent();
			}
			if(this.settings.errorLabelContainer) {
				this.settings.errorLabelContainer.append(errorLabel);
			} else if(this.settings.errorContainer) {
				this.settings.errorContainer.append(errorLabel);
			} else {
				errorLabel.insertAfter("#"+elementID);
			}
			errorLabel.show();
		}
	},

	/*
	 * Searches all rules for the given element and returns them as an
	 * array of rule object, each with a name and parameters.
	 */
	findRules: function(element) {
		var data;
		if(this.settings.rules) {
			var id = ( /radio|checkbox/i.test(element.type) ) ? element.name : element.id;
			data = this.settings.rules[id];
		} else {
			data = $(element).data();
		}
		var rules = [];
		if(!data)
			return rules;
		$.each(data, function(key) {
			var rule = rules[rules.length] = {};
			rule.name = key;
			rule.parameters = this;
		});
		return rules;
	}
};

var getLength = function(value, element) {
	switch( element.nodeName.toLowerCase() ) {
	case 'select':
		return $("option:selected", element).length;
	case 'input':
		if( /radio|checkbox/i.test(element.type) )
			return $(element.form || document).find('[@name=' + element.name + ']:checked').length;
	}
	return value.length;
};

/**
 * Defines a standard set of useful validation methods.
 * 
 * Can be extended, see example below.
 *
 * If "all kind of text inputs" is mentioned for any if the methods defined here,
 * it refers to input elements of type text, password and file and textareas.
 *
 * Note: When you pass strings as paramters to your methods, explicitly convert them
 * to strings before using them. Strings read from metadata are typeof object, whic
 * can cause weird problems. See the equalTo method for an example.
 *
 * @example $.validator.methods.myMethod = function(value, element, parameters, validate) {
 * 	 var isInvalid = ...;
 *   return isInvalid;
 * }
 * @desc If you only need the value parameter, you can define just function(value) {}
 *
 * The parameters are:
 * @param value
 *    the value of the element, eg. the text of a text input
 * @param element
 *    the input element itself, to check for content of attributes other then value
 * @param parameters
 *    an array of parameters, contains all parameters of a rule if specfied
 *    eg. for length:2:5 parameters[0] is 2 and parameters[1] is 5
 *
 * @name $.validator.methods
 * @type Object<String, Function<Boolean>>
 * @cat Plugins/Validate/Methods
 */
v.methods = {

	/**
	 * Return false if the element is empty.
	 * Works with all kind of text inputs, select and checkbox.
	 *
	 * To force a user to select an option from a select box, provide
	 * an empty options like <option value="">Choose...</option>
	 *
	 * @name $.validator.methods.required
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	required: function(value, element) {
		switch( element.nodeName.toLowerCase() ) {
		case 'select':
			var options = $("option:selected", element);
			return options.length > 0 && options[0].value.length > 0;
		case 'input':
			switch( element.type.toLowerCase() ) {
			case 'checkbox':
				return element.checked;
			case 'radio':
				return getLength(value, element) > 0;
			}
		default:
			return value.length > 0;
		}
	},

	/**
	 * Return false, if the element is
	 *
	 * - some kind of text input and its value is too short
	 *
	 * - a set of checkboxes has not enough boxes checked
	 *
	 * - a select and has not enough options selected
	 *
	 * Works with all kind of text inputs and select.
	 *
	 * @param Number length
	 *
	 * @name $.validator.methods.min
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	min: function(value, element, param) {
		var length = getLength(value, element);
		return length >= param;
	},

	/**
	 * Return false, if the element is
	 *
	 * - some kind of text input and its value is too big
	 *
	 * - a set of checkboxes has too many boxes checked
	 *
	 * - a select and has too many options selected
	 *
	 * Works with all kind of text inputs and select.
	 *
	 * @param Number length
	 *
	 * @name $.validator.methods.max
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	max: function(value, element, param) {
		var length = getLength(value, element);
		return length <= param;
	},

	/**
	 * Return true, if the value is not a valid email address.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @name $.validator.methods.email
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	email: function(value) {
		return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(value);
	},

	/**
	 * Return true, if the value is a valid url.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @see http://www.w3.org/Addressing/rfc1738.txt
	 *
	 * @name $.validator.methods.url
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	url: function(value) {
		return /^(https?|ftp):\/\/[A-Z0-9](\.?[A-Z0-9能謁[A-Z0-9_\-能謁*)*(\/([A-Z0-9能謁[A-Z0-9_\-\.能謁*)?)*(\?([A-Z0-9能謁[A-Z0-9_\-\.%\+=&能謁*)?)?$/i.test(value);
	},

	/**
	 * Return true, if the value is a valid date.
	 *
	 * Works with all kind of text inputs.
	 *
	 * WARNING: Limited due to the capability of the JS Date object
	 *
	 * @name $.validator.methods.date
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	date: function(value) {
		return !/Invalid|NaN/.test(new Date(value));
	},

	/**
	 * Return true, if the value is a valid date, according to ISO date standard.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @example $.validator.methods.date("1990/01/01")
	 * @result true
	 *
	 * @example $.validator.methods.date("1990-01-01")
	 * @result true
	 *
	 * @example $.validator.methods.date("01.01.1990")
	 * @result false
	 *
	 * @name $.validator.methods.date
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	dateISO: function(value) {
		return /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/.test(value);
	},

	/**
	 * Return true, if the value is a valid date.
	 *
	 * Works with all kind of text inputs.
	 *
	 * Supports german dates (29.04.1994 or 1.1.2006)
	 *
	 * @name $.validator.methods.dateDE
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	dateDE: function(value) {
		return /^\d\d?\.\d\d?\.\d\d\d?\d?$/.test(value);
	},

	/**
	 * Return true, if the value is a valid number.
	 *
	 * Works with all kind of text inputs.
	 *
	 * Checks for international number format, eg. 100,000.59
	 *
	 * @name $.validator.methods.number
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	number: function(value) {
		return /^-?[,0-9]+(\.\d+)?$/.test(value); 
	},

	/**
	 * Return true, if the value is a valid number.
	 *
	 * Works with all kind of text inputs.
	 *
	 * Checks for german numbers (100.000,59)
	 *
	 * @name $.validator.methods.numberDE
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	numberDE: function(value) {
		return /^-?[\.0-9]+(,\d+)?$/.test(value);
	},

	/**
	 * Returns true if the value contains only digits.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @name $.validator.methods.digits
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	digits: function(value) {
		return /^\d+$/.test(value);
	},
	
	/**
	 * Returns true if the value has the same value
	 * as the element specified by the first parameter.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @param String selection A jQuery expression
	 *
	 * @name $.validator.methods.digits
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	equalTo: function(value, element, param) {
		// strings read from metadata have typeof object, convert to string
		return value == $(""+param).val();
	}
};

/*
 * Add default messages directly to method functions.
 *
 * To add new methods, use $.validator.addMethod
 *
 * To change default messages, change $.validator.methods.[method].message
 */
var messages = {
	required: "This field is required.",
	max: "Please enter a value no longer then {0} characters.",
	min: "Please enter a value of at least {0} characters.",
	email: "Please enter a valid email address.",
	url: "Please enter a valid URL.",
	date: "Please enter a valid date.",
	dateISO: "Please enter a valid date (ISO).",
	dateDE: "Bitte geben Sie ein g黮tiges Datum ein.",
	number: "Please enter a valid number.",
	numberDE: "Bitte geben Sie eine Nummer ein.",
	digits: "Please enter only digits",
	equalTo: "Please enter the same value again."
};
for(var key in messages) {
	v.methods[key].message = messages[key];
}

/**
 * Add a new validation method. It must consist of a name (must be a legal javascript identifier)
 * and a Function, the message is optional.
 *
 * Please note: While the temptation is great to
 * add a regex method that check it's paramter against the value,
 * it is much cleaner to encapsulate those regular expressions
 * inside their own method. If you need lots of slightly different
 * expressions, try to extract a common parameter.
 *
 * Check <a href="http://regexlib.com/DisplayPatterns.aspx">RegExLib.com</a> for a library
 * of regular expressions.
 *
 * @example $.validator.addMethod("domain", function(value) {
 *   return /^http://mycorporatedomain.com/.test(value);
 * }, "Please specify the correct domain for your documents");
 * @desc Adds a method that checks if the value starts with http://mycorporatedomain.com
 *
 * @example $.validator.addMethod("math", function(value, element, params) {
 *  return value == params[0] + params[1];
 * }, "Please enter the correct value for this simple question.");
 *
 * @see $.validator.methods
 *
 * @param String name The name of the method, used to identify and referencing it, must be a valid javascript identifier
 * @param Function rule The actual method implementation, returning true if an element is valid
 * @param String message The default message to display for this method
 *
 * @name $.validator.addMethod
 * @type undefined
 * @cat Plugins/Validate
 */
v.addMethod = function(name, method, message) {
	(v.methods[name] = method).message = message;
};

})(jQuery);