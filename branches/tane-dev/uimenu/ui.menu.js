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
		var options  = {};
		$.extend(options, o);
		$.extend(options, {
			timeout: 2000,
			bindto: 'click'
		});
		var ALT = false;
		var CTRL = false;
		var SHIFT = false;

		menuItems.push(m);
		$(m).addClass('ui-toolbar-menu');
		$(el).bind(options.bindto, function(){
			x = $(el).position();
			elBottom = x.top + $(el).height();
			elLeft = x.left;
			$(m).css({position:'absolute', top:elBottom + 1, left: elLeft})
			$(m).show('slow', function(){
				console.log('Menu Shown')
			});
		});			
	}
	$.ui.hoverContext = function(el, m, o, t) {
		var options  = {};
		$.extend(options, o);
		$.extend(options, {
			timeout: 2000,
			bindto: 'mouseover'
		});
		var ALT = false;
		var CTRL = false;
		var SHIFT = false;

		menuItems.push(m);
		$(m).addClass('ui-toolbar-menu');
		$(el).bind(options.bindto, function(){
			x = $(el).position();
			elBottom = x.top + $(el).height();
			elLeft = x.left;
			$(m).css({position:'absolute', top:elBottom + 1, left: elLeft})
			$(m).show('slow', function(){
				console.log('Menu Shown')
			});
		});				
	}
	$.ui.context = function(el, m, o, t) {
		var options  = {};
		$.extend(options, o);
		$.extend(options, {
			timeout: 2000,
			bindto: 'click'
		});
		var ALT = false;
		var CTRL = false;
		var SHIFT = false;

		menuItems.push(m);
		$(m).addClass('ui-toolbar-menu');
		$(el).bind(options.bindto, function(e){
			console.log(e);
			if (e.button == 0 || e.button == 2 || e.button == 3) {
				self.opos = $.ui.getPointer(e);
				$(m).css({position:'absolute', top:self.opos[1], left: self.opos[0]})
				$(m).show('slow', function(){
					console.log('Menu Shown')
				});
			}
		});	
	}
	$.ui.hideContext = function(el, ef) {
			$(window).unbind(ef).bind(ef,function(){
				$(el).hide('fast');
			});
	}
})($);