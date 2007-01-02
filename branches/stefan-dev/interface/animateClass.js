/**
 * Interface Elements for jQuery
 * FX
 * 
 * http://interface.eyecon.ro
 * 
 * Copyright (c) 2006 Stefan Petre, Paul Bakaus
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *   
 *
 */
 
/**
 * @author Paul Bakaus
 */
 
jQuery.fn.animateClass = function(c1,c2,c3) {
	var colorIntervals = [];
	var colorTimers = [];
	
	return jQuery(this).each(function(){

		/* If the new class is already set, return */
		for(var i=0;i<this.className.split(" ").length;i++)
		{ if(this.className.split(" ")[i] == c1) return; }
			
		var aniObj = {};
		var aniDuration = c3 || c2 || 400;
		
		if (c3) {
			$(this).addClass(c1);
		}
		var oldStyles = [];
		var oldColors = [];
		
		var currentStyle = document.defaultView ? document.defaultView.getComputedStyle(this,null) :  this.currentStyle;
		
		for (var i=0; i<jQuery.fx.animatedCssRules.length; i++) {
			if (currentStyle[jQuery.fx.animatedCssRules[i]])
				oldStyles[i] = parseInt(currentStyle[jQuery.fx.animatedCssRules[i]]) || 0;
		}
		for (var i=0; i<jQuery.fx.animatedColorsCssRules.length; i++) {
			if (currentStyle[jQuery.fx.animatedColorsCssRules[i]])
				oldColors[i] = currentStyle[jQuery.fx.animatedColorsCssRules[i]];
		}
		
		if (c3) {
			$(this).addClass(c2);
		} else {
			$(this).addClass(c1);
		}
		toAnimate = {};
		toColors = {};
		var currentStyle = document.defaultView ? document.defaultView.getComputedStyle(this,null) :  this.currentStyle;
		for (var i=0; i<jQuery.fx.animatedCssRules.length; i++) {
			if (currentStyle[jQuery.fx.animatedCssRules[i]]) {
				newStyle = parseInt(currentStyle[jQuery.fx.animatedCssRules[i]]) || 0;
				if (newStyle != oldStyles[i]) {
					toAnimate[jQuery.fx.animatedCssRules[i]] = newStyle;
				}
			}
		}
		for (var i=0; i<jQuery.fx.animatedColorsCssRules.length; i++) {
			if (currentStyle[jQuery.fx.animatedColorsCssRules[i]] && currentStyle[jQuery.fx.animatedColorsCssRules[i]] != oldColors[i]) {
				toColors[jQuery.fx.animatedColorsCssRules[i]] = [oldColors[i],currentStyle[jQuery.fx.animatedColorsCssRules[i]]];
			}
		}
		if (c3) {
			$(this).removeClass(c2);
		} else {
			$(this).removeClass(c1);
		}
		$(this).animate(toAnimate,aniDuration );
		colorNimations = {};
		for(i in toColors) {
			colorNimations[i] = new jQuery.fx.animateColor(this, aniDuration, toColors[i], i);
		}
		return
	});
}
jQuery.fx.animatedCssRules = [
	'borderBottomWidth',
	'borderLeftWidth',
	'borderRightWidth',
	'borderTopWidth',
	'bottom',
	'fontSize',
	'height',
	'left',
	'letterSpacing',
	'lineHeight',
	'marginBottom',
	'marginLeft',
	'marginRight',
	'marginTop',
	'maxHeight',
	'maxWidth',
	'minHeight',
	'minWidth',
	'opacity',
	'outlineOffset',
	'outlineWidth',
	'paddingBottom',
	'paddingLeft',
	'paddingRight',
	'paddingTop',
	'right',
	'textIndent',
	'top',
    'width',
	'zIndex'
];
jQuery.fx.animatedColorsCssRules = [
	'backgroundColor',
	'borderBottomColor',
	'borderLeftColor',
	'borderRightColor',
	'borderTopColor',
	'color',
	'outlineColor'
];

jQuery.fx.animateColor = function (e, duration, color, property, callback, transition)
{
	/*if (!jQuery.fxCheckTag(e) || !color) {
		jQuery.dequeue(e, 'interfaceFX');
		return false;
	}*/
	var z = this;
	z.transition = transition||'original';
	z.duration = jQuery.speed(duration).duration;
	z.callback = callback;
	z.property = property;
	z.el = jQuery(e);
	z.endColor = jQuery.fx.parseColor(color[1]);
	z.startColor = jQuery.fx.parseColor(color[0]);
	
	if (!z.endColor || !z.startColor) {
		return false;
	}
	console.log(property);
	
	z.t=(new Date).getTime();
	z.clear = function(){clearInterval(z.timer);z.timer=null;};
	z.step = function(){
		var t = (new Date).getTime();
		var n = t - z.t;
		var p = n / z.duration;
		if (t >= z.duration+z.t) {
			setTimeout(
				function(){
					if (z.callback && typeof z.callback == 'function') {
						z.callback.apply(z.el.get(0));
					}
				},
				13
			);
			z.clear();
		} else {
			o = 1;
			s = jQuery.fx.transitions(p, n, z.from, (z.to-z.from), z.duration, z.transition);
			newColor = {
				r: parseInt(jQuery.fx.transitions(p, n, z.startColor.r, (z.endColor.r-z.startColor.r), z.duration, z.transition)),
				g: parseInt(jQuery.fx.transitions(p, n, z.startColor.g, (z.endColor.g-z.startColor.g), z.duration, z.transition)),
				b: parseInt(jQuery.fx.transitions(p, n, z.startColor.b, (z.endColor.b-z.startColor.b), z.duration, z.transition))
			};
			z.el.css(z.property, 'rgb(' + newColor.r + ',' + newColor.g + ',' + newColor.b + ')');
		}
	};
	z.timer=setInterval(function(){z.step();},13);

};