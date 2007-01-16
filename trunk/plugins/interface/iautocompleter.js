/**
 * Interface Elements for jQuery
 * Autocompleter
 * 
 * http://interface.eyecon.ro
 * 
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *  
 */

/**
 * Attach AJAX driven autocomplete/sugestion box to text input fields.
 *
 * 
 * 
 * @name Autocomplete
 * @description Attach AJAX driven autocomplete/sugestion box to text input fields.
 * @param Hash hash A hash of parameters
 * @option String source the URL to request
 * @option Integer delay (optional) the delayed time to start the AJAX request
 * @option Boolean autofill (optional) when true the first sugested value fills the input
 * @option String helperClass (optional) the CSS class applied to sugestion box
 * @option String selectClass (optional) the CSS class applied to selected/hovered item
 * @option Integer minchars (optional) the number of characters needed before starting AJAX request
 * @option Hash fx (optional) {type:[slide|blind|fade]; duration: integer} the fx type to apply to sugestion box and duration for that fx
 * @option Function onSelect (optional) A function to be executed whenever an item it is selected
 * @option Function onShow (optional) A function to be executed whenever the suggection box is displayed
 * @option Function onHide (optional) A function to be executed whenever the suggection box is hidden
 * @option Boolean inputWidth (optional) Whatever to resize suggestion box to fit input's width
 * @option Boolean multiple (optional) If true the suggestion box will accept more values separated by multipleSeparator option
 * @option String multipleSeparator (optional) String to separate multiple values
 *
 * @type jQuery
 * @cat Plugins/Interface
 * @author Stefan Petre
 */
