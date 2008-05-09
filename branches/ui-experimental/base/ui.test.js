;(function($) {
	$.widget('ui.test', {
		extend: 'ui.color',
		
		init: function() {
			this.color.init();
		},
		black: function() {
			this.bg('#000');
		},
		color: {
			red: function() {
				return '#f00';
			}
		}
	});
	
	$.ui.test.defaults = {
		color: {
			mainColor: '#00f'
		}
	};
})(jQuery);
