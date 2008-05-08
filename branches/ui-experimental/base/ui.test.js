;(function($) {
	$.widget('ui.test', $.widget.merge({}, $.ui.color, {
		init: function() {
			console.log('test initialized');
		},
		black: function() {
			this.bg('#000');
		},
		color: {
			color3: function() {
				return '#00f';
			}
		}
	}));
	
	$.ui.test.defaults = {
		color: {
			mainColor: '#f00'
		}
	};
})(jQuery);