jQuery.iAuto = {
	helper : null,
	content : null,
	iframe: null,
	timer : null,
	lastValue: null,
	currentValue: null,
	subject: null,
	selectedItem : null,
	items: null,
	
	empty : function()
	{
		jQuery.iAuto.content.empty();
		if (jQuery.iAuto.iframe) {
			jQuery.iAuto.iframe.hide();
		}
	},

	clear : function()
	{
		jQuery.iAuto.items = null;
		jQuery.iAuto.selectedItem = null;
		jQuery.iAuto.lastValue = jQuery.iAuto.subject.value;
		if(jQuery.iAuto.helper.css('display') == 'block') {
			if (jQuery.iAuto.subject.autoCFG.fx) {
				switch(jQuery.iAuto.subject.autoCFG.fx.type) {
					case 'fade':
						jQuery.iAuto.helper.fadeOut(jQuery.iAuto.subject.autoCFG.fx.duration, jQuery.iAuto.empty);
						break;
					case 'slide':
						jQuery.iAuto.helper.SlideOutUp(jQuery.iAuto.subject.autoCFG.fx.duration, jQuery.iAuto.empty);
						break;
					case 'blind':
						jQuery.iAuto.helper.BlindUp(jQuery.iAuto.subject.autoCFG.fx.duration, jQuery.iAuto.empty);
						break;
				}
			} else {
				jQuery.iAuto.helper.hide();
			}
			if (jQuery.iAuto.subject.autoCFG.onHide)
				jQuery.iAuto.subject.autoCFG.onHide.apply(jQuery.iAuto.subject, [jQuery.iAuto.helper, jQuery.iAuto.iframe]);
		} else {
			jQuery.iAuto.empty();
		}
		window.clearTimeout(jQuery.iAuto.timer);
	},

	update : function ()
	{
		var subject = jQuery.iAuto.subject;
		var subjectValue = subject.value;
		var preValue = '';
		if (subject.autoCFG.multiple) {
			var separatorPosition = subjectValue.lastIndexOf(subject.autoCFG.multipleSeparator);
			if (separatorPosition > -1) {
				preValue = subjectValue.substr(0, separatorPosition) + subject.autoCFG.multipleSeparator;
				subjectValue = subjectValue.substr(separatorPosition + subject.autoCFG.multipleSeparator.length, subjectValue.length);
			}
		}
		if (subject && subjectValue != jQuery.iAuto.lastValue && subjectValue.length >= subject.autoCFG.minchars) {
			jQuery.iAuto.lastValue = subjectValue;
			jQuery.iAuto.currentValue = subjectValue;

			data = {
				field: $(subject).attr('name')||'field',
				value: subjectValue
			};

			jQuery.ajax(
				{
					type: 'POST',
					data: $.param(data),
					success: function(xml)
					{
						subject.autoCFG.lastSuggestion = $('item',xml);
						size = subject.autoCFG.lastSuggestion.size();
						if (size > 0) {
							var toWrite = '';
							subject.autoCFG.lastSuggestion.each(
								function(nr)
								{
									toWrite += '<li rel="' + $('value', this).text() + '" dir="' + nr + '" style="cursor: default;">' + $('text', this).text() + '</li>';
								}
							);
							if (subject.autoCFG.autofill) {
								subject.value = preValue + $('value', subject.autoCFG.lastSuggestion.get(0)).text();
								jQuery.iAuto.selection(subject, preValue.length + jQuery.iAuto.currentValue.length, subject.value.length);
							}
							
							if (size > 0) {
								jQuery.iAuto.writeItems(subject, toWrite);
							} else {
								jQuery.iAuto.clear();
							}
						} else {
							jQuery.iAuto.clear();
						}
					},
					url : subject.autoCFG.source
				}
			);
		}
	},
	
	writeItems : function(subject, toWrite)
	{
		jQuery.iAuto.content.html(toWrite);
		jQuery.iAuto.items = $('li', jQuery.iAuto.content.get(0));
		jQuery.iAuto.items
			.mouseover(jQuery.iAuto.hoverItem)
			.bind('click', jQuery.iAuto.clickItem);
		position = jQuery.iUtil.getPosition(subject);
		size = jQuery.iUtil.getSize(subject);
		jQuery.iAuto.helper
			.css('top', position.y + size.hb + 'px')
			.css('left', position.x +  'px')
			.addClass(subject.autoCFG.helperClass);
		if (jQuery.iAuto.iframe) {
			jQuery.iAuto.iframe
				.css('top', position.y + size.hb + 'px')
				.css('left', position.x +  'px')
				.css('width', jQuery.iAuto.helper.css('width') + 'px')
				.css('height', jQuery.iAuto.helper.css('height') + 'px')
				.css('display', 'block');
		}
		jQuery.iAuto.selectedItem = 0;
		jQuery.iAuto.items.get(0).className = subject.autoCFG.selectClass;
		
		if (jQuery.iAuto.helper.css('display') == 'none') {
			if (subject.autoCFG.inputWidth) {
				var borders = jQuery.iUtil.getPadding(subject, true);
				var paddings = jQuery.iUtil.getBorder(subject, true);
				jQuery.iAuto.helper.css('width', subject.offsetWidth - (jQuery.boxModel ? (borders.l + borders.r + paddings.l + paddings.r) : 0 ) + 'px');
			}
			if (subject.autoCFG.fx) {
				switch(subject.autoCFG.fx.type) {
					case 'fade':
						jQuery.iAuto.helper.fadeIn(subject.autoCFG.fx.duration);
						break;
					case 'slide':
						jQuery.iAuto.helper.SlideInUp(subject.autoCFG.fx.duration);
						break;
					case 'blind':
						jQuery.iAuto.helper.BlindDown(subject.autoCFG.fx.duration);
						break;
				}
			} else {
				jQuery.iAuto.helper.show();
			}
			
			if (jQuery.iAuto.subject.autoCFG.onShow)
				jQuery.iAuto.subject.autoCFG.onShow.apply(jQuery.iAuto.subject, [jQuery.iAuto.helper, jQuery.iAuto.iframe]);
		}
	},
	
	checkCache : function()
	{
		var subject = this;
		if (subject.autoCFG.lastSuggestion) {
			
			jQuery.iAuto.lastValue = subject.value;
			jQuery.iAuto.currentValue = subject.value;
			
			var toWrite = '';
			subject.autoCFG.lastSuggestion.each(
				function(nr)
				{
					value = $('value', this).text().toLowerCase();
					inputValue = subject.value.toLowerCase();
					if (value.indexOf(inputValue) == 0) {
						toWrite += '<li rel="' + $('value', this).text() + '" dir="' + nr + '" style="cursor: default;">' + $('text', this).text() + '</li>';
					}
				}
			);
			
			if (toWrite != '') {
				jQuery.iAuto.writeItems(subject, toWrite);
				
				this.autoCFG.inCache = true;
				return;
			}
		}
		subject.autoCFG.lastSuggestion = null;
		this.autoCFG.inCache = false;
	},

	selection : function(field, start, end)
	{
		if (field.createTextRange) {
			var selRange = field.createTextRange();
			selRange.collapse(true);
			selRange.moveStart("character", start);
			selRange.moveEnd("character", end);
			selRange.select();
		} else if (field.setSelectionRange) {
			field.setSelectionRange(start, end);
		} else {
			if (field.selectionStart) {
				field.selectionStart = start;
				field.selectionEnd = end;
			}
		}
		field.focus();
	},

	autocomplete : function(e)
	{
		window.clearTimeout(jQuery.iAuto.timer);
		var subjectValue = this.value;
		var preValue = '';
		if (this.autoCFG.multiple) {
			var separatorPosition = subjectValue.lastIndexOf(this.autoCFG.multipleSeparator);
			if (separatorPosition > -1) {
				preValue = subjectValue.substr(0, separatorPosition) + this.autoCFG.multipleSeparator;
				subjectValue = subjectValue.substr(separatorPosition + this.autoCFG.multipleSeparator.length, subjectValue.length);
			}
		}
				
		var pressedKey = e.charCode || e.keyCode || -1;
		if (/13|27|35|36|38|40/.test(pressedKey) && jQuery.iAuto.items) {
			if (window.event) {
				window.event.cancelBubble = true;
				window.event.returnValue = false;
			} else {
				e.preventDefault();
				e.stopPropagation();
			}
			if (jQuery.iAuto.selectedItem != null) 
				jQuery.iAuto.items.get(jQuery.iAuto.selectedItem||0).className = '';
			else
				jQuery.iAuto.selectedItem = -1;
			switch(pressedKey) {
				//enter
				case 13:
					if (jQuery.iAuto.selectedItem == -1)
						jQuery.iAuto.selectedItem = 0;
					selectedItem = jQuery.iAuto.items.get(jQuery.iAuto.selectedItem||0);
					this.value = preValue + selectedItem.getAttribute('rel') + this.autoCFG.multipleSeparator;
					jQuery.iAuto.lastValue = subjectValue;
					//jQuery.iAuto.selection(this, preValue.length + jQuery.iAuto.lastValue.length, this.value.length);
					this.focus();
					jQuery.iAuto.clear();
					if (this.autoCFG.onSelect) {
						iteration = parseInt(selectedItem.getAttribute('dir'))||0;
						jQuery.iAuto.applyOnSelect(this,this.autoCFG.lastSuggestion.get(iteration));
					}
					if (this.scrollIntoView)
						this.scrollIntoView(false);
					return false;
					break;
				//escape
				case 27:
					this.value = preValue + jQuery.iAuto.lastValue;
					this.autoCFG.lastSuggestion = null;
					jQuery.iAuto.clear();
					if (this.scrollIntoView)
						this.scrollIntoView(false);
					return false;
					break;
				//end
				case 35:
					jQuery.iAuto.selectedItem = jQuery.iAuto.items.size() - 1;
					break;
				//home
				case 36:
					jQuery.iAuto.selectedItem = 0;
					break;
				//up
				case 38:
					jQuery.iAuto.selectedItem --;
					if (jQuery.iAuto.selectedItem < 0)
						jQuery.iAuto.selectedItem = jQuery.iAuto.items.size() - 1;
					break;
				case 40:
					jQuery.iAuto.selectedItem ++;
					if (jQuery.iAuto.selectedItem == jQuery.iAuto.items.size())
						jQuery.iAuto.selectedItem = 0;
					break;
			}
			jQuery.iAuto.items.get(jQuery.iAuto.selectedItem||0).className = this.autoCFG.selectClass;
			if (jQuery.iAuto.items.get(jQuery.iAuto.selectedItem||0).scrollIntoView)
				jQuery.iAuto.items.get(jQuery.iAuto.selectedItem||0).scrollIntoView(false);
			if(this.autoCFG.autofill) {
				this.value = preValue + jQuery.iAuto.items.get(jQuery.iAuto.selectedItem||0).getAttribute('rel');
				jQuery.iAuto.selection(this, preValue.length + jQuery.iAuto.lastValue.length, this.value.length);
			}
			return false;
		}
		jQuery.iAuto.checkCache.apply(this);
		
		if (this.autoCFG.inCache == false) {
			if (subjectValue != jQuery.iAuto.lastValue && subjectValue.length >= this.autoCFG.minchars)
				jQuery.iAuto.timer = window.setTimeout(jQuery.iAuto.update, this.autoCFG.delay);
			if (jQuery.iAuto.items) {
				jQuery.iAuto.clear();
			}
		}
		return true;
	},

	applyOnSelect : function(field, item)
	{
		if (field.autoCFG.onSelect) {
			var data = {};
			childs = item.getElementsByTagName('*');
			for(i=0; i<childs.length; i++){
				data[childs[i].tagName] = childs[i].firstChild.nodeValue;
			}
			field.autoCFG.onSelect.apply(field,[data]);
		}
	},
	
	hoverItem : function(e)
	{
		if (jQuery.iAuto.items) {
			if (jQuery.iAuto.selectedItem != null) 
				jQuery.iAuto.items.get(jQuery.iAuto.selectedItem||0).className = '';
			jQuery.iAuto.items.get(jQuery.iAuto.selectedItem||0).className = '';
			jQuery.iAuto.selectedItem = parseInt(this.getAttribute('dir'))||0;
			jQuery.iAuto.items.get(jQuery.iAuto.selectedItem||0).className = jQuery.iAuto.subject.autoCFG.selectClass;
		}
	},

	clickItem : function(event)
	{	
		window.clearTimeout(jQuery.iAuto.timer);
		
		event = event || jQuery.event.fix( window.event );
		event.preventDefault();
		event.stopPropagation();

		var subjectValue = jQuery.iAuto.subject.value;
		var preValue = '';
		if (jQuery.iAuto.subject.autoCFG.multiple) {
			var separatorPosition = subjectValue.lastIndexOf(jQuery.iAuto.subject.autoCFG.multipleSeparator);
			if (separatorPosition > -1) {
				preValue = subjectValue.substr(0, separatorPosition) + jQuery.iAuto.subject.autoCFG.multipleSeparator;
				subjectValue = subjectValue.substr(separatorPosition + jQuery.iAuto.subject.autoCFG.multipleSeparator.length, subjectValue.length);
			}
		}
		jQuery.iAuto.subject.value = preValue + this.getAttribute('rel') + jQuery.iAuto.subject.autoCFG.multipleSeparator;
		jQuery.iAuto.lastValue = this.getAttribute('rel');
		//jQuery.iAuto.selection(jQuery.iAuto.subject, preValue.length + jQuery.iAuto.lastValue.length, jQuery.iAuto.subject.value.length);
		jQuery.iAuto.subject.focus();
		jQuery.iAuto.clear();
		if (jQuery.iAuto.subject.autoCFG.onSelect) {
			iteration = parseInt(this.getAttribute('dir'))||0;
			jQuery.iAuto.applyOnSelect(jQuery.iAuto.subject,jQuery.iAuto.subject.autoCFG.lastSuggestion.get(iteration));
		}

		return false;
	},

	protect : function(e)
	{
		pressedKey = e.charCode || e.keyCode || -1;
		if (/13|27|35|36|38|40/.test(pressedKey) && jQuery.iAuto.items) {
			if (window.event) {
				window.event.cancelBubble = true;
				window.event.returnValue = false;
			} else {
				e.preventDefault();
				e.stopPropagation();
			}
			return false;
		}
	},

	build : function(options)
	{
		if (!options.source || !jQuery.iUtil) {
			return;
		}

		if (!jQuery.iAuto.helper) {
			if ($.browser.msie) {
				$('body', document).append('<iframe style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" id="autocompleteIframe" src="javascript:false;" frameborder="0" scrolling="no"></iframe>');
				jQuery.iAuto.iframe = $('#autocompleteIframe');
			}
			$('body', document).append('<div id="autocompleteHelper" style="position: absolute; top: 0; left: 0; z-index: 30001; display: none;"><ul style="margin: 0;padding: 0; list-style: none; z-index: 30002;">&nbsp;</ul></div>');
			jQuery.iAuto.helper = $('#autocompleteHelper');
			jQuery.iAuto.content = $('ul', jQuery.iAuto.helper);
		}

		return this.each(
			function()
			{
				if (this.tagName != 'INPUT' && this.getAttribute('type') != 'text' )
					return;
				this.autoCFG = {};
				this.autoCFG.source = options.source;
				this.autoCFG.minchars = Math.abs(parseInt(options.minchars)||1);
				this.autoCFG.helperClass = options.helperClass ? options.helperClass : '';
				this.autoCFG.selectClass = options.selectClass ? options.selectClass : '';
				this.autoCFG.onSelect = options.onSelect && options.onSelect.constructor == Function ? options.onSelect : null;
				this.autoCFG.onShow = options.onShow && options.onShow.constructor == Function ? options.onShow : null;
				this.autoCFG.onHide = options.onHide && options.onHide.constructor == Function ? options.onHide : null;
				this.autoCFG.inputWidth = options.inputWidth||false;
				this.autoCFG.multiple = options.multiple||false;
				this.autoCFG.multipleSeparator = this.autoCFG.multiple ? (options.multipleSeparator||', '):'';
				this.autoCFG.autofill = options.autofill ? true : false;
				this.autoCFG.delay = Math.abs(parseInt(options.delay)||1000);
				if (options.fx && options.fx.constructor == Object) {
					if (!options.fx.type || !/fade|slide|blind/.test(options.fx.type)) {
						options.fx.type = 'slide';
					}
					if (options.fx.type == 'slide' && !jQuery.fx.slide)
						return;
					if (options.fx.type == 'blind' && !jQuery.fx.BlindDirection)
						return;

					options.fx.duration = Math.abs(parseInt(options.fx.duration)||400);
					if (options.fx.duration > this.autoCFG.delay) {
						options.fx.duration = this.autoCFG.delay - 100;
					}
					this.autoCFG.fx = options.fx;
				}
				this.autoCFG.lastSuggestion = null;
				this.autoCFG.inCache = false;

				$(this)
					.attr('autocomplete', 'off')
					.focus(
						function()
						{
							jQuery.iAuto.subject = this;
							jQuery.iAuto.lastValue = this.value;
						}
					)
					.keypress(jQuery.iAuto.protect)
					.keyup(jQuery.iAuto.autocomplete)
					
					.blur(
						function()
						{
							jQuery.iAuto.timer = window.setTimeout(jQuery.iAuto.clear, 200);
						}
					);
			}
		);
	}
};
jQuery.fn.Autocomplete = jQuery.iAuto.build;