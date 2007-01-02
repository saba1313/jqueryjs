/**
 * Interface Elements for jQuery
 * FX
 * 
 * http://interface.eyecon.ro
 * 
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *   
 *
 */

//overwrite jQuery's default fx function with the new one to support diferent transitions
/*jQuery.fx = function( elem, options, prop, transition ){

	var z = this;

	z.transition = /easein|easeout|easeboth|bouncein|bounceout|bounceboth|elasticin|elasticout|elasticboth/.test(transition) ? transition : 'original';
	z.o = {
		duration: options.duration || 400,
		complete: options.complete,
		step: options.step
	};
	z.el = elem;
	var y = z.el.style;
	z.a = function(){
		if ( options.step )
			options.step.apply( elem, [ z.now ] );

		if ( prop == "opacity" ) {
			if (z.now == 1) z.now = 0.9999;
			if (window.ActiveXObject)
				y.filter = "alpha(opacity=" + z.now*100 + ")";
			else
				y.opacity = z.now;
		} else if ( parseInt(z.now) )
			y[prop] = parseInt(z.now) + "px";
			
		y.display = "block";
	};
	z.max = function(){
		return parseFloat( jQuery.css(z.el,prop) );
	};
	z.cur = function(){
		var r = parseFloat( jQuery.curCSS(z.el, prop) );
		return r && r > -10000 ? r : z.max();
	};
	z.custom = function(from,to){
		z.startTime = (new Date()).getTime();
		z.now = from;
		z.a();

		z.timer = setInterval(function(){
			z.step(from, to);
		}, 13);
	};
	z.show = function( p ){
		if ( !z.el.orig ) z.el.orig = {};
		z.el.orig[prop] = this.cur();

		z.custom( 0, z.el.orig[prop] );
		if ( prop != "opacity" )
			y[prop] = "1px";
	};
	z.hide = function(){
		if ( !z.el.orig ) z.el.orig = {};
		z.el.orig[prop] = this.cur();
		z.o.hide = true;
		z.custom(z.el.orig[prop], 0);
	};
	if ( jQuery.browser.msie && !z.el.currentStyle.hasLayout )
		y.zoom = "1";
	if ( !z.el.oldOverlay )
		z.el.oldOverflow = jQuery.css( z.el, "overflow" );
	y.overflow = "hidden";
	z.step = function(firstNum, lastNum){
		var t = (new Date()).getTime();

		if (t > z.o.duration + z.startTime) {
			clearInterval(z.timer);
			z.timer = null;

			z.now = lastNum;
			z.a();
			if (z.el.curAnim)
				z.el.curAnim[ prop ] = true;
			
			var done = true;
			for ( var i in z.el.curAnim ) {
				if ( z.el.curAnim[i] !== true )
					done = false;
			}
					
			if ( done ) {
				y.overflow = z.el.oldOverflow;
				if ( z.o.hide ) 
					y.display = 'none';
				if ( z.o.hide ) {
					for ( var p in z.el.curAnim ) {
						y[ p ] = z.el.orig[p] + ( p == "opacity" ? "" : "px" );
					}
				}
			}
			if( done && z.o.complete && z.o.complete.constructor == Function )
				z.o.complete.apply( z.el );
		} else {
			var n = t - this.startTime;
			var p = n / z.o.duration;
			z.now = jQuery.fx.transitions(p, n, firstNum, (lastNum-firstNum), z.o.duration, z.transition);
			z.a();
		}
	};	
};*/

