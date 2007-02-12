/*
 * Form Validation: jQuery form validation plug-in v1.0 beta 1
 *
 * Copyright (c) 2006 J�rn Zaefferer
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
 * Markup requirements: All form elements to validate need proper IDs assigned.
 * Can you provide error messages via labels (set for attribute to ID of associated
 * element), in the title attribute of the element, via the messages option, or just
 * use the default messages.
 *
 * @example $("#myform").validate();
 * @desc Validates a form on submit. Rules are read from metadata.
 *
 * @example $("input.blur").blur(function() {
 *   $(this).validate({ focusInvalid: false; });
 * });
 * @desc Validates all input elements on blur event (element looses focus). Deactivates focus of invalid elements.
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
 * and a message is customized for the "password" element. Inline rules are ignored!
 *
 * @example $("#myform").validate({
 *   errorClass: "invalid",
 *   errorContainer: $("#messageBox"),
 *   errorWrapper: "li",
 *   debug: true
 * });
 * @desc Validates a form on submit. The class used to search, create and display
 * error labels is changed to "invalid". This is also added to invalid elements.
 *
 * All error labels are displayed inside an unordered list with the ID "messageBox", as
 * specified by the jQuery object passed as errorContainer option. All error elements
 * are wrapped inside an li element, to create a list of messages.
 *
 * To ease the setup of the form, debug option is set to true, preventing a submit
 * of the form no matter of being valid or not.
 * @before <ul id="messageBox">
 *   <li><label for="firstname" class="invalid">Please specify your firstname!</label></li>
 * </ul>
 * <form id="myform" action="/login" method="post">
 *   <label for="firstname">Firstname</label>
 *   <input id="firstname" name="fname" class="{required:true}" />
 *   <label for="lastname">Lastname</label>
 *   <input id="lastname" name="lname" title="Your lastname, please!" class="{required:true}" />
 * </form>
 * @result <ul id="messageBox">
 *   <li><label for="firstname" class="invalid">Please specify your firstname!</label></li>
 *   <li><label for="lastname" class="invalid">Your lastname, please!</label></li>
 * </ul>
 * <form id="myform" action="/login" method="post">
 *   <label for="firstname">Firstname</label>
 *   <input id="firstname" name="fname" class="{required:true}" />
 *   <label for="lastname">Lastname</label>
 *   <input id="lastname" name="lname" title="Your lastname, please!" class="{required:true}" />
 * </form>
 *
 *
 * @param Map options Optional settings to configure validation
 * @option String errorClass Use this class to look for existing error labels and add it to
 *		invalid elements, default is "error"
 * @option jQuery errorContainer Search and append error labels inside or to this container, no default
 * @option jQuery errorLabelContainer Search and append error labels inside or to this container, no default;
 *		If specified, this container is used instead of the errorContainer, but both are shown and hidden when necessary
 * @option String errorWrapper Wrap error labels with the specified tagName, eg "li", no default
 * @option Boolean debug If true, the form is not submitted and certain errors are display on the console (requires Firebug or Firebug lite)
 * @option Boolean focusInvalid Focus the last active or first invalid element. Default is true.
 * @option Function submitHandler Callback for handling the actual
 *		submit when the form is valid. Gets the form as the only argmument. Default just submits the form.
 * @option Map messages Key/value pairs defining custom messages.
 *		Key is the ID or name (for radio/checkbox inputs) of an element,
 *		value the message to display for that element.
 *		Can be specified for one or more elements. If not present,
 *		the title attribute or the default message for that rule is used.
 * @option Map rules Key/value pairs defining custom rules.
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
	var validatorInstance = new $.validator(options, this);
	if( this.is('form') ) {
		// validate the form on submit
		this.submit(function(event) {
			if(validatorInstance.settings.debug) {
				// prevent form submit to be able to see console output
				event.preventDefault();
			}
			return validatorInstance.validateForm();
		});
	} else {
		// validate all elements immediately
		this.each(function() {
			validatorInstance.hideElementErrors(this);
			validatorInstance.validateElement(this);
		});
		validatorInstance.showErrors();
	}
	return validatorInstance;
};

// constructor for validate object
var v = $.validator = function(options, form) {
	// intialize properties
	this.errorList = {};
	
	if( form.is('form') ) {
		// select all valid inputs inside the form (no submit or reset buttons)
		this.elements = $(":input:not(:submit):not(:reset)", form);

		this.currentForm = form[0];
		
		// listen for focus events to save reference to last focused element
		var instance = this;
		this.elements.focus(function() {
			instance.lastActive = this;
		});
	}

	// override defaults with client settings
	this.settings = $.extend({}, v.defaults, options);
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
		this.elements.removeClass(""+this.settings.errorClass);
		if( this.settings.errorWrapper ) {
			labels.parents(this.settings.errorWrapper).hide();
		}

		// validate elements
		var instance = this;
		this.elements.each(function() {
			instance.validateElement(this);
		});

		// check if the form is valid and return
		return this.isFormValid();
	},

	/*
	 * Searches the given element for rules and then
	 * tests the element to these rules.
	 */
	validateElement: function(element) {
		var rules = this.findRules(element);
		for( var i=0, rule; rule = rules[i]; i++ ) {
			try {
				var method = v.methods[rule.name];
				if( !method)
					throw "validateElement() error: No method found with name " + rule.name;
				if( !method( $(element).val(), element, rule.parameters ) ) {
					// add the error to the array of errors for the element
					var id = ( element.type.match(/radio|checkbox/i) ) ? element.name : element.id;
					if(!id && this.settings.debug) {
						console.error("could not find id/name for element, please check the element %o", element);
					}
					var list = this.errorList[id] || (this.errorList[id] = []);
					list[list.length] = method.message && this.formatMessage(method.message, rule.parameters);
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
	 * Replace placeholders in messages, if any.
	 *
	 * Currently limited to a maxium of two placeholders.
	 *
	 * Expected format: "first placeholder: {0}, second placeholder: {1}, both optional"
	 *
	 * @param String message
	 * @param Array<Object>|Object param
	 */
	formatMessage: function(message, param) {
		var first = param.constructor == Array ? param[0] : param;
		return message.replace("{0}", first || "").replace("{1}", param[1] || "");
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
		// if form has errors
		if(count) {
			// form has errors, display them and do not submit
			this.showErrors();
			return false;
		} else {
			// delgate submission if possible, if it has no errors
			if(this.settings.submitHandler) {
				// delegate submission to handler
				this.settings.submitHandler(this.currentForm);
				return false;
			}
			return true;
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
	
		// find message for this label
		var m = this.settings.messages;
		var message = (m && m[elementID]) || $('#'+elementID).attr('title') || message || "<strong>Warning: No message defined for " + elementID + "</strong>";
		
		$("#"+elementID).addClass(this.settings.errorClass);
		var errorLabel = $("label." + this.settings.errorClass, this.context)
			.filter("[@for=" + elementID + "]");
		var w = this.settings.errorWrapper;
		if( errorLabel.length ) {
			// check if we have a generated label, replace the message then
			if( errorLabel.attr("generated") ) {
				errorLabel.text(message);
			}
			errorLabel.show();
			if( w ) {
				errorLabel.parents(w).show();
			}
		} else {
			// create label with custom message or title or default message
			// display default message
			// TODO can't change message
			var errorLabel = $("<label>").attr({"for": elementID, generated: true}).addClass("error").html(message);
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
 * to strings before using them. Strings read from metadata are of type "object", which
 * can cause weird problems. See the equalTo method for an example.
 *
 * @example $.validator.methods.myMethod = function(value, element, parameters, validate) {
 * 	 var isValid = ...;
 *   return isValid;
 * }
 * @desc Defines a new method called "myMethod".
 *
 * @example $.validator.methods.containsFoobar = function(value) {
 *   return value == "foobar";
 * }
 * @desc If you only need the value parameter, you don't have to specify the other arguments.
 *
 * @param String value the value of the element, eg. the text of a text input
 * @param Element element the input element itself, to check for content of attributes other then value
 * @param Object paramater Some parameter, like a number for min/max rules
 *
 * @name $.validator.methods
 * @type Object<String, Function(String,Element,Object):Boolean>
 * @cat Plugins/Validate/Methods
 */
v.methods = {

	/**
	 * Return false if the element is empty.
	 * Works with all kind of text inputs, selects, checkboxes and radio buttons.
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
			return options.length > 0 && ( element.type == "select-multiple" || options[0].value.length > 0);
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
	 * Works with all kind of text inputs, checkboxes and select.
	 *
	 * @param Number min
	 *
	 * @name $.validator.methods.min
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	minLength: function(value, element, param) {
		var length = getLength(value, element);
		return !v.methods.required(value, element) || length >= param;
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
	 * Works with all kind of text inputs, checkboxes and selects.
	 *
	 * @param Number max
	 *
	 * @name $.validator.methods.max
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	maxLength: function(value, element, param) {
		var length = getLength(value, element);
		return !v.methods.required(value, element) || length <= param;
	},
	
	/**
	 * Return false, if the element is
	 *
     * - some kind of text input and its value is too short or too long
     *
     * - a set of checkboxes has not enough or too many boxes checked
     *
     * - a select and has not enough or too many options selected
     *
     * Works with all kind of text inputs, checkboxes and selects.
     *
     * @param Array<Number> min/max
     *
     * @name $.validator.methods.rangeLength
     * @type Boolean
     * @cat Plugins/Validate/Methods
     */
	rangeLength: function(value, element, param) {
		var length = getLength(value, element);
		return !v.methods.required(value, element) || ( length >= param[0] && length <= param[1] );
	},

	/**
	 * Return true, if the value is greater than or equal to the specified minimum.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @param Number min
	 *
	 * @name $.validator.methods.minValue
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	minValue: function( value, element, param ) {
		return !v.methods.required(value, element) || value >= param;
	},
	
	/**
	 * Return true, if the value is less than or equal to the specified maximum.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @param Number max
	 *
	 * @name $.validator.methods.maxValue
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	maxValue: function( value, element, param ) {
		return !v.methods.required(value, element) || value <= param;
	},
	
	/**
	 * Return true, if the value is in the specified range.
	 *
	 * Works with all kind of text inputs.
	 *
	 * @param Array<Number> min/max
	 *
	 * @name $.validator.methods.rangeValue
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	rangeValue: function( value, element, param ) {
		return !v.methods.required(value, element) || ( value >= param[0] && value <= param[1] );
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
	email: function(value, element) {
		return !v.methods.required(value, element) || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(value);
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
	url: function(value, element) {
		return !v.methods.required(value, element) || /^(https?|ftp):\/\/[A-Z0-9](\.?[A-Z0-9���][A-Z0-9_\-���]*)*(\/([A-Z0-9���][A-Z0-9_\-\.���]*)?)*(\?([A-Z0-9���][A-Z0-9_\-\.%\+=&���]*)?)?$/i.test(value);
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
	date: function(value, element) {
		return !v.methods.required(value, element) || !/Invalid|NaN/.test(new Date(value));
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
	dateISO: function(value, element) {
		return !v.methods.required(value, element) || /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/.test(value);
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
	dateDE: function(value, element) {
		return !v.methods.required(value, element) || /^\d\d?\.\d\d?\.\d\d\d?\d?$/.test(value);
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
	number: function(value, element) {
		return !v.methods.required(value, element) || /^-?[,0-9]+(\.\d+)?$/.test(value); 
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
	numberDE: function(value, element) {
		return !v.methods.required(value, element) || /^-?[\.0-9]+(,\d+)?$/.test(value);
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
	digits: function(value, element) {
		return !v.methods.required(value, element) || /^\d+$/.test(value);
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
	maxLength: "Please enter a value no longer then {0} characters.",
	minLength: "Please enter a value of at least {0} characters.",
	rangeLength: "Please enter a value between {0} and {1} characters long.",
	email: "Please enter a valid email address.",
	url: "Please enter a valid URL.",
	date: "Please enter a valid date.",
	dateISO: "Please enter a valid date (ISO).",
	dateDE: "Bitte geben Sie ein g�ltiges Datum ein.",
	number: "Please enter a valid number.",
	numberDE: "Bitte geben Sie eine Nummer ein.",
	digits: "Please enter only digits",
	equalTo: "Please enter the same value again.",
	rangeValue: "Please enter a value between {0} and {1}.",
	maxValue: "Please enter a value less than or equal to {0}.",
	minValue: "Please enter a value greater than or equal to {0}."
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
 * A library of regular expressions: http://regexlib.com/DisplayPatterns.aspx
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