/*
 * Web Forms 0.3.5 - jQuery plugin
 * 
 * Copyright (c) 2007 Scott Gonzalez
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

// http://www.whatwg.org/specs/web-forms/current-work/

(function($) {

function getCheckedCount(element_name) {
	var checked_count = 0;
	$('input[name="' + element_name + '"]').each(function() {
		if ($(this).is(':checked')) {
			checked_count++;
		}
	});
	
	return checked_count;
};

function isNumber(val) {
	return /^-?\d*\.?\d+(e-?\d+)?$/.test(val);
};

var validityState = {
	typeMismatch: false,
	rangeUnderflow: false,
	rangeOverflow: false,
	stepMismatch: false,
	tooLong: false,
	patternMismatch: false,
	valueMissing: false,
	customError: false,
	valid: true
};

var validationMessages = {
	typeMismatch: function(elem) {
		var type = $(elem).attr('wftype');
		switch (type) {
			case 'email':
				return 'Value must be an email address.';
			break;
			case 'number':
				return 'Value must be a number.';
			break;
			case 'url':
				return 'Value must be a URL.';
			break;
		}
	},
	rangeUnderflow: function(elem) {
		return 'Value may not be less than ' + $(elem).attr('min') + '.';
	},
	rangeOverflow: function(elem) {
		return 'Value may not be more than ' + $(elem).attr('max') + '.';
	},
	stepMismatch: 'Step mismatch.',
	tooLong: function(elem) {
		return 'Value may not be more than ' + $(elem).attr('maxlength') + ' characters.';
	},
	patternMismatch: function(elem) {
		var title = $(elem).attr('title');
		return (title ? title : 'Pattern mismatch');
	},
	valueMissing: 'This field is required.',
	customError: function(elem) {
		return getWebForms(elem).customErrorMessage;
	}
};

var validator = {
	typeMismatch: function($elem) {
		var type = $elem.attr('wftype');
		var val = $elem.val();
		if (val != '') {
			switch (type) {
				case 'email':
					return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);
				break;
				case 'number':
					return isNumber(val);
				break;
				case 'url':
					// TODO: URL validation
				break;
			}
		}
		
		return true;
	},
	
	// TODO: update to work with date/time values (and update error message)
	rangeUnderflow: function($elem) {
		var min = $elem.attr('min');
		if ((min != '') && isNumber(min)) {
			var val = $elem.val();
			if (isNumber(val)) {
				return (Number(min) <= Number(val));
			}
		}
		
		return true;
	},
	
	// TODO: update to work with date/time values (and update error message)
	rangeOverflow: function($elem) {
		var max = $elem.attr('max');
		if ((max != '') && isNumber(max)) {
			var val = $elem.val();
			if (isNumber(val)) {
				return (Number(max) >= Number(val));
			}
		}
		
		return true;
	},
	
	// TODO: update to work with date/time values (and update error message)
	stepMismatch: function($elem) {
		var step = $elem.attr('step');
		if (step && isNumber(step)) {
			var base = $elem.attr('min');
			if ((min == '') || !isNumber(min)) {
				base = $elem.attr('max');
			}
			if ((base != '') && isNumber(base)) {
				var val = $elem.val();
				if (isNumber(val)) {
					return (parseInt((val - base) / step) == ((val - base) / step));
				}
			}
		}
		
		return true;
	},
	
	tooLong: function($elem) {
		var maxlength = $elem.attr('maxlength');
		if (maxlength && (maxlength > 0)) {
			return (maxlength >= $elem.val().length);
		}
		
		return true;
	},
	
	patternMismatch: function($elem) {
		var pattern = $elem.attr('pattern');
		var val = $elem.val();
		if ((pattern || (pattern == 0)) && (val != ''))
		{
			var regex = new RegExp('^(?:' + pattern + ')$');
			if (!regex.test(val)) {
				return false;
			}
		}
		
		return true;
	},
	
	valueMissing: function($elem) {
		if ($elem.attr('required')) {
			switch ($elem.attr('type')) {
				case 'checkbox':
				case 'radio':
					var checked_count = getCheckedCount($elem.attr('name'));
					if ($elem.is(':checkbox')) {
						return (checked_count >= 1);
					} else {
						return (checked_count == 1);
					}
				break;
				default:
					if ($elem.val() == '') {
						return false;
					}
				break;
			}
		}
		
		return true;
	}
};

var willValidateExpr = '' +
	':input' +
	':not(:disabled):not([readonly])' +
	':not([type="hidden"]):not(:button):not(:reset):not(:submit)';

function initializeWebForms(elem) {
	var webForms = {
		willValidate: $(elem).willValidate(),
		validity: $.extend({}, validityState),
		customErrorMessage: ''
	};
	$.data(elem, 'webForms', webForms);
	return webForms;
}

function getWebForms(elem) {
	var webForms = $.data(elem, 'webForms');
	if (webForms == undefined) {
		webForms = initializeWebForms(elem);
	}
	return webForms;
}

function validate(elem, webForms) {
	var $elem = $(elem);
	webForms.validity.valid = !webForms.validity.customError;
	$.each(validator, function(e, f) {
		webForms.validity.valid = !(webForms.validity[e] = !f($elem)) &&
			webForms.validity.valid;
	});
}

function getValidationMessage(elem, webForms) {
	var validity = $.extend({}, webForms.validity);
	delete validity.valid;
	
	var message = '';
	$.each(validity, function(e, v) {
		if (v) {
			if (typeof validationMessages[e] == 'string') {
				message += validationMessages[e] + "\n";
			} else if ($.isFunction(validationMessages[e])) {
				message += validationMessages[e](elem) + "\n";
			}
		}
	});
	return $.trim(message);
}

$.extend({
	webForms: {
		beforeValidate: function(elem) {
		},
		
		errorHandler: function(elem) {
		},
		
		validationMessages: function(messages) {
			$.extend(validationMessages, messages);
		}
	},
	
	isDefaultSubmit: function(elem) {
		return elem === $(elem).parents('form:first').find(':submit:first')[0];
	},
	
	isIndeterminate: function(elem) {
		return elem.type == 'radio' && getCheckedCount(elem.name) == 0;
	}
});

$.extend($.expr[':'], {
	checked: 'a.checked || a.selected || jQuery.attr(a, "selected")',
	indeterminate: 'jQuery.isIndeterminate(a)',
	default: 'jQuery.isDefaultSubmit(a) || a.defaultChecked || a.defaultSelected',
	valid: 'jQuery(a).validity().valid',
	invalid: '!jQuery(a).validity().valid',
	'in-range': '!jQuery(a).validity().typeMismatch ' +
		'&& !jQuery(a).validity().rangeUnderflow ' +
		'&& !jQuery(a).validity().rangeOverflow',
	'out-of-range': 'jQuery(a).validity().rangeUnderflow ' +
		'|| jQuery(a).validity().rangeOverflow',
	required: 'jQuery(a).attr("required")',
	optional: '/input|textarea/i.test(a.nodeName) ' +
		'&& !/hidden|image|reset|submit|button/i.test(a.type) ' +
		'&& !jQuery(a).attr("required")',
	'read-only': 'jQuery(a).is("[readonly]")',
	'read-write': '!jQuery(a).is("[readonly]")'
});

$.fn.extend({
	willValidate: function() {
		return this.is(willValidateExpr);
	},
	
	validity: function() {
		if (this.length) {
			return getWebForms(this[0]).validity;
		}
	},
	
	setCustomValidity: function(message) {
		message = message || '';
		var flag = !!message;
		return this.each(function() {
			var webForms = getWebForms(this);
			webForms.customErrorMessage = message;
			webForms.validity.valid = !(webForms.validity.customError = flag);
			for (e in validator) {
				webForms.validity.valid = webForms.validity.valid &&
					!webForms.validity[e];
			}
			$.data(this, 'webForms', webForms);
		});
	},
	
	checkValidity: function() {
		if (this.length) {
			var elem = this[0];
			$.webForms.beforeValidate(elem);
			if ($(elem).is('form')) {
				var valid = true;
				$(willValidateExpr, elem).each(function() {
					valid = $(this).checkValidity() && valid;
				});
				if (!valid) {
					$(':invalid:eq(0)', elem)[0].focus();
				}
				return valid;
			} else {
				var webForms = getWebForms(elem);
				if (webForms.willValidate) {
					validate(elem, webForms);
					if (!webForms.validity.valid) {
						if ($.event.trigger('invalid', null, elem) !== false) {
							$.webForms.errorHandler(elem);
						}
						//$(elem).trigger('invalid');
					}
					return webForms.validity.valid;
				}
			}
		}
	},
	
	validationMessage: function() {
		var message = '';
		if (this.length) {
			var webForms = getWebForms(this[0]);
			if (!webForms.validity.valid) {
				message = getValidationMessage(this[0], webForms);
			}
		}
		return message;
	}
});

})(jQuery);