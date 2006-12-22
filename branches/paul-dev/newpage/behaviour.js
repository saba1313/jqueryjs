/**
 * @author paul.bakaus
 */
$(document).ready(function() {
	$("#bottombar ul li").hover(function() {
		$("img.pfeil", this).animate({ width: 10, marginLeft: -5, height: 71, top: -85 }, 1000);
		$("div.carousel", this).animate({ height: 140, top: -140, opacity: 'show' }, 1000);
		
	}, function() {
		$("img.pfeil", this).animate({ width: 47, marginLeft: -24, height: 31, top: -45, opacity: 'hide' }, 1000);
		$("div.carousel", this).animate({ height: 1, top: -40, opacity: 'hide' }, 1000);
	});

});

$(window).bind("load", function() {

	$('div.carousel').Carousel(
		{
			itemWidth: 100,
			itemHeight: 62,
			itemMinWidth: 50,
			items: 'a',
			reflections: .5,
			rotationSpeed: 1.8
		}
	);
			
})