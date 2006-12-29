/**
 * Interface Elements for jQuery
 * ImageBox
 * 
 * http://interface.eyecon.ro
 * 
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *   
 * $Revision$
 *
 */

jQuery.ImageBox = {
	options : {
		border				: 10,
		loaderSRC			: 'images/loading.gif',
		closeHTML			: '<img src="images/close.jpg" />',
		overlayOpacity		: 0.8,
		textImage			: 'Showing image',
		textImageFrom		: 'from',
		fadeDuration		: 400
	},
	imageLoaded : false,
	firstResize : false,
	
	init : function(options)
	{
		if (options)
			jQuery.extend(jQuery.ImageBox.options, options);
		jQuery('a').each(
			function()
			{
				el 				= jQuery(this);
				relAttr 		= el.attr('rel')||'';
				hrefAttr 		= el.attr('href')||'';
				imageTypes 		= /\.jpg|\.jpeg|\.png|\.gif|\.bmp/g;
				if (hrefAttr.toLowerCase().match(imageTypes) != null && relAttr.toLowerCase().indexOf('imagebox') == 0) {
					el.click(jQuery.ImageBox.start);
				}
			}
		);
		if ($.browser.msie) {
			iframe = document.createElement('iframe');
			jQuery(iframe)
				.attr(
					{
						id			: 'ImageBoxIframe',
						src			: 'javascript:false;',
						frameborder	: 'no',
						scrolling	: 'no'
					}
				)
				.css (
					{
						display		: 'none',
						position	: 'absolute',
						top			: '0',
						left		: '0',
						filter		: 'progid:DXImageTransform.Microsoft.Alpha(opacity=0)'
					}
				);
			jQuery('body').append(iframe);
		}
		
		overlay	= document.createElement('div');
		jQuery(overlay)
			.attr('id', 'ImageBoxOverlay')
			.css(
				{
					position	: 'absolute',
					display		: 'none',
					top			: '0',
					left		: '0',
					opacity		: 0
				}
			)
			.append(document.createTextNode(' '))
			.click(jQuery.ImageBox.hideImage);
		
		captionText = document.createElement('div');
		jQuery(captionText)
			.attr('id', 'ImageBoxCaptionText')
			.css(
				{
					paddingLeft		: jQuery.ImageBox.options.border + 'px'
				}
			)
			.append(document.createTextNode(' '));
			
		captionImages = document.createElement('div');
		jQuery(captionImages)
			.attr('id', 'ImageBoxCaptionImages')
			.css(
				{
					paddingLeft		: jQuery.ImageBox.options.border + 'px',
					paddingBottom	: jQuery.ImageBox.options.border + 'px'
				}
			)
			.append(document.createTextNode(' '));
			
		closeEl = document.createElement('a');
		jQuery(closeEl)
			.attr(
				{
					id			: 'ImageBoxClose',
					href		: '#'
				}
			)
			.css(
				{
					position	: 'absolute',
					right		: jQuery.ImageBox.options.border + 'px',
					top			: '0'
				}
			)
			.append(jQuery.ImageBox.options.closeHTML)
			.click(jQuery.ImageBox.hideImage);
			
		captionEl = document.createElement('div');
		jQuery(captionEl)
			.attr('id', 'ImageBoxCaption')
			.css(
				{
					position	: 'relative',
					textAlign	: 'left',
					margin		: '0 auto',
					zIndex		: 1
				}
			)
			.append(captionText)
			.append(captionImages)
			.append(closeEl);
		
		loader = document.createElement('img');
		loader.src = jQuery.ImageBox.options.loaderSRC;
		jQuery(loader)
			.attr('id', 'ImageBoxLoader')
			.css(
				{
					position	: 'absolute'
				}
			);
			
		prevImage = document.createElement('a');
		jQuery(prevImage)
			.attr(
				{
					id			: 'ImageBoxPrevImage',
					href		: '#'
				}
			)
			.css(
				{
					position		: 'absolute',
					display			: 'none',
					overflow		: 'hidden',
					textDecoration	: 'none'
				}
			)
			.append(document.createTextNode(' '));
			
		nextImage = document.createElement('a');
		jQuery(nextImage)
			.attr(
				{
					id			: 'ImageBoxNextImage',
					href		: '#'
				}
			)
			.css(
				{
					position		: 'absolute',
					overflow		: 'hidden',
					textDecoration	: 'none'
				}
			)
			.append(document.createTextNode(' '));
		
		container = document.createElement('div');
		jQuery(container)
			.attr('id', 'ImageBoxContainer')
			.css(
				{
					display		: 'none',
					position	: 'relative',
					overflow	: 'hidden',
					textAlign	: 'left',
					margin		: '0 auto',
					top			: '0',
					left		: '0',
					zIndex		: 2
				}
			)
			.append([loader, prevImage, nextImage]);
		
		outerContainer = document.createElement('div');
		jQuery(outerContainer)
			.attr('id', 'ImageBoxOuterContainer')
			.css(
				{
					display		: 'none',
					position	: 'absolute',
					overflow	: 'hidden',
					top			: '0',
					left		: '0',
					textAlign	: 'center',
					backgroundColor : 'transparent',
					lineHeigt	: '0'
				}
			)
			.append([container,captionEl]);
		
		jQuery('body')
			.append(overlay)
			.append(outerContainer);
	},
	
	start : function(e, elm)
	{
		el = elm ? jQuery(elm) : jQuery(this);
		linkRel =  el.attr('rel');
		if (linkRel != 'imagebox') {
			gallery = jQuery('a[@rel=' + linkRel + ']');
			totalImages = gallery.size();
			iteration = gallery.index(elm ? elm : this);
			prevImage = gallery.get(iteration - 1);
			nextImage = gallery.get(iteration + 1);
		}
		imageSrc =  el.attr('href');
		captionText = el.attr('title');
		pageSize = jQuery.iUtil.getScroll();
		overlay = jQuery('#ImageBoxOverlay')
		if (overlay.css('display') == 'none') {
			if (jQuery.browser.msie) {
				jQuery('#ImageBoxIframe')
					.css ('height', Math.max(pageSize.ih,pageSize.h) + 'px')
					.css ('width', Math.max(pageSize.iw,pageSize.w) + 'px')
					.show();
			}
			overlay
				.css ('height', Math.max(pageSize.ih,pageSize.h) + 'px')
				.css ('width', Math.max(pageSize.iw,pageSize.w) + 'px')
				.show()
				.fadeTo( 
					300,
					jQuery.ImageBox.options.overlayOpacity,
					function()
					{
						jQuery.ImageBox.loadImage(
							imageSrc, 
							captionText, 
							pageSize, 
							totalImages, 
							iteration,
							prevImage,
							nextImage
						);
					}
				);
			jQuery('#ImageBoxOuterContainer').css ('width', Math.max(pageSize.iw,pageSize.w) + 'px');
		} else {
			jQuery('#ImageBoxPrevImage').get(0).onclick = null;
			jQuery('#ImageBoxNextImage').get(0).onclick = null;
			jQuery.ImageBox.loadImage(
				imageSrc, 
				captionText, 
				pageSize, 
				totalImages, 
				iteration,
				prevImage,
				nextImage
			);
		}
		return false;
	},
		
	loadImage : function(imageSrc, captiontext, pageSize, totalImages, iteration, prevImage, nextImage)
	{
		jQuery('#ImageBoxCurrentImage').remove();
		prevImageEl = jQuery('#ImageBoxPrevImage').hide();
		nextImageEl = jQuery('#ImageBoxNextImage').hide();
		loader = jQuery('#ImageBoxLoader');
		container = jQuery('#ImageBoxContainer');
		outerContainer = jQuery('#ImageBoxOuterContainer');
		captionEl = jQuery('#ImageBoxCaption').css('visibility', 'hidden');
		jQuery('#ImageBoxCaptionText').html(captionText);
		if (totalImages)
			jQuery('#ImageBoxCaptionImages').html(
				jQuery.ImageBox.options.textImage 
				+ ' ' + (iteration + 1) + ' '
				+ jQuery.ImageBox.options.textImageFrom  
				+ ' ' + totalImages
			);
		if (prevImage) {
			prevImageEl.get(0).onclick = function()
			{
				this.blur();
				jQuery.ImageBox.start(null, prevImage);
				return false;
			};
		}
		if (nextImage) {
			nextImageEl.get(0).onclick =function()
			{
				this.blur();
				jQuery.ImageBox.start(null, nextImage);
				return false;
			};
		}
		loader.show();
		containerSize = jQuery.iUtil.getSize(container.get(0));
		containerW = Math.max(containerSize.wb, loader.get(0).width + jQuery.ImageBox.options.border * 2);
		containerH = Math.max(containerSize.hb, loader.get(0).height + jQuery.ImageBox.options.border * 2);
		loader
			.css(
				{
					left	: (containerW - loader.get(0).width)/2 + 'px',
					top		: (containerH - loader.get(0).height)/2 + 'px'
				}
			);
		container
			.css(
				{
					width	: containerW + 'px',
					height	: containerH + 'px'
				}
			)
			.show();
		clientSize = jQuery.iUtil.getClient();
		outerContainer
			.css('top', pageSize.t +  (clientSize.h / 15) + 'px');
		if (outerContainer.css('display') == 'none') {
			outerContainer
				.show()
				.fadeIn(
					jQuery.ImageBox.options.fadeDuration
				);
		}
		imageEl = new Image;
		jQuery(imageEl)
			.attr('id', 'ImageBoxCurrentImage')
			.load(
			function()
			{
				containerW = imageEl.width + jQuery.ImageBox.options.border * 2;
				containerH = imageEl.height + jQuery.ImageBox.options.border * 2;
				loader.hide();
				container.animate(
					{
						height		: containerH
					},
					containerSize.hb != containerH ? jQuery.ImageBox.options.fadeDuration : 1,
					function()
					{
						container.animate(
							{
								width		: containerW
							},
							containerSize.wb != containerW ? jQuery.ImageBox.options.fadeDuration : 1,
							function()
							{
								container.prepend(imageEl);
								jQuery(imageEl)
									.css(
										{
											position	: 'absolute',
											left		: jQuery.ImageBox.options.border + 'px',
											top			: jQuery.ImageBox.options.border + 'px'
										}
									)
									.fadeIn(
										jQuery.ImageBox.options.fadeDuration,
										function()
										{
											captionSize = jQuery.iUtil.getSize(captionEl.get(0));
											if (prevImage) {
												prevImageEl
													.css(
														{
															left	: jQuery.ImageBox.options.border + 'px',
															top		: jQuery.ImageBox.options.border + 'px',
															width	: containerW/2 - jQuery.ImageBox.options.border * 3 + 'px',
															height	: containerH - jQuery.ImageBox.options.border * 2 + 'px'
														}
													)
													.show();
											}
											if (nextImage) {
												nextImageEl
													.css(
														{
															left	: containerW/2 + jQuery.ImageBox.options.border * 2 + 'px',
															top		: jQuery.ImageBox.options.border + 'px',
															width	: containerW/2 - jQuery.ImageBox.options.border * 3 + 'px',
															height	: containerH - jQuery.ImageBox.options.border * 2 + 'px'
														}
													)
													.show();
											}
											captionEl
												.css(
													{
														width		: containerW + 'px',
														top			: - captionSize.hb + 'px',
														visibility	: 'visible'
													}
												)
												.animate(
													{
														top		: -1
													},
													jQuery.ImageBox.options.fadeDuration
												);
										}
									);
							}
						);
					}
				);
			}
		);
		imageEl.src = imageSrc;
			
	},
	
	hideImage : function()
	{
		jQuery('#ImageBoxCurrentImage').remove();
		jQuery('#ImageBoxOuterContainer').hide();
		jQuery('#ImageBoxCaption').css('visibility', 'hidden');
		jQuery('#ImageBoxOverlay').fadeTo(
			300, 
			0, 
			function(){
				jQuery(this).hide();
				if (jQuery.browser.msie) {
					jQuery('#ImageBoxIframe').hide();
				}
			}
		);
		jQuery('#ImageBoxPrevImage').get(0).onclick = null;
		jQuery('#ImageBoxNextImage').get(0).onclick = null;
		return false;
	}
}