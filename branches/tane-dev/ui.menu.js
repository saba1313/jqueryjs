/* jQuery UI Menu
 * 
 * m = menu being passed in
 * o = options
 * t = trigger functions
 */

(function($){
	
	var menuItems = [];	// This is the array we will store the menu items in
	
	$.fn.clickContext = function(m,o,t) {	// Constructor for the clickContext method
		return this.each(function() {
			new $.ui.clickContext(this, m, o, t);	
		});
	}
	$.fn.hoverContext = function(m,o,t) {	// Constructor for the hoverContext method
		return this.each(function() {
			new $.ui.hoverContext(this, m, o, t);	
		});
	}
	$.fn.context = function(m,o,t) {	// Constructor for the context method
		return this.each(function() {
			new $.ui.context(this, m, o, t);	
		});
	}
	$.fn.hideContext = function(m,o,t) {	// Constructor for the closeContext method
		return this.each(function() {
			new $.ui.hideContext(this, m, o, t);	
		});
	}
	
	
	$.ui.clickContext = function(el, m, o, t) {
		// Keys for possible alt functionality
		var ALT = false;
		var CTRL = false;
		var SHIFT = false;
		
		var self = el;
		
		$(self).bind('click', function(){
			$(m).slideDown('slow', function(){
				$(self).unbind('click').bind('click', function(){
					$(m).slideUp('slow').unbind('click');
				});
			});
		});
			
	}
	$.ui.hoverContext = function(el, m, o, t) {
		// Keys for possible alt functionality
		var ALT = false;
		var CTRL = false;
		var SHIFT = false;
		
		var self = el;
		
		$(self).bind('mouseover', function(){
			$(m).slideDown('slow', function(){
				$(self).bind('mouseout', function(){
					$(m).slideUp('slow');
				});
			});
		});
			
	}
	$.ui.context = function(el, m, o, t) {
		// Keys for possible alt functionality
		var ALT = false;
		var CTRL = false;
		var SHIFT = false;
			
	}
	$.ui.hideContext = function(el, m, o, t) {
			
	}
	
	
})($);