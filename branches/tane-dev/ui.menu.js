/* jQuery UI Menu
 * 
 * m = menu being passed in
 * h = handler types
 * d = display effect
 * o = options
 * f = trigger functions
 */

(function($){
	
	$.fn.menu = function(m, h, d, o, f) {
		return this.each(function() {
			new $.ui.menu(this, m, h, d, o, f);	
		});
	}
	
	
	$.ui.menu = function(el, m, h, d, o, f) {
		// Keys for possible alt functionality
		var ALT = false;
		var CTRL = false;
		var SHIFT = false;
			
		var attach = el;
		var menu = m;
		var handler = h;
		var display = d;
		var functions = f;
		
		var options = {};
		$.extend(options, o);
		$.extend(options, {
		
		});
		
		$(attach).bind(handler, function(){
			$(menu).toggle();
		})
		
	};
	
	
})($);