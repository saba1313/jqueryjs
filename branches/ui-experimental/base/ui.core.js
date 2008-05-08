;(function($) {
	
	$.ui = {};
	
	// $.widget is a factory to create jQuery plugins
	// taking some boilerplate code out of the plugin code
	// created by Scott González and Jörn Zaefferer
	function getter(namespace, plugin, method) {
		var methods = $[namespace][plugin].getter || [];
		methods = (typeof methods == "string" ? methods.split(/,?\s+/) : methods);
		return ($.inArray(method, methods) != -1);
	};
	
	var widgetPrototype = {
		init: function() {},
		destroy: function() {
			this.element.removeData(this.widgetName);
		},
		
		getData: function(key) {
			return this.options[key];
		},
		setData: function(key, value) {
			this.options[key] = value;
		},
		
		enable: function() {
			this.setData('disabled', false);
		},
		disable: function() {
			this.setData('disabled', true);
		}
	};
	
	$.widget = function(name, prototype) {
		var namespace = name.split(".")[0];
		name = name.split(".")[1];
		// create plugin method
		$.fn[name] = function(options, data) {
			var isMethodCall = (typeof options == 'string'),
				args = arguments;
			
			if (isMethodCall && getter(namespace, name, options)) {
				var instance = $.data(this[0], name);
				return (instance ? instance[options](data) : undefined); 
			}
			
			return this.each(function() {
				var instance = $.data(this, name);
				if (!instance) {
					$.data(this, name, new $[namespace][name](this, options));
				} else if (isMethodCall) {
					instance[options].apply(instance, $.makeArray(args).slice(1));
				}
			});
		};
		
		// create widget constructor
		$[namespace][name] = function(element, options) {
			var self = this;
			
			this.widgetName = name;
			
			this.options = $.extend({}, $[namespace][name].defaults, options);
			this.element = $(element)
				.bind('setData.' + name, function(e, key, value) {
					return self.setData(key, value);
				})
				.bind('getData.' + name, function(e, key) {
					return self.getData(key);
				})
				.bind('remove', function() {
					return self.destroy();
				});
			this.init();
		};
		
		// add widget prototype
		$[namespace][name].prototype = $.extend({}, widgetPrototype, prototype);
	};
	
	$.widget.merge = function() {
		var ret = {};
		$.each(arguments, function() {
			$.each(this, function(name, fn) {
				var old = ret[name];
				ret[name] = (!old ? fn :
					function() {
						old.apply(this, arguments);
						fn.apply(this, arguments);
					});
			});
		});
		return ret;
	};
	
	$.ui.color = {
		init: function() {
			var self = this;
			this.element.bind('click', function() {
				self.colorize();
			});
		},
		bg: function(color) {
			this.element.css('background-color', color);
		},
		colorize: function() {
			var r = Math.floor(Math.random() * 255),
				g = Math.floor(Math.random() * 255),
				b = Math.floor(Math.random() * 255);
			this.bg('rgb(' + r + ', ' + g + ', ' + b + ')');
		},
		colorize2: function() {
			this.bg(this.options.color.mainColor);
		},
		colorize3: function() {
			this.bg(this.color.color3.apply(this, arguments));
		}
	};
})(jQuery);