jQuery.fxCheckTag = function(e)
{
	if (/tr|td|tbody|caption|thead|tfoot|col|colgroup|th|body|header|script|frame|frameset|option|optgroup|meta/i.test(e.nodeName) )
		return false;
	else 
		return true;
};
jQuery.fx.destroyWrapper = function(e, old)
{
	c = e.firstChild;
	cs = c.style;
	cs.position = old.position;
	cs.marginTop = old.margins.t;
	cs.marginLeft = old.margins.l;
	cs.marginBottom = old.margins.b;
	cs.marginRight = old.margins.r;
	cs.top = old.top + 'px';
	cs.left = old.left + 'px';
	e.parentNode.insertBefore(c, e);
	e.parentNode.removeChild(e);
};
jQuery.fx.buildWrapper = function(e)
{
	if (!jQuery.fxCheckTag(e))
		return false;
	var t = jQuery(e);
	var es = e.style;
	var restoreStyle = false;
	oldStyle = {};
	oldStyle.position = t.css('position');
	oldStyle.sizes = jQuery.iUtil.getSize(e);
	oldStyle.margins = jQuery.iUtil.getMargins(e);
	
	oldFloat = e.currentStyle ? e.currentStyle.styleFloat : t.css('float');
	
	if (t.css('display') == 'none') {
		oldVisibility = t.css('visibility');
		t.show();
		restoreStyle = true;
	}
	oldStyle.top = parseInt(t.css('top'))||0;
	oldStyle.left = parseInt(t.css('left'))||0;
	if (restoreStyle) {
		t.hide();
		es.visibility = oldVisibility;
	}
	var wid = 'w_' + parseInt(Math.random() * 10000);
	var wr = document.createElement(/img|br|input|hr|select|textarea|object|iframe|button|form|table|ul|dl|ol/i.test(e.nodeName) ? 'div' : e.nodeName);
	jQuery.attr(wr,'id', wid);
	wrapEl = jQuery(wr).addClass('fxWrapper');
	var wrs = wr.style;
	var top = 0;
	var left = 0;
	if (oldStyle.position == 'relative' || oldStyle.position == 'absolute'){
		top = oldStyle.top;
		left = oldStyle.left;
	}
	
	wrs.top = top + 'px';
	wrs.left = left + 'px';
	wrs.position = oldStyle.position != 'relative' && oldStyle.position != 'absolute' ? 'relative' : oldStyle.position;
	wrs.height = oldStyle.sizes.hb + 'px';
	wrs.width = oldStyle.sizes.wb + 'px';
	wrs.marginTop = oldStyle.margins.t;
	wrs.marginRight = oldStyle.margins.r;
	wrs.marginBottom = oldStyle.margins.b;
	wrs.marginLeft = oldStyle.margins.l;
	wrs.overflow = 'hidden';
	if (jQuery.browser.msie) {
		wrs.styleFloat = oldFloat;
	} else {
		wrs.cssFloat = oldFloat;
	}
	if (jQuery.browser == "msie") {
		es.filter = "alpha(opacity=" + 0.999*100 + ")";
	}
	es.opacity = 0.999;
	//t.wrap(wr);
	e.parentNode.insertBefore(wr, e);
	wr.appendChild(e);
	es.marginTop = '0px';
	es.marginRight = '0px';
	es.marginBottom = '0px';
	es.marginLeft = '0px';
	es.position = 'absolute';
	es.listStyle = 'none';
	es.top = '0px';
	es.left = '0px';
	return {oldStyle:oldStyle, wrapper:jQuery(wr)};
};
/*jQuery.fx.transitions = function(p, n, firstNum, delta, duration, type)
{
	if (type == 'original') {
		return ((-Math.cos(p*Math.PI)/2) + 0.5) * delta + firstNum;
	}
	if (type == 'easein') {
		return delta*(n/=duration)*n*n + firstNum;
	}
	if (type == 'easeout') {
		return -delta * ((n=n/duration-1)*n*n*n - 1) + firstNum;
	}
	if (type == 'easeboth') {
		if ((n/=duration/2) < 1)
			return delta/2*n*n*n*n + firstNum;
			return -delta/2 * ((n-=2)*n*n*n - 2) + firstNum;
	}
	if (type == 'bounceout') {
		if ((n/=duration) < (1/2.75)) {
			return delta*(7.5625*n*n) + firstNum;
		} else if (n < (2/2.75)) {
			return delta*(7.5625*(n-=(1.5/2.75))*n + .75) + firstNum;
		} else if (n < (2.5/2.75)) {
			return delta*(7.5625*(n-=(2.25/2.75))*n + .9375) + firstNum;
		} else {
			return delta*(7.5625*(n-=(2.625/2.75))*n + .984375) + firstNum;
		}
	}
	if (type == 'bouncein') {
		nm = duration - n;
		if ((nm/=duration) < (1/2.75)) {
			m = delta*(7.5625*nm*nm);
		} else if (nm < (2/2.75)) {
			m = delta*(7.5625*(nm-=(1.5/2.75))*nm + .75);
		} else if (nm < (2.5/2.75)) {
			m = delta*(7.5625*(nm-=(2.25/2.75))*nm + .9375);
		} else {
			m = delta*(7.5625*(nm-=(2.625/2.75))*nm + .984375);
		}
		return delta - m + firstNum;
	}
	
	if (type == 'bounceboth') {
		if (n < duration/2) {
			nm = n * 2;
			if ((nm/=duration) < (1/2.75)) {
				m = delta*(7.5625*nm*nm);
			} else if (nm < (2/2.75)) {
				m = delta*(7.5625*(nm-=(1.5/2.75))*nm + .75);
			} else if (nm < (2.5/2.75)) {
				m = delta*(7.5625*(nm-=(2.25/2.75))*nm + .9375);
			} else {
				m = delta*(7.5625*(nm-=(2.625/2.75))*nm + .984375);
			}
			return (delta - m + firstNum) * .5 + firstNum;
		} else {
			n = n * 2 - duration;
			if ((n/=duration) < (1/2.75)) {
				m = delta*(7.5625*n*n) + firstNum;
			} else if (n < (2/2.75)) {
				m = delta*(7.5625*(n-=(1.5/2.75))*n + .75) + firstNum;
			} else if (n < (2.5/2.75)) {
				m = delta*(7.5625*(n-=(2.25/2.75))*n + .9375) + firstNum;
			} else {
				m = delta*(7.5625*(n-=(2.625/2.75))*n + .984375) + firstNum;
			}
			return m * .5 + delta*.5 + firstNum;
		}
	}
	if (type == 'elasticout') {
		if ((n/=duration)==1)
			return firstNum+delta;
		return delta*Math.pow(2,-10*n) * Math.sin( (n*duration-(duration*.3)/4)*(2*Math.PI)/(duration*.3) ) + delta + firstNum;
	}
	if (type == 'elasticin') {
		if (n==0)
			return b;  
		if ((n/=duration)==1) 
			return firstNum+delta;
		return -(delta*Math.pow(2,10*(n-=1)) * Math.sin( (n*duration-(duration*.3)/4)*(2*Math.PI)/(duration*.3) )) + firstNum;
	}
	if (type == 'elasticboth') {
		if (n==0)
			return firstNum;
		if ((n/=duration)==1) 
			return firstNum+delta;
		jQuery('#test').html(p +'<br />'+n);
		if (p < 1)
			return -.5*(delta*Math.pow(2,10*(n-=1)) * Math.sin( (n*duration-(duration*.45)/4)*(2*Math.PI)/(duration*.45) )) + firstNum;
		return delta*Math.pow(2,-10*(n-=1)) * Math.sin( (n*duration-(duration*.45)/4)*(2*Math.PI)/(duration*.45) )*.5 + delta + firstNum;
	}
			
};*/

