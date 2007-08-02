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
	$.fn.hideContext = function(m,o,t) {	// Constructor for the hideContext method
		return this.each(function() {
			new $.ui.hideContext(this, m, o, t);	
		});
	}
	
	
	$.ui.clickContext = function(el, m, o, t) {
		// Keys for possible alt functionality
		var ALT = false;
		var CTRL = false;
		var SHIFT = false;
		effect = 'click';
		menuItems.push(m);
		$(m).addClass('ui-toolbar-menu');
		$(el).bind(effect, function(){
			x = $(el).position();
			elBottom = x.top + $(el).height();
			elLeft = x.left;
			console.log(menuItems);
			console.log(x);
			console.log(elBottom + ',' + elLeft);
			$(m).css({position:'absolute', top:elBottom + 1, left: elLeft})
			$(m).show('slow', function(){
				$(this).unbind(effect).hideContext(effect);
			});
		});			
	}
	$.ui.hoverContext = function(el, m, o, t) {
		// Keys for possible alt functionality
		var ALT = false;
		var CTRL = false;
		var SHIFT = false;
		effect = 'mouseover';
		menuItems.push(m);
		$(m).addClass('ui-toolbar-menu');
		$(el).bind(effect, function(){
			x = $(el).position();
			elBottom = x.top + $(el).height();
			elLeft = x.left;
			console.log(menuItems);
			console.log(x);
			console.log(elBottom + ',' + elLeft);
			$(m).css({position:'absolute', top:elBottom + 1, left: elLeft})
			$(m).show('slow', function(){
				$(this).unbind(effect).hideContext(effect);
			});
		});			
			
	}
	$.ui.context = function(el, m, o, t) {
		// Keys for possible alt functionality
		var ALT = false;
		var CTRL = false;
		var SHIFT = false;
			
	}
	$.ui.hideContext = function(el, ef) {
			$(window).unbind(ef).bind(ef,function(){
				$(el).hide('fast');
			});
	}	
})($);