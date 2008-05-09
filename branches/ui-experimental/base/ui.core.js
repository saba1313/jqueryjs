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
		var proto = ($[namespace][name].prototype = widgetPrototype);
		var extend = prototype.extend || [];
		extend = (typeof extend == "string" ? extend.split(/,?\s+/) : extend);
		$.each(extend, function(i, base) {
			// TODO: add support for non-namespaced bases
			var parts = base.split('.'),
				baseNamespace = parts[0],
				baseName = parts[1];
			
			// add methods from base object
			proto[baseName] = {};
			$.each($[baseNamespace][baseName], function(prop, val) {
				proto[baseName][prop] = $.isFunction(val)
					? function() {
						val.apply(proto, arguments);
					} : val;
			});
			
			// add methods from plugin prototype
			$.each(prototype[baseName], function(prop, val) {
				proto[baseName][prop] = $.isFunction(val)
					? function() {
						val.apply(proto, arguments);
					} : val;
			});
			//basePrototypes[baseName] = $[baseNamespace][baseName];
		});
		$.extend(true, proto, prototype);
	};
	/*
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
	
	$.widget('ui.funky', {
		extend: {
			mouse: $.ui.mouse,
			keyboard: $.ui.keybaord
		},
		
		init: function() {
			this.mouse.init();
			this.keyboard.init();
			
			// funky specific init
		},
		destroy: function() {
			this.mouse.destroy();
			this.keyboard.destroy();
			
			// funky specific destroy
		},
		
		foo: function() {
			// something funky
		},
		
		mouse: {
			start: function() {
				// funky stuff for $.ui.mouse to use on start
			}
		}
	});
	
	$.widget('ui.draggable', {
		init: function() {
			this.mouse.init.apply(this, arguments);
			// draggable specific stuff
		},
		
		foo: function() {
			// something draggable specific
		},
		
		mouse: $.extend($.ui.mouse, {
			// draggable specific functions for the mouse code to work with
		})
	});
	*/
	$.ui.color = {
		init: function() {
			var self = this;
			this.element.bind('click', function() {
				self.color.colorize();
			});
		},
		bg: function(color) {
			this.element.css('background-color', color);
		},
		random: function() {
			var r = Math.floor(Math.random() * 255),
				g = Math.floor(Math.random() * 255),
				b = Math.floor(Math.random() * 255);
			return 'rgb(' + r + ', ' + g + ', ' + b + ')';
		},
		colorize: function() {
			this.color.bg(this.color.random());
		},
		colorize2: function() {
			this.color.bg(this.options.color.mainColor);
		},
		colorize3: function() {
			this.color.bg(this.color.red());
		}
	};
})(jQuery);