jQuery.fx.transitions = function(p, n, firstNum, delta, duration, type) {
	return ((-Math.cos(p*Math.PI)/2) + 0.5) * delta + firstNum;
};

jQuery.fx.namedColors = {
	'aqua':[0,255,255],
	'azure':[240,255,255],
	'beige':[245,245,220],
	'black':[0,0,0],
	'blue':[0,0,255],
	'brown':[165,42,42],
	'cyan':[0,255,255],
	'darkblue':[0,0,139],
	'darkcyan':[0,139,139],
	'darkgrey':[169,169,169],
	'darkgreen':[0,100,0],
	'darkkhaki':[189,183,107],
	'darkmagenta':[139,0,139],
	'darkolivegreen':[85,107,47],
	'darkorange':[255,140,0],
	'darkorchid':[153,50,204],
	'darkred':[139,0,0],
	'darksalmon':[233,150,122],
	'darkviolet':[148,0,211],
	'fuchsia':[255,0,255],
	'gold':[255,215,0],
	'green':[0,128,0],
	'indigo':[75,0,130],
	'khaki':[240,230,140],
	'lightblue':[173,216,230],
	'lightcyan':[224,255,255],
	'lightgreen':[144,238,144],
	'lightgrey':[211,211,211],
	'lightpink':[255,182,193],
	'lightyellow':[255,255,224],
	'lime':[0,255,0],
	'magenta':[255,0,255],
	'maroon':[128,0,0],
	'navy':[0,0,128],
	'olive':[128,128,0],
	'orange':[255,165,0],
	'pink':[255,192,203],
	'purple':[128,0,128],
	'red':[255,0,0],
	'silver':[192,192,192],
	'238,130,238':[238,130,238],
	'white':[255,255,255],
	'yellow':[255,255,0]
};
jQuery.fx.parseColor = function(color)
{
	if (jQuery.fx.namedColors[color]) 
		return {
			r: jQuery.fx.namedColors[color][0],
			g: jQuery.fx.namedColors[color][1],
			b: jQuery.fx.namedColors[color][2]
		};
	else if (result = /^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/.exec(color))
		return {
			r: parseInt(result[1]),
			g: parseInt(result[2]),
			b: parseInt(result[3])
		};
	else if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)$/.exec(color)) 
		return {
			r: parseFloat(result[1])*2.55,
			g: parseFloat(result[2])*2.55,
			b: parseFloat(result[3])*2.55
		};
	else if (result = /^#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/.exec(color))
		return {
			r: parseInt("0x"+ result[1] + result[1]),
			g: parseInt("0x" + result[2] + result[2]),
			b: parseInt("0x" + result[3] + result[3])
		};
	else if (result = /^#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/.exec(color))
		return {
			r: parseInt("0x" + result[1]),
			g: parseInt("0x" + result[2]),
			b: parseInt("0x" + result[3])
		};
	else
		return false;
};
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

jQuery.fx.animateColor = function (e, duration, colors, callback, transition)
{
	/*if (!jQuery.fxCheckTag(e) || !color) {
		jQuery.dequeue(e, 'interfaceFX');
		return false;
	}*/
	var z = this;
	z.transition = transition||'original';
	z.duration = jQuery.speed(duration).duration;
	z.callback = callback;
	z.el = jQuery(e);
	z.colors = colors;
	var cnt = 0;
	for(i in z.colors) {
		z.colors[i] = [jQuery.fx.parseColor(z.colors[i][0]),jQuery.fx.parseColor(z.colors[i][1])];
		cnt ++;
	}
	
	if (cnt == 0) {
		return false;
	}
	
	z.t=(new Date).getTime();
	z.clear = function(){clearInterval(z.timer);z.timer=null;};
	z.step = function(){
		var t = (new Date).getTime();
		var n = t - z.t;
		var p = n / z.duration;
		if (t >= z.duration+z.t) {
			setTimeout(
				function(){
					jQuery.dequeue(z.el.get(0), 'interfaceFX');
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
			
			for(i in z.colors) {
				newColor = {
					r: parseInt(jQuery.fx.transitions(p, n, z.colors[i][0].r, (z.colors[i][1].r-z.colors[i][0].r), z.duration, z.transition)),
					g: parseInt(jQuery.fx.transitions(p, n, z.colors[i][0].g, (z.colors[i][1].g-z.colors[i][0].g), z.duration, z.transition)),
					b: parseInt(jQuery.fx.transitions(p, n, z.colors[i][0].b, (z.colors[i][1].b-z.colors[i][0].b), z.duration, z.transition))
				};
				z.el.css(i, 'rgb(' + newColor.r + ',' + newColor.g + ',' + newColor.b + ')');
			}
		}
	};
	z.timer=setInterval(function(){z.step();},13);

};

jQuery.fn.animateColor = function(duration, color, callback, transition) {
	return this.queue('interfaceFX',function(){
		new jQuery.fx.animateColor(this, duration, color, callback, transition);
	});
};