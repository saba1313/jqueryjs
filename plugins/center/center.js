/**
 * Takes all matched elements and centers them, absolutely, 
 * within the context of their parent element. Great for 
 * doing slideshows.
 *
 * @example $("div img").center();
 * @name center
 * @type jQuery
 */
$.fn.center = function(f) {
	return this.each(function(){
		var p = this.parentNode;
		if ( $.css(p,"position") == 'static' )
			p.style.position = 'relative';

		var s = this.style;
		s.position = 'absolute';
		s.left = ((parseInt($.css(p,"width")) - parseInt($.css(this,"width")))/2) + "px";
		s.top = ((parseInt($.css(p,"height")) - parseInt($.css(this,"height")))/2) + "px";
	});
};
