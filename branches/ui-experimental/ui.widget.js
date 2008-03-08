// $.widget is factory to create jQuery plugins, taking some boilerplate code out of the plugin code
// this file contains the accordion plugin as an example implementation

;(function($) {
	
$.widget = function(namespace, name, prototype) {
	// build qualified name as namepsace-name, eg. ui-dialog
	var qname = namespace + "-" + name;
	// create namespace if necessary
	if (!$[namespace]) {
		$[namespace] = {};
	}
	// create plugin method
	$.fn[name] = function(options, data) {
		var args = Array.prototype.slice.call(arguments, 1);

		return this.each(function() {
			// call method
			if (typeof options == "string") {
				var widget = $.data(this, qname);
				widget[options].apply(widget, args);
			// or init widget
			} else if (!$(this).is("." + qname)) {
				// add qualified name as class to check init state
				$(this).addClass(qname);
				// init widget constructor and store in element
				$.data(this, qname, new $[namespace][name](this, options));
			}
		});
	}
	// create wiget constructor
	$[namespace][name] = function(element, options) {
		// setup configuration
		this.options = options = $.extend({}, $[namespace][name].defaults, options);
		this.element = element;
		this.init(options);
	}
	// add widget prototype, must at least contain init(options)
	$[namespace][name].prototype = prototype || {};
};

$.widget("ui", "accordion", {
	init: function(options) {
		if ( options.navigation ) {
			var current = $(this.element).find("a").filter(options.navigationFilter);
			if ( current.length ) {
				if ( current.filter(options.header).length ) {
					options.active = current;
				} else {
					options.active = current.parent().parent().prev();
					current.addClass("current");
				}
			}
		}
		
		// calculate active if not specified, using the first header
		options.headers = $(this.element).find(options.header);
		options.active = findActive(options.headers, options.active);
	
		if ( options.fillSpace ) {
			var maxHeight = $(this.element).parent().height();
			options.headers.each(function() {
				maxHeight -= $(this).outerHeight();
			});
			var maxPadding = 0;
			options.headers.next().each(function() {
				maxPadding = Math.max(maxPadding, $(this).innerHeight() - $(this).height());
			}).height(maxHeight - maxPadding);
		} else if ( options.autoheight ) {
			var maxHeight = 0;
			options.headers.next().each(function() {
				maxHeight = Math.max(maxHeight, $(this).outerHeight());
			}).height(maxHeight);
		}
	
		options.headers
			.not(options.active || "")
			.next()
			.hide();
		options.active.parent().andSelf().addClass(options.selectedClass);
		
		if (options.event)
			$(this.element).bind((options.event || "") + ".ui-accordion", clickHandler);
	},
	
	activate: function(index) {
		// call clickHandler with custom event
		clickHandler.call(this.element, {
			target: findActive( this.options.headers, index )[0]
		});
	},
	
	enable: function() {
		this.options.disabled = false;
	},
	disable: function() {
		this.options.disabled = true;
	},
	destroy: function() {
		this.options.headers.next().css("display", "");
		if ( this.options.fillSpace || this.options.autoheight ) {
			this.options.headers.next().css("height", "");
		}
		$.removeData(this.element, "ui-accordion");
		$(this.element).unbind(".ui-accordion");
	}
});

$.ui.accordion.defaults = {
	selectedClass: "selected",
	alwaysOpen: true,
	animated: 'slide',
	event: "click",
	header: "a",
	autoheight: true,
	running: 0,
	navigationFilter: function() {
		return this.href.toLowerCase() == location.href.toLowerCase();
	}
}; 

$.ui.accordion.animations = {
	slide: function(options, additions) {
		options = $.extend({
			easing: "swing",
			duration: 300
		}, options, additions);
		if ( !options.toHide.size() ) {
			options.toShow.animate({height: "show"}, options);
			return;
		}
		var hideHeight = options.toHide.height(),
			showHeight = options.toShow.height(),
			difference = showHeight / hideHeight;
		options.toShow.css({ height: 0, overflow: 'hidden' }).show();
		options.toHide.filter(":hidden").each(options.complete).end().filter(":visible").animate({height:"hide"},{
			step: function(now) {
				var current = (hideHeight - now) * difference;
				if ($.browser.msie || $.browser.opera) {
					current = Math.ceil(current);
				}
				options.toShow.height( current );
			},
			duration: options.duration,
			easing: options.easing,
			complete: function() {
				if ( !options.autoheight ) {
					options.toShow.css("height", "auto");
				}
				options.complete();
			}
		});
	},
	bounceslide: function(options) {
		this.slide(options, {
			easing: options.down ? "bounceout" : "swing",
			duration: options.down ? 1000 : 200
		});
	},
	easeslide: function(options) {
		this.slide(options, {
			easing: "easeinout",
			duration: 700
		})
	}
};


function scopeCallback(callback, scope) {
	return function() {
		return callback.apply(scope, arguments);
	};
}

function completed(cancel) {
	// if removed while animated data can be empty
	if (!$.data(this, "ui-accordion"))
		return;
	var options = $.data(this, "ui-accordion").options;
	options.running = cancel ? 0 : --options.running;
	if ( options.running )
		return;
	if ( options.clearStyle ) {
		options.toShow.add(options.toHide).css({
			height: "",
			overflow: ""
		});
	}
	$(this).trigger("changed.ui-accordion", options.data);
}

function toggle(toShow, toHide, data, clickedActive, down) {
	var options = $.data(this, "ui-accordion").options;
	options.toShow = toShow;
	options.toHide = toHide;
	options.data = data;
	var complete = scopeCallback(completed, this);
	
	// count elements to animate
	options.running = toHide.size() == 0 ? toShow.size() : toHide.size();
	
	if ( options.animated ) {
		if ( !options.alwaysOpen && clickedActive ) {
			$.ui.accordion.animations[options.animated]({
				toShow: jQuery([]),
				toHide: toHide,
				complete: complete,
				down: down,
				autoheight: options.autoheight
			});
		} else {
			$.ui.accordion.animations[options.animated]({
				toShow: toShow,
				toHide: toHide,
				complete: complete,
				down: down,
				autoheight: options.autoheight
			});
		}
	} else {
		if ( !options.alwaysOpen && clickedActive ) {
			toShow.toggle();
		} else {
			toHide.hide();
			toShow.show();
		}
		complete(true);
	}
}

function clickHandler(event) {
	var options = $.data(this, "ui-accordion").options;
	if (options.disabled)
		return false;
	
	// called only when using activate(false) to close all parts programmatically
	if ( !event.target && !options.alwaysOpen ) {
		options.active.parent().andSelf().toggleClass(options.selectedClass);
		var toHide = options.active.next();
		var toShow = options.active = $([]);
		toggle.call(this, toShow, toHide );
		return false;
	}
	// get the click target
	var clicked = $(event.target);
	
	// due to the event delegation model, we have to check if one
	// of the parent elements is our actual header, and find that
	if ( clicked.parents(options.header).length )
		while ( !clicked.is(options.header) )
			clicked = clicked.parent();
	
	var clickedActive = clicked[0] == options.active[0];
	
	// if animations are still active, or the active header is the target, ignore click
	if (options.running || (options.alwaysOpen && clickedActive))
		return false;
	if (!clicked.is(options.header))
		return;

	// switch classes
	options.active.parent().andSelf().toggleClass(options.selectedClass);
	if ( !clickedActive ) {
		clicked.parent().andSelf().addClass(options.selectedClass);
	}

	// find elements to show and hide
	var toShow = clicked.next(),
		toHide = options.active.next(),
		data = [clicked, options.active, toShow, toHide],
		down = options.headers.index( options.active[0] ) > options.headers.index( clicked[0] );
	
	options.active = clickedActive ? $([]) : clicked;
	toggle.call(this, toShow, toHide, data, clickedActive, down );

	return false;
};

function findActive(headers, selector) {
	return selector != undefined
		? typeof selector == "number"
			? headers.filter(":eq(" + selector + ")")
			: headers.not(headers.not(selector))
		: selector === false
			? $([])
			: headers.filter(":eq(0)");
}

})(jQuery);
