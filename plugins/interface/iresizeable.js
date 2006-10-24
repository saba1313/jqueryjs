/**
 * Interface Elements for jQuery
 * Resizeable
 *
 * http://interface.eyecon.ro
 *
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 *
 */

jQuery.iResize = {
	resizeElement : null,
	resizeDirection: null,
	pointer: null,
	sizes : null,
	position: null,
	start : function(e)
	{
		jQuery(document)
			.bind('mousemove', jQuery.iResize.move)
			.bind('mouseup', jQuery.iResize.stop);
		jQuery.iResize.resizeElement = this.resizeElement;
		jQuery.iResize.resizeDirection = this.resizeDirection;
		jQuery.iResize.pointer = jQuery.iUtil.getPointer(e);
		jQuery.iResize.sizes = {
			width : parseInt(jQuery(this.resizeElement).css('width'))||0,
			height : parseInt(jQuery(this.resizeElement).css('height'))||0
		};
		jQuery.iResize.position = {
			top : parseInt(jQuery(this.resizeElement).css('top'))||0,
			left : parseInt(jQuery(this.resizeElement).css('left'))||0
		};
		if (jQuery.iResize.resizeElement.resizeOptions.onStart) {
			jQuery.iResize.resizeElement.resizeOptions.onStart.apply(jQuery.iResize.resizeElement, [this])
		}
		return false;
	},
	stop : function()
	{
		jQuery(document)
			.unbind('mousemove', jQuery.iResize.move)
			.unbind('mouseup', jQuery.iResize.stop);
		if (jQuery.iResize.resizeElement.resizeOptions.onStart) {
			jQuery.iResize.resizeElement.resizeOptions.onStart.apply(jQuery.iResize.resizeElement, [jQuery.iResize.resizeDirection])
		}
		jQuery.iResize.resizeElement = null;
		jQuery.iResize.resizeDirection = null;
	},
	getWidth: function(dx, side)
	{
		return Math.min(
						Math.max(
							jQuery.iResize.sizes.width + dx*side,
							jQuery.iResize.resizeElement.resizeOptions.minWidth
						),
						jQuery.iResize.resizeElement.resizeOptions.maxWidth
					);
	},
	getHeight: function(dy, side)
	{
		return Math.min(
						Math.max(
							jQuery.iResize.sizes.height + dy*side,
							jQuery.iResize.resizeElement.resizeOptions.minHeight
						),
						jQuery.iResize.resizeElement.resizeOptions.maxHeight
					);
	},
	getHeightMinMax : function(height)
	{
		return Math.min(
						Math.max(
							height,
							jQuery.iResize.resizeElement.resizeOptions.minHeight
						),
						jQuery.iResize.resizeElement.resizeOptions.maxHeight
					);
	},
	move : function(e)
	{
		if (jQuery.iResize.resizeElement == null)
			return false;
			
		pointer = jQuery.iUtil.getPointer(e);
		dx = pointer.x - jQuery.iResize.pointer.x;
		dy = pointer.y - jQuery.iResize.pointer.y;
		
		newSizes = {
			width : jQuery.iResize.sizes.width,
			height : jQuery.iResize.sizes.height
		};
		newPosition = {
			top: jQuery.iResize.position.top,
			left: jQuery.iResize.position.left
		};
		
		switch(jQuery.iResize.resizeDirection){
			case 'e':
				newSizes.width = jQuery.iResize.getWidth(dx,1);
				break;
			case 'se':
				newSizes.width = jQuery.iResize.getWidth(dx,1);
				newSizes.height = jQuery.iResize.getHeight(dy,1);
				break;
			case 'w':
				newSizes.width = jQuery.iResize.getWidth(dx,-1);
				newPosition.left = jQuery.iResize.position.left - newSizes.width + jQuery.iResize.sizes.width;
				break;
			case 'sw':
				newSizes.width = jQuery.iResize.getWidth(dx,-1);
				newPosition.left = jQuery.iResize.position.left - newSizes.width + jQuery.iResize.sizes.width;
				newSizes.height = jQuery.iResize.getHeight(dy,1);
				break;
			case 'nw':
				newSizes.height = jQuery.iResize.getHeight(dy,-1);
				newPosition.top = jQuery.iResize.position.top - newSizes.height + jQuery.iResize.sizes.height;
				newSizes.width = jQuery.iResize.getWidth(dx,-1);
				newPosition.left = jQuery.iResize.position.left - newSizes.width + jQuery.iResize.sizes.width;
				break;
			case 'n':
				newSizes.height = jQuery.iResize.getHeight(dy,-1);
				newPosition.top = jQuery.iResize.position.top - newSizes.height + jQuery.iResize.sizes.height;
				break;
			case 'ne':
				newSizes.height = jQuery.iResize.getHeight(dy,-1);
				newPosition.top = jQuery.iResize.position.top - newSizes.height + jQuery.iResize.sizes.height;
				newSizes.width = jQuery.iResize.getWidth(dx,1);
				break;
			case 's':
				newSizes.height = jQuery.iResize.getHeight(dy,1);
				break;
		}
		if(jQuery.iResize.resizeElement.resizeOptions.ratio) {
			nHeight = jQuery.iResize.getHeightMinMax(newSizes.width * jQuery.iResize.resizeElement.resizeOptions.ratio);
			nWidth = nHeight / jQuery.iResize.resizeElement.resizeOptions.ratio;
			switch(jQuery.iResize.resizeDirection){
				case 'n':
				case 'nw':
				case 'ne':
					newPosition.top += newSizes.height - nHeight;
				break;
			}
			switch(jQuery.iResize.resizeDirection){
				case 'nw':
				case 'w':
				case 'sw':
					newPosition.left += newSizes.width - nWidth;
				break;
			}
			newSizes.height = nHeight;
			newSizes.width = nWidth;
		}
		
		if (newPosition.top < jQuery.iResize.resizeElement.resizeOptions.minTop ) {
			nHeight = newSizes.height + newPosition.top - jQuery.iResize.resizeElement.resizeOptions.minTop;
			newPosition.top = jQuery.iResize.resizeElement.resizeOptions.minTop;
			if(jQuery.iResize.resizeElement.resizeOptions.ratio) {
				nWidth = nHeight / jQuery.iResize.resizeElement.resizeOptions.ratio;
				switch(jQuery.iResize.resizeDirection){
					case 'nw':
					case 'w':
					case 'sw':
						newPosition.left += newSizes.width - nWidth;
					break;
				}
				newSizes.width = nWidth;
			}
			newSizes.height = nHeight;
		} 
		if (newPosition.left < jQuery.iResize.resizeElement.resizeOptions.minLeft ) {
			nWidth = newSizes.width + newPosition.left - jQuery.iResize.resizeElement.resizeOptions.minLeft;
			newPosition.left = jQuery.iResize.resizeElement.resizeOptions.minLeft;
			if(jQuery.iResize.resizeElement.resizeOptions.ratio) {
				nHeight = nWidth * jQuery.iResize.resizeElement.resizeOptions.ratio;
				switch(jQuery.iResize.resizeDirection){
					case 'n':
					case 'nw':
					case 'ne':
						newPosition.top += newSizes.height - nHeight;
					break;
				}
				newSizes.height = nHeight;
			}
			newSizes.width = nWidth;
		}
		
		if (newPosition.top + newSizes.height > jQuery.iResize.resizeElement.resizeOptions.maxBottom) {
			newSizes.height = jQuery.iResize.resizeElement.resizeOptions.maxBottom - newPosition.top;
			if(jQuery.iResize.resizeElement.resizeOptions.ratio) {
				newSizes.width = newSizes.height / jQuery.iResize.resizeElement.resizeOptions.ratio;
			}
		}
		if (newPosition.left + newSizes.width > jQuery.iResize.resizeElement.resizeOptions.maxRight) {
			newSizes.width = jQuery.iResize.resizeElement.resizeOptions.maxRight - newPosition.left;
			if(jQuery.iResize.resizeElement.resizeOptions.ratio) {
				newSizes.height = newSizes.width *  jQuery.iResize.resizeElement.resizeOptions.ratio;
			}
		}
		if (jQuery.iResize.resizeElement.resizeOptions.onResize) {
			newDimensions = jQuery.iResize.resizeElement.resizeOptions.onResize.apply(
				jQuery.iResize.resizeElement,
				[
					newSizes,
					newPosition
				]
			);
			if(newDimensions) {
				if(newDimensions.sizes){
					jQuery.extend(newSizes, newDimensions.sizes);
				}
				if(newDimensions.position){
					jQuery.extend(newPosition, newDimensions.position);
				}
			}
		} 
		
		elS = jQuery.iResize.resizeElement.style;
		elS.left =  newPosition.left + 'px';
		elS.top =  newPosition.top + 'px';
		elS.width =  newSizes.width + 'px';
		elS.height =  newSizes.height + 'px';
		
		return false;
	},
	build : function(options)
	{
		if(!options || !options.handlers || options.handlers.constructor != Object)
			return;
		
		return this.each(
			function()
			{
				var el = this;
				el.resizeOptions = options;
				el.resizeOptions.minWidth = options.minWidth||10;
				el.resizeOptions.minHeight = options.minHeight||10;
				el.resizeOptions.maxWidth = options.maxWidth||3000;
				el.resizeOptions.maxHeight = options.maxHeight||3000;
				el.resizeOptions.minTop = options.minTop||-1000;
				el.resizeOptions.minLeft = options.minLeft||-1000;
				el.resizeOptions.maxRight = options.maxRight||3000;
				el.resizeOptions.maxBottom = options.maxBottom||3000;
				if (el.style.position != 'relative' && el.style.position != 'absolute') {
					el.style.position = 'relative';
				}
				
				directions = /n|ne|e|se|s|sw|w|nw/g;
				for(i in el.resizeOptions.handlers)
				{
					if(i.toLowerCase().match(directions) != null) {
						if(el.resizeOptions.handlers[i].constructor == String) {
							handle = jQuery(el.resizeOptions.handlers[i], this);
							if(handle.size() > 0) {
								el.resizeOptions.handlers[i] = handle.get(0);
							}
						}
						
						if(el.resizeOptions.handlers[i].tagName) {
							el.resizeOptions.handlers[i].resizeElement = el;
							el.resizeOptions.handlers[i].resizeDirection = i;
							jQuery(el.resizeOptions.handlers[i]).bind(
								'mousedown',
								jQuery.iResize.start
							);
						}
					}
				}
			}
		);
	}
};
jQuery.fn.extend(
	{
		Resizeable : jQuery.iResize.build
	}
);