(function($){

// if the UI scope is not availalable, add it
    $.ui = $.ui || {};

// Extend jQuery..
    $.fn.extend({

        toolbar: function(){
            var args = Array.prototype.slice.call(arguments, 1);

			return this.each(function() {
				if (typeof options == "string") {
					var toolbar = $.data(this, "ui-toolbar");
					if(toolbar) toolbar[options].apply(toolbar, args);

				} else if(!$.data(this, "ui-toolbar"))
					new $.ui.toolbar(this, options);
			});

        }
    }),

    $.ui.toolbar = function(element, options){
        //Initialize needed constants
		var self = this;

		this.element = $(element);

        $.data(element, "ui-toolbar", this);
		this.element.addClass("ui-toolbar");

        //Prepare the passed options
		this.options = $.extend({}, options);

        
    }
})(jQuery);
