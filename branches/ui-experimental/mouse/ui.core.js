/*
 * jQuery UI @VERSION
 *
 * Copyright (c) 2008 Paul Bakaus (ui.jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI
 *
 * $Id: ui.core.js 5587 2008-05-13 19:56:42Z scott.gonzalez $
 */
;(function($) {
	
	$.ui = {
		plugin: {
			add: function(module, option, set) {
				var proto = $.ui[module].prototype;
				for(var i in set) {
					proto.plugins[i] = proto.plugins[i] || [];
					proto.plugins[i].push([option, set[i]]);
				}
			},
			call: function(instance, name, args) {
				var set = instance.plugins[name];
				if(!set) { return; }
				
				for (var i = 0; i < set.length; i++) {
					if (instance.options[set[i][0]]) {
						set[i][1].apply(instance.element, args);
					}
				}
			}	
		},
		cssCache: {},
		css: function(name) {
			if ($.ui.cssCache[name]) { return $.ui.cssCache[name]; }
			var tmp = $('<div class="ui-resizable-gen">').addClass(name).css({position:'absolute', top:'-5000px', left:'-5000px', display:'block'}).appendTo('body');
			
			//if (!$.browser.safari)
				//tmp.appendTo('body'); 
			
			//Opera and Safari set width and height to 0px instead of auto
			//Safari returns rgba(0,0,0,0) when bgcolor is not set
			$.ui.cssCache[name] = !!(
				(!(/auto|default/).test(tmp.css('cursor')) || (/^[1-9]/).test(tmp.css('height')) || (/^[1-9]/).test(tmp.css('width')) || 
				!(/none/).test(tmp.css('backgroundImage')) || !(/transparent|rgba\(0, 0, 0, 0\)/).test(tmp.css('backgroundColor')))
			);
			try { $('body').get(0).removeChild(tmp.get(0));	} catch(e){}
			return $.ui.cssCache[name];
		},
		disableSelection: function(e) {
			e.unselectable = "on";
			e.onselectstart = function() { return false; };
			if (e.style) { e.style.MozUserSelect = "none"; }
		},
		enableSelection: function(e) {
			e.unselectable = "off";
			e.onselectstart = function() { return true; };
			if (e.style) { e.style.MozUserSelect = ""; }
		},
		hasScroll: function(e, a) {
			var scroll = /top/.test(a||"top") ? 'scrollTop' : 'scrollLeft', has = false;
			if (e[scroll] > 0) return true; e[scroll] = 1;
			has = e[scroll] > 0 ? true : false; e[scroll] = 0;
			return has;
		}
	};
	
	
	/** jQuery core modifications and additions **/
	
	var _remove = $.fn.remove;
	$.fn.remove = function() {
		$("*", this).add(this).trigger("remove");
		return _remove.apply(this, arguments );
	};
	
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
			var isMethodCall = (typeof options == 'string');
			[].shift.call(arguments);
			
			if (isMethodCall && getter(namespace, name, options)) {
				var instance = $.data(this[0], name);
				return (instance ? instance[options].apply(instance, arguments)
					: undefined);
			}
			
			return this.each(function() {
				var instance = $.data(this, name);
				if (!instance) {
					$.data(this, name, new $[namespace][name](this, options));
				} else if (isMethodCall) {
					instance[options].apply(instance, arguments);
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
	
	
	/** Mouse Interaction Plugin **/
	
	// TODO: should events be in the mouse namespace or the plugin's namespace?
	$.ui.mouse = {
		mouseInit: function() {
			var self = this;
			
			this.element
				.bind('mousedown.mouse', function() {
					return self.mouseClick.apply(self, arguments);
				})
				.bind('mouseup.mouse', function() {
					(self.mouseTimer && clearTimeout(self.mouseTimer));
				})
				.bind('click.mouse', function() {
					if (self.mouseInitialized) {
						self.mouseInitialized = false;
						return false;
					}
				});
			
			// Prevent text selection in IE
			if ($.browser.msie) {
				this.mouseUnselectable = this.element.attr('unselectable');
				this.element.attr('unselectable', 'on');
			}
		},
		
		mouseDestroy: function() {
			this.element.unbind('.mouse');
			
			// Restore text selection in IE
			($.browser.msie
				&& this.element.attr('unselectable', this.mouseUnselectable));
		},
		
		// TODO: does this belong here?
		trigger: function() {
			return this.mouseClick.apply(this, arguments);
		},
		
		mouseClick: function(e) {
			// TODO: fix name of mouseCondition option
			var self = this;
			
			// bail if any of the following conditions are met:
			// - not left click
			// - node type is defined in mouseDragPrevention option
			// - mouseCondition option returns false
			if (e.which != 1
				|| ($.inArray(e.target.nodeName.toLowerCase(),
					this.options.mouseDragPrevention || []) != -1)
				|| (this.options.mouseCondition &&
					!this.options.mouseCondition.apply(this, [e, this.element]))
			) { return true; }
			
			this.mouseInitialized = false;
			var initialize = function() {
				// Store the click mouse position
				self._MP = { left: e.pageX, top: e.pageY };
				
				$(document)
					.bind('mouseup.mouse', function() {
						return self.mouseStop.apply(self, arguments);
					})
					.bind('mousemove.mouse', function() {
						return self.mouseDrag.apply(self, arguments);
					});
				
				var distance = Math.max(
					Math.abs(self._MP.left - e.pageX),
					Math.abs(self._MP.top - e.pageY));
				if (!self.mouseInitalized && (distance > self.options.mouseDistance)) {
					(self.options.mouseStart
						&& self.options.mouseStart.call(self, e, self.element));
					// Calling drag is actually not correct, but expected
					(self.options.mouseDrag
						&& self.options.mouseDrag.call(self, e, self.element));
					
					self.mouseInitialized = true;
				}
			};
			
			if (this.options.mouseDelay) {
				(this.mouseTimer && clearTimeout(this.mouseTimer));
				this.mouseTimer = setTimeout(initialize, this.options.mouseDelay);
			} else {
				initialize();
			}
			
			return false;
		},
		
		mouseStop: function(e) {
			if (!this.mouseInitialized) {
				return $(document).unbind('.mouse');
			}
			
			(this.options.mouseStop
				&& this.options.mouseStop.call(this, e, this.element));
			
			$(document).unbind('.mouse');
			return false;
		},
		
		mouseDrag: function(e) {
			var o = this.options;
			
			// IE mouseup check
			if ($.browser.msie && !e.button) {
				return this.mouseStop.call(this, e);
			}
			
			var distance = Math.max(
				Math.abs(self._MP.left - e.pageX),
				Math.abs(self._MP.top - e.pageY));
			if (!this.mouseInitialized && (distance > o.distance)) {
				(o.mouseStart && o.mouseStart.call(this, e, this.element));
				this.mouseInitialized = true;
			} else {
				if (!this.mouseInitialized) { return false; }
			}
			
			(o.mouseDrag && o.mouseDrag.call(this, e, this.element));
			return false;
		}
	};
})(jQuery);
