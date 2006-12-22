/**
 * @author paul.bakaus
 */
$(document).ready(function() {
	$("#bottombar ul li").hover(function() {
		$("img.pfeil", this).animate({ width: 10, marginLeft: -5, height: 54, top: -69 }, 1000);
		$("div.carousel", this).animate({ height: 140, top: -140, opacity: 'show' }, 1000);
		
	}, function() {
		$("img.pfeil", this).animate({ width: 46, marginLeft: -24, height: 24, top: -39, opacity: 'hide' }, 1000);
		$("div.carousel", this).animate({ height: 1, top: -40, opacity: 'hide' }, 1000);
	});
	
	$("#bottombar ul li a").click(function() {
		$(this).TransferTo({
    		duration: 500,
    		to: 'content', 
    		className: 'transferIndicator'
		});
	});
	$("div.carousel a img").hover(function() {
		$(this).attr("src", "images/"+$(this).attr("rel")+"_h.png");
	}, function() {
		$(this).attr("src", "images/"+$(this).attr("rel")+".png");
	});
	
	/* Style the content via js */
	//$("#content").css("border", "2px solid #fff").css("position", "absolute").
	//css("top", "10px").css("left", "10px").css("width", $(window).width()-4-20+"px").
	//css("height", $(window).height()-4-20+"px");
});

$(window).bind("load", function() {

	$('div.carousel').Carousel(
		{
			itemWidth: 130,
			itemHeight: 50,
			itemMinWidth: 50,
			items: 'a',
			reflections: .5,
			rotationSpeed: 1.8
		}
	);
			
})