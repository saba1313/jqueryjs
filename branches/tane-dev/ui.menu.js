/* jQuery UI Menu */

(function($){
	
	$.fn.menu = function(o) {
		return this.each(function() {
			new $.ui.menu(this,o);	
		});
	}
	
	$.ui.menu = function(el,o) {
		// Keys for alt functionality
		var ALT = false;
		var CTRL = false;
		var SHIFT = false;
		
		var menu = el;
		// Add classes to elements  - Currently only does one level of adding classes
		$(menu).addClass('ui-menu-nodes').children('li').addClass('ui-menu-node').children('ul').addClass('ui-menu-subnodes').children('li').addClass('ui-menu-node');
	}
	
})($);