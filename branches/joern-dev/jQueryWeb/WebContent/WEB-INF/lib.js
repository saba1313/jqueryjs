function print() {
	java.lang.System.out.println($.makeArray(arguments).join(", "));
}

jQuery.fn.extend({
	contextPath: function(attr, prefix) {
		return this.attr(attr, function() { return request.contextPath + this[attr].replace(prefix, "") });
	},
	print: function(doctype) {
		doctype = doctype || "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">";
		return doctype
		 + "\n"
		 + this[0].innerHTML;
	},
	template: function(list, handler) {
		var template = this.remove();
		list.forEach(function() {
			handler.apply(template.clone(), arguments);
		});
	},
	list: function(list, separator, handler) {
		var result = [];
		list.forEach(function(entry, index) {
			result.push( handler(entry, index) );
		});
		return this.html( result.join(separator) );
	},
	validate: function() {
	
	}
});

String.format = function(source, params) {
	if ( arguments.length == 1 ) 
		return function() {
			var args = jQuery.makeArray(arguments);
			args.unshift(source)
			return String.format.apply( this, args );
		};
	if ( arguments.length > 2 && params.constructor != Array  ) {
		params = jQuery.makeArray(arguments).slice(1);
	}
	if ( params.constructor != Array ) {
		params = [ params ];
	}
	jQuery.each(params, function(i, n) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
	});
	return source;
};

var DateFormat = (function() {
	// store dateformats in a closure
	var dateformat = new java.text.SimpleDateFormat("dd. MMMM yyyy");
	var timeformat = new java.text.SimpleDateFormat("HH:mm");
	// expose formatting methods
	return {
		date: function(value) {
			return "" + dateformat.format(value);
		},
		datetime: function(value) {
			return String.format("{0} um {1}",
				dateformat.format(value),
				timeformat.format(value));
		}
	};
})();
