/* jQuery UI Menu
 * 
 * m = menu being passed in
 * o = options
 * t = trigger functions
 */

(function($){
	
	var menuItems = [];	// This is the array we will store the menu items in
	
	$.fn.menu = function(m,o,t) {	// Constructor for the clickContext method
		return this.each(function() {
			new $.ui.menu(this, m, o, t);	
		});
	}	
	
	$.ui.menu = function(el, m, o, t) {
		var attach = el;
		var menu = m;
		var shown = false;
		
		var options = $.extend({
			timeout: 2000,
			bindto: 'click'
		}, o);
		var buttons = $.extend({}, t);

		var ALT = false;
		var CTRL = false;
		var SHIFT = false;
		
		this.styleMenu(menu);
		
		$(attach).bind(options.bindto, function(){
			x = $(attach).position();
			elBottom = x.top + $(attach).height();
			elLeft = x.left;
			$(m).css({position:'absolute', top:elBottom + 1, left: elLeft})
			$(m).show('slow', function(){
				console.log('Menu Shown')
			});
		});
	}
	
	$.extend($.ui.menu.prototype, {
		styleMenu : function(m){
			
			$(m).addClass('ui-menu-nodes').children('li').addClass('ui-menu-node');
			var nodes = $('ul',m).addClass('ui-menu-nodes')
				.css('MozUserSelect', 'none').attr('unselectable', 'on');
			var node = $('li',m).addClass('ui-menu-node')
				.css('MozUserSelect', 'none').attr('unselectable', 'on');
			return false;
		}
		
	});
})($);