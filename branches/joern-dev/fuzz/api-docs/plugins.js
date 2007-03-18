/*
 * Accordion 1.3 - jQuery menu widget
 *
 * Copyright (c) 2006 J�rn Zaefferer, Frank Marcia
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.accordion.js 1528 2007-03-13 22:53:25Z joern $
 *
 */

/**
 * Make the selected elements Accordion widgets.
 *
 * Semantic requirements:
 *
 * If the structure of your container is flat with unique
 * tags for header and content elements, eg. a definition list
 * (dl > dt + dd), you don't have to specify any options at
 * all.
 *
 * If your structure uses the same elements for header and
 * content or uses some kind of nested structure, you have to
 * specify the header elements, eg. via class, see the second example.
 *
 * Use activate(Number) to change the active content programmatically.
 *
 * A change event is triggered everytime the accordion changes. Apart from
 * the event object, all arguments are jQuery objects.
 * Arguments: event, newHeader, oldHeader, newContent, oldContent
 *
 * @example jQuery('#nav').Accordion();
 * @before <dl id="nav">
 *   <dt>Header 1</dt>
 *   <dd>Content 1</dd>
 *   <dt>Header 2</dt>
 *   <dd>Content 2</dd>
 * </dl>
 * @desc Creates an Accordion from the given definition list
 *
 * @example jQuery('#nav').Accordion({
 *   header: 'div.title'
 * });
 * @before <div id="nav">
 *  <div>
 *    <div class="title">Header 1</div>
 *    <div>Content 1</div>
 *  </div>
 *  <div>
 *    <div class="title">Header 2</div>
 *    <div>Content 2</div>
 *  </div>
 * </div>
 * @desc Creates an Accordion from the given div structure
 *
 * @example jQuery('#nav').Accordion({
 *   header: 'a.head'
 * });
 * @before <ul id="nav">
 *   <li>
 *     <a class="head">Header 1</a>
 *     <ul>
 *       <li><a href="#">Link 1</a></li>
 *       <li><a href="#">Link 2></a></li>
 *     </ul>
 *   </li>
 *   <li>
 *     <a class="head">Header 2</a>
 *     <ul>
 *       <li><a href="#">Link 3</a></li>
 *       <li><a href="#">Link 4></a></li>
 *     </ul>
 *   </li>
 * </ul>
 * @desc Creates an Accordion from the given navigation list
 *
 * @example jQuery('#accordion').Accordion().change(function(event, newHeader, oldHeader, newContent, oldContent) {
 *   jQuery('#status').html(newHeader.text());
 * });
 * @desc Updates the element with id status with the text of the selected header every time the accordion changes
 *
 * @param Map options key/value pairs of optional settings.
 * @option String|Element|jQuery|Boolean active Selector for the active element, default is the first child, set to false to display none at start
 * @option String|Element|jQuery header Selector for the header element, eg. div.title, a.head, default is the first child's tagname
 * @option String|Number showSpeed Speed for the slideIn, default is 'slow' (for numbers: smaller = faster)
 * @option String|Number hideSpeed Speed for the slideOut, default is 'fast' (for numbers: smaller = faster)
 * @option String selectedClass Class for active header elements, default is 'selected'
 * @option Boolean alwaysOpen Whether there must be one content element open, default is true.
 * @option Boolean animated Set to false to disable animations. Default: true
 * @option String event The event on which to trigger the accordion, eg. "mouseover". Default: "click"
 *
 * @type jQuery
 * @see activate(Number)
 * @name Accordion
 * @cat Plugins/Accordion
 */

/**
 * Activate a content part of the Accordion programmatically at the given zero-based index.
 *
 * If the index is not specified, it defaults to zero, if it is an invalid index, eg. a string,
 * nothing happens.
 *
 * @example jQuery('#accordion').activate(1);
 * @desc Activate the second content of the Accordion contained in <div id="accordion">.
 *
 * @example jQuery('#nav').activate();
 * @desc Activate the first content of the Accordion contained in <ul id="nav">.
 *
 * @param Number index (optional) An Integer specifying the zero-based index of the content to be
 *				 activated. Default: 0
 *
 * @type jQuery
 * @name activate
 * @cat Plugins/Accordion
 */
 
/**
 * Override the default settings of the Accordion. Affects only following plugin calls.
 *
 * @example jQuery.Accordion.setDefaults({
 * 	showSpeed: 1000,
 * 	hideSpeed: 150
 * });
 *
 * @param Map options key/value pairs of optional settings, see Accordion() for details
 *
 * @type jQuery
 * @name setDefaults
 * @cat Plugins/Accordion
 */

jQuery.fn.extend({
	// nextUntil is necessary, would be nice to have this in jQuery core
	nextUntil: function(expr) {
	    var match = [];
	
	    // We need to figure out which elements to push onto the array
	    this.each(function(){
	        // Traverse through the sibling nodes
	        for( var i = this.nextSibling; i; i = i.nextSibling ) {
	            // Make sure that we're only dealing with elements
	            if ( i.nodeType != 1 ) continue;
	
	            // If we find a match then we need to stop
	            if ( jQuery.filter( expr, [i] ).r.length ) break;
	
	            // Otherwise, add it on to the stack
	            match.push( i );
	        }
	    });
	
	    return this.pushStack( match );
	},
	// the plugin method itself
	Accordion: function(settings) {
		// setup configuration
		settings = jQuery.extend({}, jQuery.Accordion.defaults, {
			// define context defaults
			header: jQuery(':first-child', this)[0].tagName // take first childs tagName as header
		}, settings);

		// calculate active if not specified, using the first header
		var container = this,
			active = settings.active
				? jQuery(settings.active, this)
				: settings.active === false
					? jQuery("<div>")
					: jQuery(settings.header, this).eq(0),
			running = 0;

		container.find(settings.header)
			.not(active || "")
			.nextUntil(settings.header)
			.hide();
		active.addClass(settings.selectedClass);

		function clickHandler(event) {
			// get the click target
			var clicked = jQuery(event.target);
			
			// due to the event delegation model, we have to check if one
			// of the parent elements is our actual header, and find that
			if ( clicked.parents(settings.header).length ) {
				while ( !clicked.is(settings.header) ) {
					clicked = clicked.parent();
				}
			}
			
			var clickedActive = clicked[0] == active[0];
			
			// if animations are still active, or the active header is the target, ignore click
			if(running || (settings.alwaysOpen && clickedActive) || !clicked.is(settings.header))
				return;

			// switch classes
			active.toggleClass(settings.selectedClass);
			if ( !clickedActive ) {
				clicked.addClass(settings.selectedClass);
			}

			// find elements to show and hide
			var toShow = clicked.nextUntil(settings.header),
				toHide = active.nextUntil(settings.header),
				data = [clicked, active, toShow, toHide];
			active = clickedActive ? jQuery([]) : clicked;
			// count elements to animate
			running = toHide.size() + toShow.size();
			var finished = function(cancel) {
				running = cancel ? 0 : --running;
				if ( running )
					return;

				// trigger custom change event
				container.trigger("change", data);
			};
			// TODO if hideSpeed is set to zero, animations are crappy
			// workaround: use hide instead
			// solution: animate should check for speed of 0 and do something about it
			if ( settings.animated ) {
				if ( !settings.alwaysOpen && clickedActive ) {
					toShow.slideToggle(settings.showSpeed);
					finished(true);
				} else {
					toHide.filter(":hidden").each(finished).end().filter(":visible").slideUp(settings.hideSpeed, finished);
					toShow.slideDown(settings.showSpeed, finished);
				}
			} else {
				if ( !settings.alwaysOpen && clickedActive ) {
					toShow.toggle();
				} else {
					toHide.hide();
					toShow.show();
				}
				finished(true);
			}

			return false;
		};
		function activateHandlder(event, index) {
			// call clickHandler with custom event
			clickHandler({
				target: jQuery(settings.header, this)[index]
			});
		};

		return container
			.bind(settings.event, clickHandler)
			.bind("activate", activateHandlder);
	},
	// programmatic triggering
	activate: function(index) {
		return this.trigger('activate', [index || 0]);
	}
});

jQuery.Accordion = {};
jQuery.extend(jQuery.Accordion, {
	defaults: {
		selectedClass: "selected",
		showSpeed: 'slow',
		hideSpeed: 'fast',
		alwaysOpen: true,
		animated: true,
		event: "click"
	},
	setDefaults: function(settings) {
		jQuery.extend(jQuery.Accordion.defaults, settings);
	}
});
/*
 * Tooltip - jQuery plugin  for styled tooltips
 *
 * Copyright (c) 2006 J�rn Zaefferer, Stefan Petre
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.tooltip.js 1086 2007-01-15 12:28:56Z joern $
 *
 */

/**
 * Display a customized tooltip instead of the default one
 * for every selected element. The tooltip behaviour mimics
 * the default one, but lets you style the tooltip and
 * specify the delay before displaying it.
 *
 * In addition, it displays the href value, if it is available.
 * 
 * To style the tooltip, use these selectors in your stylesheet:
 *
 * #tooltip - The tooltip container
 *
 * #tooltip h3 - The tooltip title
 *
 * #tooltip p.body - The tooltip body, shown when using showBody
 *
 * #tooltip p.url - The tooltip url, shown when using showURL
 *
 * @example $('a, input, img').Tooltip();
 * @desc Shows tooltips for anchors, inputs and images, if they have a title
 *
 * @example $('label').Tooltip({
 *   delay: 0,
 *   track: true,
 *   event: "click"
 * });
 * @desc Shows tooltips for labels with no delay, tracking mousemovement, displaying the tooltip when the label is clicked.
 *
 * @example // modify global settings
 * $.extend($.fn.Tooltip.defaults, {
 * 	track: true,
 * 	delay: 0,
 * 	showURL: false,
 * 	showBody: " - ",
 *  fixPNG: true
 * });
 * // setup fancy tooltips
 * $('a.pretty').Tooltip({
 * 	 extraClass: "fancy"
 * });
 $('img.pretty').Tooltip({
 * 	 extraClass: "fancy-img",
 * });
 * @desc This example starts with modifying the global settings, applying them to all following Tooltips; Afterwards, Tooltips for anchors with class pretty are created with an extra class for the Tooltip: "fancy" for anchors, "fancy-img" for images
 *
 * @param Object settings (optional) Customize your Tooltips
 * @option Number delay The number of milliseconds before a tooltip is display, default is 250
 * @option String event The event on which the tooltip is displayed, default is "mouseover", "click" works fine, too
 * @option Boolean track If true, let the tooltip track the mousemovement, default is false
 * @option Boolean showURL If true, shows the href or src attribute within p.url, default is true
 * @option String showBody If specified, uses the String to split the title, displaying the first part in the h3 tag, all following in the p.body tag, separated with <br/>s, default is null
 * @option String extraClass If specified, adds the class to the tooltip helper, default is null
 * @option Boolean fixPNG If true, fixes transparent PNGs in IE, default is false
 *
 * @name Tooltip
 * @type jQuery
 * @cat Plugins/Tooltip
 * @author J�rn Zaefferer (http://bassistance.de)
 */
(function($) {
	
	// the tooltip element
	var helper,
		// it's title part
		tTitle,
		// it's body part
		tBody,
		// it's url part
		tUrl,
		// the current tooltipped element
		current,
		// the title of the current element, used for restoring
		oldTitle,
		// timeout id for delayed tooltips
		tID;
	
	// the public plugin method
	$.fn.Tooltip = function(settings) {
		// setup configuration
		settings = $.extend({}, arguments.callee.defaults, settings);
	
		// there can be only one tooltip helper
		if( !helper ) {
			// create the helper, h3 for title, div for url
			helper = $('<div id="tooltip"><h3></h3><p class="body"></p><p class="url"></p></div>')
				// hide it at first
				.hide()
				// move to top and position absolute, to let it follow the mouse
				.css({ position: 'absolute', zIndex: "3000" })
				// add to document
				.appendTo('body');
			
			// save references to title and url elements
			tTitle = $('h3', helper);
			tBody = $('p.body', helper);
			tUrl = $('p.url', helper);
		}
		
		// bind events for every selected element with a title attribute
		$(this).filter('[@title]')
			// save settings into each element
			.each(function() {
				this.tSettings = settings;
			})
			// bind events
			.bind("mouseover", save)
			.bind(settings.event, handle);
		return this;
	};
	
	// main event handler to start showing tooltips
	function handle(event) {
		// show helper, either with timeout or on instant
		if( this.tSettings.delay )
			tID = setTimeout(show, this.tSettings.delay);
		else
			show();
		
		// if selected, update the helper position when the mouse moves
		if(this.tSettings.track)
			$('body').bind('mousemove', update);
			
		// update at least once
		update(event);
		
		// hide the helper when the mouse moves out of the element
		$(this).bind('mouseout', hide);
	}
	
	// save elements title before the tooltip is displayed
	function save() {
		// if this is the current source, or it has no title (occurs with click event), stop
		if(this == current || !this.title)
			return;
		// save current
		current = this;
		
		var source = $(this),
			settings = this.tSettings;
			
		// save title, remove from element and set to helper
		var title = oldTitle = source.attr('title');
		source.attr('title','');
		if(settings.showBody) {
			var parts = title.split(settings.showBody);
			tTitle.html(parts.shift());
			tBody.empty();
			for(var i = 0, part; part = parts[i]; i++) {
				if(i > 0)
					tBody.append("<br/>");
				tBody.append(part);
			}
			if(tBody.html())
				tBody.show();
			else
				tBody.hide();
		} else {
			tTitle.html(title);
			tBody.hide();
		}
		
		// if element has href or src, add and show it, otherwise hide it
		var href = (source.attr('href') || source.attr('src'));
		if( settings.showURL && href )
			tUrl.html(href.replace('http://', '')).show();
		else 
			tUrl.hide();
		
		// add an optional class for this tip
		if( settings.extraClass ) {
			helper.addClass(settings.extraClass);
		}
		// fix PNG background for IE
		if (settings.fixPNG && $.browser.msie ) {
			helper.each(function () {
				if (this.currentStyle.backgroundImage != 'none') {
					var image = this.currentStyle.backgroundImage;
					image = image.substring(5, image.length - 2);
					$(this).css({
						'backgroundImage': 'none',
						'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
					});
				}
			});
		}
	}
	
	// delete timeout and show helper
	function show() {
		tID = null;
		helper.show();
		update();
	}
	
	/**
	 * callback for mousemove
	 * updates the helper position
	 * removes itself when no current element
	 */
	function update(event)	{
		// if no current element is available, remove this listener
		if( current == null ) {
			$('body').unbind('mousemove', update);
			return;	
		}
		
		var left = helper[0].offsetLeft;
		var top = helper[0].offsetTop;
		if(event) {
			// position the helper 15 pixel to bottom right, starting from mouse position
			left = event.pageX + 15;
			top = event.pageY + 15;
			helper.css({
				left: left + 'px',
				top: top + 'px'
			});
		}
		
		var v = viewport(),
			h = helper[0];
		// check horizontal position
		if(v.x + v.cx < h.offsetLeft + h.offsetWidth) {
			left -= h.offsetWidth + 20;
			helper.css({left: left + 'px'});
		}
		// check vertical position
		if(v.y + v.cy < h.offsetTop + h.offsetHeight) {
			top -= h.offsetHeight + 20;
			helper.css({top: top + 'px'});
		}
	}
	
	function viewport() {
		var e = document.documentElement || {},
			b = document.body || {},
			w = window;
		function min() {
			var v = Infinity;
			for( var i = 0;  i < arguments.length;  i++ ) {
				var n = arguments[i];
				if( n && n < v ) v = n;
			}
			return v;
		}
		return {
			x: w.pageXOffset || e.scrollLeft || b.scrollLeft || 0,
			y: w.pageYOffset || e.scrollTop || b.scrollTop || 0,
			cx: min( e.clientWidth, b.clientWidth, w.innerWidth ),
			cy: min( e.clientHeight, b.clientHeight, w.innerHeight )
		};
	}
	
	// hide helper and restore added classes and the title
	function hide() {
		// clear timeout if possible
		if(tID)
			clearTimeout(tID);
		// no more current element
		current = null;
		helper.hide();
		// remove optional class
		if( this.tSettings.extraClass ) {
			helper.removeClass( this.tSettings.extraClass);
		}
		
		// restore title and remove this listener
		$(this)
			.attr('title', oldTitle)
			.unbind('mouseout', hide);
			
		// remove PNG background fix for IE
		if( this.tSettings.fixPNG && $.browser.msie ) {
			helper.each(function () {
				$(this).css({'filter': '', backgroundImage: ''});
			});
		}
	}
	
	// define global defaults, editable by client
	$.fn.Tooltip.defaults = {
		delay: 250,
		event: "mouseover",
		track: false,
		showURL: true,
		showBody: null,
		extraClass: null,
		fixPNG: false
	};

})(jQuery);/*
 * Treeview 1.2 - jQuery plugin to hide and show branches of a tree
 *
 * Copyright (c) 2006 J�rn Zaefferer, Myles Angell
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.treeview.js 1534 2007-03-15 22:28:17Z joern $
 *
 */

/**
 * Takes an unordered list and makes all branches collapsable.
 *
 * The "treeview" class is added if not already present.
 *
 * To hide branches on first display, mark their li elements with
 * the class "closed". If the "collapsed" option is used, mark intially open
 * branches with class "open".
 *
 * @example .treeview, .treeview ul { 
 * 	padding: 0;
 * 	margin: 0;
 * 	list-style: none;
 * }	
 * 
 * .treeview li { 
 * 	margin: 0;
 * 	padding: 4px 0 3px 20px;
 * }
 * 
 * .treeview li { background: url(images/tv-item.gif) 0 0 no-repeat; }
 * .treeview .collapsable { background-image: url(images/tv-collapsable.gif); }
 * .treeview .expandable { background-image: url(images/tv-expandable.gif); }
 * .treeview .last { background-image: url(images/tv-item-last.gif); }
 * .treeview .lastCollapsable { background-image: url(images/tv-collapsable-last.gif); }
 * .treeview .lastExpandable { background-image: url(images/tv-expandable-last.gif); }
 * @desc The following styles are necessary in your stylesheet. There is are alternative sets of images available.
 *
 * @example $("ul").Treeview();
 * @before <ul>
 *   <li>Item 1
 *     <ul>
 *       <li>Item 1.1</li>
 *     </ul>
 *   </li>
 *   <li class="closed">Item 2 (starts closed)
 *     <ul>
 *       <li>Item 2.1
 *         <ul>
 *           <li>Item 2.1.1</li>
 *           <li>Item 2.1.2</li>
 *         </ul>
 *       </li>
 *       <li>Item 2.2</li>
 *     </ul>
 *   </li>
 *   <li>Item 3</li>
 * </ul>
 * @desc Basic usage example
 *
 * @example $("ul").Treeview({ speed: "fast", collapsed: true});
 * @before <ul>
 *   <li class="open">Item 1 (starts open)
 *     <ul>
 *       <li>Item 1.1</li>
 *     </ul>
 *   </li>
 *   <li>Item 2
 *     <ul>
 *       <li>Item 2.1</li>
 *       <li>Item 2.2</li>
 *     </ul>
 *   </li>
 * </ul>
 * @desc Create a treeview that starts collapsed. Toggling branches is animated.
 *
 * @example $("ul").Treeview({ control: #treecontrol });
 * @before <div id="treecontrol">
 *   <a href="#">Collapse All</a>
 *   <a href="#">Expand All</a>
 *   <a href="#">Toggle All</a>
 * </div>
 * @desc Creates a treeview that can be controlled with a few links.
 * Very likely to be changed/improved in future versions.
 *
 * @param Map options Optional settings to configure treeview
 * @option String|Number speed Speed of animation, see animate() for details. Default: none, no animation
 * @option Boolean collapsed Start with all branches collapsed. Default: none, all expanded
 * @option <Content> control Container for a treecontrol, see last example.
 * @option Boolean unique Set to allow only one branch on one level to be open
 *		   (closing siblings which opening). Default: none
 * @option Function toggle Callback when toggling a branch.
 * 		   Arguments: "this" refers to the UL that was shown or hidden.
 * 		   Works only with speed option set (set speed: 1 to enable callback without animations).
 *		   Default: none
 * @option Boolean|Object store When set, stores the tree-state in a cookie when leaving/reloading the page,
 * 		   and restoring that state when loading the page. By default, no state is stored. Only one tree-per-page can be stored.
 * 	       When specifying the option as a boolean-true, the default setting for cookie-storage is used,
 * 		   saving the state for the browser session. To set a different expiration, set the option to an
 *  	   object with a "expiration" property. Refer to the cookie plugin for details about
 * 	       possible values of that object.
 * @type jQuery
 * @name Treeview
 * @cat Plugins/Treeview
 */

(function($) {

	// classes used by the plugin
	// need to be styled via external stylesheet, see first example
	var CLASSES = {
		open: "open",
		closed: "closed",
		expandable: "expandable",
		collapsable: "collapsable",
		lastCollapsable: "lastCollapsable",
		lastExpandable: "lastExpandable",
		last: "last",
		hitarea: "hitarea"
	};
	
	// styles for hitareas
	var hitareaCSS = {
		height: 15,
		width: 15,
		marginLeft: "-15px",
		"float": "left",
		cursor: "pointer"
	};
	
	// ie specific styles for hitareas
	if( $.browser.msie )
		$.extend( hitareaCSS, {
			background: "#fff",
			filter: "alpha(opacity=0)",
			display: "inline"
		});

	$.extend($.fn, {
		swapClass: function(c1, c2) {
			return this.each(function() {
				var $this = $(this);
				if ( $.className.has(this, c1) )
					$this.removeClass(c1).addClass(c2);
				else if ( $.className.has(this, c2) )
					$this.removeClass(c2).addClass(c1);
			});
		},
		replaceclass: function(c1, c2) {
			return this.each(function() {
				var $this = $(this);
				if ( $.className.has(this, c1) )
					$this.removeClass(c1).addClass(c2);
			});
		},
		Treeview: function(settings) {
		
			// currently no defaults necessary, all implicit
			settings = $.extend({}, settings);
		
			// factory for treecontroller
			function treeController(tree, control) {
				// factory for click handlers
				function handler(filter) {
					return function() {
						// reuse toggle event handler, applying the elements to toggle
						// start searching for all hitareas
						toggler.apply( $("div." + CLASSES.hitarea, tree).filter(function() {
							// for plain toggle, no filter is provided, otherwise we need to check the parent element
							return filter ? $(this).parent("." + filter).length : true;
						}) );
						return false;
					}
				}
				// click on first element to collapse tree
				$(":eq(0)", control).click( handler(CLASSES.collapsable) );
				// click on second to expand tree
				$(":eq(1)", control).click( handler(CLASSES.expandable) );
				// click on third to toggle tree
				$(":eq(2)", control).click( handler() ); 
			}
		
			// handle toggle event
			function toggler() {
				// this refers to hitareas, we need to find the parent lis first
				$( this ).parent()
					// swap classes
					.swapClass( CLASSES.collapsable, CLASSES.expandable )
					.swapClass( CLASSES.lastCollapsable, CLASSES.lastExpandable )
					// find child lists
					.find( ">ul" )
					// toggle them
					.toggle( settings.speed, settings.toggle );
				if ( settings.unique ) {
					$( this ).parent()
						.siblings()
						.replaceclass( CLASSES.collapsable, CLASSES.expandable )
						.replaceclass( CLASSES.lastCollapsable, CLASSES.lastExpandable )
						.find( ">ul" )
						.hide( settings.speed, settings.toggle );
				}
			}
	
			// add treeview class to activate styles
			this.addClass("treeview");
			
			// mark last tree items
			$("li:last-child", this).addClass(CLASSES.last);
			
			// collapse whole tree, or only those marked as closed, anyway except those marked as open
			$( (settings.collapsed ? "li" : "li." + CLASSES.closed) + ":not(." + CLASSES.open + ") > ul", this).hide();
			
			// find all tree items with child lists
			var branches = $("li[>ul]", this);
			
			function serialize() {
				var data = [];
				branches.each(function(i, e) {
					data[i] = settings.collapsed
						? $(e).is("[>ul:visible]")
							? !$(e).is("." + CLASSES.open)
								? 1
								: 0
							: $(e).is("." + CLASSES.open)
								? 1
								: 0
						: $(e).is("[>ul:hidden]")
							? !$(e).is("." + CLASSES.closed)
								? 1
								: 0
							: $(e).is("." + CLASSES.closed)
								? 1
								: 0;
				});
				$.cookie("treestorage", data.join(""), settings.store.expiration );
			}
			
			function deserialize() {
				var stored = $.cookie("treestorage");
				if ( stored ) {
					var data = stored.split("");
					branches.each(function(i, e) {
						if( parseInt(data[i]) ) {
							$(e).find(">ul").toggle();
						}
					});
				}
			}
			
			if (settings.store)	{
				deserialize();
				$(window).unload(serialize);
			}
			
			// handle closed ones first
			branches.filter("[>ul:hidden]")
					.addClass(CLASSES.expandable)
					.swapClass(CLASSES.last, CLASSES.lastExpandable);
					
			// handle open ones
			branches.not("[>ul:hidden]")
					.addClass(CLASSES.collapsable)
					.swapClass(CLASSES.last, CLASSES.lastCollapsable);
					
			// append hitarea
			branches.prepend("<div class=\"" + CLASSES.hitarea + "\">")
				// find hitarea
				.find("div." + CLASSES.hitarea)
				// apply styles to hitarea
				.css(hitareaCSS)
				// apply toggle event to hitarea
				.toggle( toggler, toggler );
				
			// if control option is set, create the treecontroller
			if ( settings.control )
				treeController(this, settings.control);
			
			return this;
		}
	});
})(jQuery);/*
 * Form Validation: jQuery form validation plug-in v1.0 beta 2
 *
 * Copyright (c) 2006 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

/**
 * Validates either a single form on submit or a list of elements on a user-defined event.
 *
 * The normal behaviour is to validate a form when a submit button is clicked or
 * the user presses enter when an input of that form is focused.
 *
 * It is also possible to validate each individual element of that form, eg. on blur or keyup.
 *
 * @example $("#myform").validate();
 * @before <form id="myform">
 *   <input name="firstname" class="{required:true}" />
 * </form>
 * @desc Validates a form on submit. Rules are read from metadata.
 *
 * @example $("input").validate({
 * 		focusInvalid: false,
 * 		event: "blur"
 * });
 * @desc Validates all input elements on blur event (when the element looses focus).
 * Deactivates focus of invalid elements.
 *
 * @example $("#myform").validate({
 *   submitHandler: function(form) {
 *   	$(form).ajaxSubmit();
 *   }
 * });
 * @desc Uses form plugin's ajaxSubmit method to handle the form submit, while preventing
 * the default submit.
 *
 * @example $("#myform").validate({
 *  event: "keyup"
 * 	rules: {
 * 		firstname: { required: true },
 * 		age: {
 *			required: "#firstname:blank",
 * 			number: true,
 * 			minValue: 3
 * 		},
 * 		password: {
 * 			required: function() {
 * 				return $("#age").val() < 18;
 * 			},
 * 			minLength: 5,
 * 			maxLength: 32
 * 		}
 * 	},
 *  messages {
 * 		password: {
 * 			required: "Your password is required because you are not yet 18 years or older."
 * 			minLength: "Please enter a password at least 5 characters long.",
 * 			maxLength: "Please enter a password no longer then 32 characters long."
 * 		},
 *		age: "Please specify your age as a number (at least 3)."
 * 	}
 * });
 * @desc Validate a form on submit and each element on keyup. Rules are specified
 * for three elements, and a message is customized for the "password" and the
 * "age" elements. Inline rules are ignored. The password is only required when the age is lower
 * then 18. The age is only required when the firstname is blank.
 *
 * @example $("#myform").validate({
 *   errorClass: "invalid",
 *   errorLabelContainer: $("#messageBox"),
 *   wrapper: "li"
 * });
 * @before <ul id="messageBox"></ul>
 * <form id="myform" action="/login" method="post">
 *   <label>Firstname</label>
 *   <input name="fname" class="{required:true}" />
 *   <label>Lastname</label>
 *   <input name="lname" title="Your lastname, please!" class="{required:true}" />
 * </form>
 * @result <ul id="messageBox">
 *   <li><label for="fname" class="invalid">Please specify your firstname!</label></li>
 *   <li><label for="lname" class="invalid">Your lastname, please!</label></li>
 * </ul>
 * <form id="myform" action="/login" method="post">
 *   <label>Firstname</label>
 *   <input name="fname" class="{required:true} invalid" />
 *   <label>Lastname</label>
 *   <input name="lname" title="Your lastname, please!" class="{required:true} invalid" />
 * </form>
 * @desc Validates a form on submit. The class used to search, create and display
 * error labels is changed to "invalid". This is also added to invalid elements.
 *
 * All error labels are displayed inside an unordered list with the ID "messageBox", as
 * specified by the jQuery object passed as errorContainer option. All error elements
 * are wrapped inside an li element, to create a list of messages.
 *
 * To ease the setup of the form, debug option is set to true, preventing a submit
 * of the form no matter of being valid or not.
 *
 *
 * @example $("#myform").validate({
 * 	errorPlacement: function(error, element) {
 * 		error.appendTo( element.parent("td").next("td") );
 * 	}
 * });
 * @before <form id="myform" action="/login" method="post">
 * 	<table>
 * 		<tr>
 * 			<td><label>Firstname</label>
 * 			<td><input name="fname" class="{required:true}" /></td>
 * 			<td></td>
 * 		</tr>
 * 		<tr>
 * 			<td><label>Lastname</label></td>
 * 			<td><input name="lname" title="Your lastname, please!" class="{required:true}" /></td>
 * 			<td></td>
 * 		</tr>
 * 	</table>
 * </form>
 * @result <form id="myform" action="/login" method="post">
 * 	<table>
 * 		<tr>
 * 			<td><label>Firstname</label>
 * 			<td><input name="fname" class="{required:true}" /></td>
 * 			<td><label for="fname" class="invalid">Please specify your firstname!</label></td>
 * 		</tr>
 * 		<tr>
 * 			<td><label>Lastname</label></td>
 * 			<td><input name="lname" title="Your lastname, please!" class="{required:true}" /></td>
 * 			<td><label for="lname" class="invalid">Your lastname, please!</label></td>
 * 		</tr>
 * 	</table>
 * </form>
 * @desc Validates a form on submit. Customizes the placement of the generated labels
 * by appending them to the next table cell.
 *
 * @example $("#myform").validate({
 *   errorContainer: $("#messageBox1, #messageBox2"),
 *   errorLabelContainer: $("#messageBox1 ul"),
 *   wrapper: "li",
 * });
 * @before <div id="messageBox1">
 *   <h3>The are errors in your form!</h3>
 *   <ul></ul>
 * </div>
 * <form id="myform" action="/login" method="post">
 *   <label>Firstname</label>
 *   <input name="fname" class="{required:true}" />
 *   <label>Lastname</label>
 *   <input name="lname" title="Your lastname, please!" class="{required:true}" />
 * </form>
 * <div id="messageBox2">
 *   <h3>The are errors in your form, see details above!</h3>
 * </div>
 * @result <ul id="messageBox">
 *   <li><label for="fname" class="error">Please specify your firstname!</label></li>
 *   <li><label for="lname" class="error">Your lastname, please!</label></li>
 * </ul>
 * <form id="myform" action="/login" method="post">
 *   <label>Firstname</label>
 *   <input name="fname" class="{required:true} error" />
 *   <label>Lastname</label>
 *   <input name="lname" title="Your lastname, please!" class="{required:true} error" />
 * </form>
 * @desc Validates a form on submit. Similar to the above example, but with an additional
 * container for error messages. The elements given as the errorContainer are all shown
 * and hidden when errors occur. But the error labels themselve are added to the element(s)
 * given as errorLabelContainer, here an unordered list. Therefore the error labels are
 * also wrapped into li elements (wrapper option).
 *
 * @param Map options Optional settings to configure validation
 * @option String errorClass Use this class to look for existing error labels and add it to
 *		invalid elements. Default: "error"
 * @option String wrapper Wrap error labels with the specified element, eg "li". Default: none
 * @option Boolean debug If true, the form is not submitted and certain errors are display on the console (requires Firebug or Firebug lite). Default: none
 * @option Boolean focusInvalid Focus the last active or first invalid element. Disable for blur-validation, crashes IE otherwise. Default: true
 * @option Function submitHandler Callback for handling the actual
 *		submit when the form is valid. Gets the form as the only argmument. Default: normal form submit
 * @option Map messages Key/value pairs defining custom messages.
 *		Key is the ID or name (for radio/checkbox inputs) of an element,
 *		value the message to display for that element. Instead of a plain message
 *		another map with specific messages for each rule can be used.
 *		Can be specified for one or more elements. Can be overriden by
 *		specifying the title attribute on the element.
 *      Default: none, the default message for the method is used.
 * @option Map rules Key/value pairs defining custom rules.
 *		Key is the ID or name (for radio/checkbox inputs) of an element,
 *		value is an object consisting of rule/parameter pairs, eg. {required: true, min: 3}
 *		Default: none, rules are read from metadata via metadata plugin
 * @option String event The event on which to validate. If anything is specified, like
 *		blur or keyup, each element is validated on that event. Default: none
 * @option Boolean onsubmit Validate the form on submit. Set to false to use only other
 *		events for validation (option event). Default: true
 * @option String meta In case you use metadata for other plugins, too, you
 *		want to wrap your validation rules
 *		into their own object that can be specified via this option. Default: none
 * @option jQuery errorContainer Hide and show this container when validating. Default: none
 * @option jQuery errorLabelContainer Search and append error labels to this container, and show and hide it accordingly. Default: none
 * @option Function showErrors A custom message display handler. Gets the map of errors as the
 *		first argument and a refernce to the validator object as the second.
 * 		You can trigger (in addition to your own messages) the default behaviour by calling
 * 		the defaultShowErrors() method of the validator.
 * 		Default: none, uses built-in message disply.
 * @option Function errorPlacement Used to customize placement of created error labels.
 *		First argument: jQuery object containing the created error label
 *		Second argument: jQuery object containing the invalid element
 *		Default: Places the error label after the invalid element
 *
 * @name validate
 * @type $.validator
 * @cat Plugins/Validate
 */

jQuery.extend(jQuery.fn, {
	validate: function( options ) {
		var validator = new jQuery.validator( options, this );
		
		// select all valid inputs inside the form (no submit or reset buttons)
		// and listen for focus events to save reference to last focused element
		validator.elements = this.find(":input:not(:submit):not(:reset)").focus(function() {
			validator.lastActive = this;
		});
		
		if ( validator.settings.onsubmit ) {
			// validate the form on submit
			this.submit( function( event ) {
				if ( validator.settings.debug )
					// prevent form submit to be able to see console output
					event.preventDefault();
				return validator.form();
			});
		}
		
		if ( validator.settings.event ) {
			// validate all elements on some other event like blur or keypress
			validator.elements.bind( validator.settings.event, function() {
				validator.element(this);
			} );
		}
		
		return validator;
	},
	// destructive add
	push: function( t ) {
		return this.setArray( jQuery.merge( this.get(), t ) );
	},
	forId: function( id ) {
		return this.filter( "[@for=" + id + "]" );
	}
});

/**
 * Custom expression to filter for blank fields.
 *
 * @example jQuery("input:blank").length
 * @before <input value="" /><input value="  " /><input value="abc" />
 * @result 2
 *
 * @property
 * @type String
 * @name :blank
 * @cat Plugins/Validate
 */
 
/**
 * Custom expression to filter for filled fields.
 *
 * @example jQuery("input:filled").length
 * @before <input value="" /><input value="  " /><input value="abc" />
 * @result 1
 *
 * @property
 * @type String
 * @name :filled
 * @cat Plugins/Validate
 */
jQuery.extend(jQuery.expr[":"], {
	blank: "!jQuery.trim(a.value)",
	filled: "!!jQuery.trim(a.value)"
});

// constructor for validator
jQuery.validator = function( options, form ) {

	this.settings = jQuery.extend( {}, jQuery.validator.defaults, options );
	
	this.currentForm = form[0];
	this.labelContainer = this.settings.errorLabelContainer;
	this.errorContext = this.labelContainer.length && this.labelContainer || form;
	this.containers = this.settings.errorContainer.add( this.settings.errorLabelContainer );
	
	this.reset();
};

jQuery.extend(jQuery.validator, {
	
	defaults: {
		messages: {},
		errorClass: "error",
		focusInvalid: true,
		errorContainer: jQuery( [] ),
		errorLabelContainer: jQuery( [] ),
		onsubmit: true
	},
	
	/**
	 * Modify default settings for validation.
	 *
	 * @example jQuery.validator.setDefaults({
	 * 	debug: true
	 * );
	 * @desc Sets the debug setting for all validation calls following.
	 *
	 * @param Object<String, Object> settings
	 * @name jQuery.validator.setDefaults
	 * @type undefined
	 * @cat Plugins/Validate
	 */
	setDefaults: function(settings) {
		jQuery.extend( jQuery.validator.defaults, settings );
	},
	
	/**
	 * Default messages for all default methods.
	 *
	 * User addMethod() to add methods with messages.
	 *
	 * Replace these messages for localization.
	 *
	 * @property
	 * @type String
	 * @name jQuery.validator.messages
	 * @cat Plugins/Validate
	 */
	messages: {
		required: "This field is required.",
		maxLength: "Please enter a value no longer then {0} characters.",
		minLength: "Please enter a value of at least {0} characters.",
		rangeLength: "Please enter a value between {0} and {1} characters long.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date (ISO).",
		dateDE: "Bitte geben Sie ein g�ltiges Datum ein.",
		number: "Please enter a valid number.",
		numberDE: "Bitte geben Sie eine Nummer ein.",
		digits: "Please enter only digits",
		equalTo: "Please enter the same value again.",
		rangeValue: "Please enter a value between {0} and {1}.",
		maxValue: "Please enter a value less than or equal to {0}.",
		minValue: "Please enter a value greater than or equal to {0}."
	},
	
	prototype: {
	
		/**
		 * Validate on instant the entire form.
		 *
		 * @example $("#myform").validate().form();
		 * @desc Triggers form validation programmatcitally.
		 *
		 * @name jQuery.validator.protoype.form
		 * @type Boolean True when the form is valid, otherwise false
		 * @cat Plugins/Validate
		 */
		form: function() {
			this.prepareForm();
			for ( var i = 0, element; element = this.elements[i++]; ) {
				this.check( element );
			}
			return this.valid();
		},
		
		/**
		 * Validate on instant a single element.
		 *
		 * @example $("#myform").validate().element( "#myselect" );
		 * @desc Triggers validation on a single element programmatically.
		 *
		 * @param String|Element element A selector or an element to validate
		 *
		 * @name jQuery.validator.protoype.element
		 * @type Boolean True when the form is valid, otherwise false
		 * @cat Plugins/Validate
		 */
		element: function( element ) {
			this.prepareElement( element );
			this.check( element );
			this.showErrors();
		},
		
		/**
		 * Show the specified messages.
		 *
		 * @example var validator = $("#myform").validate();
		 * validator.showErrors({"firstname": "I know that your firstname is Pete, Pete!"});
		 * @desc Adds and shows error message programmatically.
		 *
		 * @param Map errors One or more key/value pairs of identifiers (IDs or names) and messages
		 *
		 * @name jQuery.validator.protoype.showErrors
		 * @cat Plugins/Validate
		 */
		showErrors: function(errors) {
			if(errors)
				jQuery.extend(this.errorList, errors);
			this.settings.showErrors
				? this.settings.showErrors( this.errorList, this )
				: this.defaultShowErrors();
		},
		
		/**
		 * Resets the controlled form, including resetting input fields
		 * to their original value (requires form plugin), removing classes
		 * indicating invalid elements and hiding error messages.
		 *
		 * @example var validator = $("#myform").validate();
		 * validator.resetForm();
		 * @desc Reset the form controlled by this validator.
		 *
		 * @name jQuery.validator.protoype.resetForm
		 * @cat Plugins/Validate
		 */
		resetForm: function() {
			if( jQuery.fn.resetForm )
				jQuery( this.currentForm ).resetForm();
			this.prepareForm();
			this.hideErrors();
			this.elements.removeClass( this.settings.errorClass );
		},
		
		clean: function( selector ) {
			return jQuery( selector )[0];
		},
		
		errors: function() {
			return jQuery( "label." + this.settings.errorClass, this.errorContext );
		},
		
		reset: function( element ) {
			this.errorList = {};
			this.toShow = $( [] );
			this.toHide = $( [] );
		},
		
		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().push( this.containers );
			this.toShow.push( this.containers );
		},
		
		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errors().forId( this.findId( this.clean( element ) ) );
		},
	
		check: function( element ) {
			element = this.clean( element );
			jQuery( element ).removeClass( this.settings.errorClass );
			var rules = this.rules( element );
			for( var i = 0, rule; rule = rules[i++]; ) {
				try {
					var result = jQuery.validator.methods[rule.method]( jQuery.trim(element.value), element, rule.parameters );
					if( result === -1 )
						break;
					if( !result ) {
						jQuery(element).addClass( this.settings.errorClass );
						this.formatAndAdd( rule, element);
						break;
					}
				} catch(e) {
					this.settings.debug && window.console && console.error("exception occured when checking element " + element.id
						 + ", check the '" + rule.method + "' method");
					throw e;
				}
			}
		},
		
		message: function( id, rule ) {
			var m = this.settings.messages[id];
			return m && (m.constructor == String
				? m
				: m[rule.method]);
		},
		
		formatAndAdd: function( rule, element) {
			var id = this.findId( element ),
				param = rule.parameters;
			this.errorList[id] = (
					element.title
					|| this.message(id, rule)
					|| jQuery.validator.messages[rule.method]
					|| "<strong>Warning: No message defined for " + id + "</strong>"
				)
				.replace( "{0}", (param.constructor == Array
					? param[0]
					: param) || "" )
				.replace( "{1}", param[1] || "" );
		},
		
		valid: function() {
			if ( this.countErrors() ) {
				this.showErrors();
				return false;
			} else {
				this.hideErrors();
				if ( this.settings.submitHandler ) {
					this.settings.submitHandler( this.currentForm );
					return false;
				}
				return true;
			}
		},
		
		countErrors: function() {
			var count = 0;
			jQuery.each( this.errorList, function() {
				count++;
			} );			
			return count;
		},
		
		hideErrors: function() {
			this.toggle( "Hide" );
		},
		
		toggle: function(that) {
			var self = this;
			function which() {
				return self["to" + that];
			}
			if ( this.settings.wrapper ) {
				which().push( which().parents( this.settings.wrapper ) );
			}
			which()[that.toLowerCase()]();
			return this;
		},
		
		defaultShowErrors: function() {
			var first = true;
			for ( var elementID in this.errorList ) {
				if( first && this.settings.focusInvalid ) {
					// check if the last focused element is invalid
					if( this.lastActive && this.errorList[this.lastActive.id])
						// focus it
						this.lastActive.focus();
					// otherwise, find the firt invalid lement
					else {
						// IE throws an exception when focusing hidden element
						try {
							// focus the first invalid element
							var element = jQuery("#"+elementID);
							// radio/checkbox doesn't have an ID
							if(element.length)
								element[0].focus();
						} catch(e) { this.settings.debug && window.console && console.error(e); }
					}
					first = false;
				}
				// display the error label for the first failed method
				this.showError( elementID, this.errorList[elementID] );
			}
			
			this.toHide = this.toHide.not( this.toShow );
			this.toggle( "Hide" ).toggle( "Show" );
		},
		
		showError: function(id, message) {
			var error = this.errors().forId(id);
			if ( error.length ) {
				// check if we have a generated label, replace the message then
				if( error.attr("generated") ) {
					error.html(message);
				}
			} else {
				// create label
				error = jQuery("<label>").attr({"for": id, generated: true}).addClass(this.settings.errorClass).html(message);
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					error = error.hide().show().wrap("<" + this.settings.wrapper + ">").parent();
				}
				if ( !this.labelContainer.append(error).length )
					this.settings.errorPlacement
						? this.settings.errorPlacement(error, jQuery("#" + id) )
						: error.insertAfter("#" + id);
			}
			this.toShow.push(error);
		},
		
		rules: function( element ) {
			if( !this.data( element ) )
				return [];
			var rules = [];
			jQuery.each( this.data(element), function(key, value) {
				rules[rules.length] = {
					method: key,
					parameters: value
				};
			} );
			return rules;
		},
		
		data: function( element ) {
			return this.settings.rules
				? this.settings.rules[this.findId(element)]
				: this.settings.meta
					? jQuery(element).data()[ this.settings.meta ]
					: jQuery(element).data();
		},
		
		findId: function(element) {
			var id = ( /radio|checkbox/i.test(element.type) )
				? element.name
				: element.id;
			// generate id when none is found
			if(!id) {
				var formId = element.form.id,
					idcleanup = /[^a-zA-Z0-9\-_]/g;
				id = element.id = (formId ? formId.replace(idcleanup, "") : "") + element.name.replace(idcleanup, "");
			}
			return id;
		}
		
	},
	
	getLength: function(value, element) {
		switch( element.nodeName.toLowerCase() ) {
		case 'select':
			return jQuery("option:selected", element).length;
		case 'input':
			if( /radio|checkbox/i.test(element.type) )
				return jQuery(element.form || document).find('[@name=' + element.name + ']:checked').length;
		}
		return value.length;
	},
	
	depend: function(param, element) {
		return this.dependTypes[typeof param]
			? this.dependTypes[typeof param](param, element)
			: true;
	},
	
	dependTypes: {
		"boolean": function(param, element) {
			return param;
		},
		"string": function(param, element) {
			return !!jQuery(param, element.form).length;
		},
		"function": function(param, element) {
			return param(element);
		}
	},
	
	/**
	 * Defines a standard set of useful validation methods.
	 * 
	 * Use jQuery.validator.addMethod() to add your own methods.
	 *
	 * If "all kind of text inputs" is mentioned for any if the methods defined here,
	 * it refers to input elements of type text, password and file and textareas.
	 *
	 * @param String value The trimmed value of the element, eg. the text of a text input (trimmed: whitespace removed at start and end)
	 * @param Element element the input element itself, to check for content of attributes other then value
	 * @param Object paramater Some parameter, like a number for min/max rules
	 *
	 * @property
	 * @name jQuery.validator.methods
	 * @type Object<String, Function(String,Element,Object):Boolean>
	 * @cat Plugins/Validate/Methods
	 */
	methods: {
	
		/**
		 * Return false if the element is empty.
		 *
		 * Works with all kind of text inputs, selects, checkboxes and radio buttons.
		 *
		 * To force a user to select an option from a select box, provide
		 * an empty options like <option value="">Choose...</option>
		 *
		 * @example <input name="firstname" class="{required:true}" />
		 * @desc Declares an input element that is required.
		 *
		 * @example <input id="other" type="radio" />
		 * <input name="details" class="{required:'#other:checked'}" />
		 * @desc Declares an input element required, but only if a radio button with id "other" is checked.
		 * In other words: As long the "#other" isn't checked, the details field is valid.
		 *
		 * @example jQuery("#myform").validate({
		 * 	rules: {
		 * 		details: {
		 * 			required: function(element) {
		 *				return jQuery("#other").is(":checked") && jQuery("#other2").is(":checked");
		 *			}
		 *		}
		 * 	}
		 * });
		 * @before <form id="myform">
		 * 	<input id="other" type="checkbox" />
		 * 	<input id="other2" type="checkbox" />
		 * 	<input name="details" />
		 * </form>
		 * @desc Declares an input element "details", required, but only if two other fields
		 * are checked.
		 *
		 * @example <fieldset>
		 * 	<legend>Family</legend>
		 * 	<label for="family_single">
		 * 		<input  type="radio" id="family_single" value="s" name="family" validate="required:true" />
		 * 		Single
		 * 	</label>
		 * 	<label for="family_married">
		 * 		<input  type="radio" id="family_married" value="m" name="family" />
		 * 		Married
		 * 	</label>
		 * 	<label for="family_divorced">
		 * 		<input  type="radio" id="family_divorced" value="d" name="family" />
		 * 		Divorced
		 * 	</label>
		 * 	<label for="family" class="error">Please select your family status.</label>
		 * </fieldset>
		 * @desc Specifies a group of radio elements. The validation rule is specified only for the first
		 * element of the group.
		 *
		 * @param String value The value of the element to check
		 * @param Element element The element to check
		 * @param Boolean|String|Function param A boolean "true" makes a field always required; An expression (String)
		 * is evaluated in the context of the element's form, making the field required only if the expression returns
		 * more then one element. The function is executed with the element as it's only argument: If it returns true,
		 * the element is required.
		 *
		 * @name jQuery.validator.methods.required
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		required: function(value, element, param) {
			// check if dependency is met
			if ( !jQuery.validator.depend(param, element) )
				return -1;
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				var options = jQuery("option:selected", element);
				return options.length > 0 && ( element.type == "select-multiple" || options[0].value.length > 0);
			case 'input':
				switch( element.type.toLowerCase() ) {
				case 'checkbox':
				case 'radio':
					return jQuery.validator.getLength(value, element) > 0;
				}
			default:
				return value.length > 0;
			}
		},
	
		/**
		 * Return false, if the element is
		 *
		 * - some kind of text input and its value is too short
		 *
		 * - a set of checkboxes has not enough boxes checked
		 *
		 * - a select and has not enough options selected
		 *
		 * Works with all kind of text inputs, checkboxes and select.
		 *
		 * @example <input name="firstname" class="{minLength:5}" />
		 * @desc Declares an optional input element with at least 5 characters (or none at all).
		 *
		 * @example <input name="firstname" class="{required:true,minLength:5}" />
		 * @desc Declares an input element that must have at least 5 characters.
		 *
		 * @example <fieldset>
		 * 	<legend>Spam</legend>
		 * 	<label for="spam_email">
		 * 		<input type="checkbox" id="spam_email" value="email" name="spam" validate="required:true,minLength:2" />
		 * 		Spam via E-Mail
		 * 	</label>
		 * 	<label for="spam_phone">
		 * 		<input type="checkbox" id="spam_phone" value="phone" name="spam" />
		 * 		Spam via Phone
		 * 	</label>
		 * 	<label for="spam_mail">
		 * 		<input type="checkbox" id="spam_mail" value="mail" name="spam" />
		 * 		Spam via Mail
		 * 	</label>
		 * 	<label for="spam" class="error">Please select at least two types of spam.</label>
		 * </fieldset>
		 * @desc Specifies a group of checkboxes. To validate, at least two checkboxes must be selected.
		 *
		 * @param Number min
		 * @name jQuery.validator.methods.min
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		minLength: function(value, element, param) {
			var length = jQuery.validator.getLength(value, element);
			return !jQuery.validator.methods.required(value, element) || length >= param;
		},
	
		/**
		 * Return false, if the element is
		 *
		 * - some kind of text input and its value is too big
		 *
		 * - a set of checkboxes has too many boxes checked
		 *
		 * - a select and has too many options selected
		 *
		 * Works with all kind of text inputs, checkboxes and selects.
		 *
		 * @example <input name="firstname" class="{maxLength:5}" />
		 * @desc Declares an input element with at most 5 characters.
		 *
		 * @example <input name="firstname" class="{required:true,maxLength:5}" />
		 * @desc Declares an input element that must have at least one and at most 5 characters.
		 *
		 * @param Number max
		 * @name jQuery.validator.methods.max
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		maxLength: function(value, element, param) {
			var length = jQuery.validator.getLength(value, element);
			return !jQuery.validator.methods.required(value, element) || length <= param;
		},
		
		/**
		 * Return false, if the element is
		 *
	     * - some kind of text input and its value is too short or too long
	     *
	     * - a set of checkboxes has not enough or too many boxes checked
	     *
	     * - a select and has not enough or too many options selected
	     *
	     * Works with all kind of text inputs, checkboxes and selects.
	     *
		 * @example <input name="firstname" class="{rangeLength:[3,5]}" />
		 * @desc Declares an optional input element with at least 3 and at most 5 characters (or none at all).
		 *
		 * @example <input name="firstname" class="{required:true,rangeLength:[3,5]}" />
		 * @desc Declares an input element that must have at least 3 and at most 5 characters.
		 *
		 * @example <select id="cars" class="{required:true,rangeLength:[2,3]}" multiple="multiple">
		 * 	<option value="m_sl">Mercedes SL</option>
		 * 	<option value="o_c">Opel Corsa</option>
		 * 	<option value="vw_p">VW Polo</option>
		 * 	<option value="t_s">Titanic Skoda</option>
		 * </select>
		 * @desc Specifies a select that must have at least two but no more then three options selected.
		 *
	     * @param Array<Number> min/max
	     * @name jQuery.validator.methods.rangeLength
	     * @type Boolean
	     * @cat Plugins/Validate/Methods
	     */
		rangeLength: function(value, element, param) {
			var length = jQuery.validator.getLength(value, element);
			return !jQuery.validator.methods.required(value, element) || ( length >= param[0] && length <= param[1] );
		},
	
		/**
		 * Return true, if the value is greater than or equal to the specified minimum.
		 *
		 * Works with all kind of text inputs.
		 *
		 * @example <input name="age" class="{minValue:16}" />
		 * @desc Declares an optional input element whose value must be at least 16 (or none at all).
		 *
		 * @example <input name="age" class="{required:true,minValue:16}" />
		 * @desc Declares an input element whose value must be at least 16.
		 *
		 * @param Number min
		 * @name jQuery.validator.methods.minValue
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		minValue: function( value, element, param ) {
			return !jQuery.validator.methods.required(value, element) || value >= param;
		},
		
		/**
		 * Return true, if the value is less than or equal to the specified maximum.
		 *
		 * Works with all kind of text inputs.
		 *
		 * @example <input name="age" class="{maxValue:16}" />
		 * @desc Declares an optional input element whose value must be at most 16 (or none at all).
		 *
		 * @example <input name="age" class="{required:true,maxValue:16}" />
		 * @desc Declares an input element whose required value must be at most 16.
		 *
		 * @param Number max
		 * @name jQuery.validator.methods.maxValue
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		maxValue: function( value, element, param ) {
			return !jQuery.validator.methods.required(value, element) || value <= param;
		},
		
		/**
		 * Return true, if the value is in the specified range.
		 *
		 * Works with all kind of text inputs.
		 *
		 * @example <input name="age" class="{rangeValue:[4,12]}" />
		 * @desc Declares an optional input element whose value must be at least 4 and at most 12 (or none at all).
		 *
		 * @example <input name="age" class="{required:true,rangeValue:[4,12]}" />
		 * @desc Declares an input element whose required value must be at least 4 and at most 12.
		 *
		 * @param Array<Number> min/max
		 * @name jQuery.validator.methods.rangeValue
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		rangeValue: function( value, element, param ) {
			return !jQuery.validator.methods.required(value, element) || ( value >= param[0] && value <= param[1] );
		},
		
		/**
		 * Return true, if the value is not a valid email address.
		 *
		 * Works with all kind of text inputs.
		 *
		 * @example <input name="email1" class="{email:true}" />
		 * @desc Declares an optional input element whose value must be a valid email address (or none at all).
		 *
		 * @example <input name="email1" class="{required:true,email:true}" />
		 * @desc Declares an input element whose value must be a valid email address.
		 *
		 * @name jQuery.validator.methods.email
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		email: function(value, element) {
			return !jQuery.validator.methods.required(value, element) || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(value);
		},
	
		/**
		 * Return true, if the value is a valid url.
		 *
		 * Works with all kind of text inputs.
		 *
		 * See http://www.w3.org/Addressing/rfc1738.txt for URL specification.
		 *
		 * @example <input name="homepage" class="{url:true}" />
		 * @desc Declares an optional input element whose value must be a valid URL (or none at all).
		 *
		 * @example <input name="homepage" class="{required:true,url:true}" />
		 * @desc Declares an input element whose value must be a valid URL.
		 *
		 * @name jQuery.validator.methods.url
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		url: function(value, element) {
			return !jQuery.validator.methods.required(value, element) || /^(https?|ftp):\/\/[A-Z0-9](\.?[A-Z0-9ÄÜÖ][A-Z0-9_\-ÄÜÖ]*)*(\/([A-Z0-9ÄÜÖ][A-Z0-9_\-\.ÄÜÖ]*)?)*(\?([A-Z0-9ÄÜÖ][A-Z0-9_\-\.%\+=&ÄÜÖ]*)?)?$/i.test(value);
		},
        
		/**
		 * Return true, if the value is a valid date. Uses JavaScripts built-in
		 * Date to test if the date is valid, and is therefore very limited.
		 *
		 * Works with all kind of text inputs.
		 *
		 * @example <input name="birthdate" class="{date:true}" />
		 * @desc Declares an optional input element whose value must be a valid date (or none at all).
		 *
		 * @example <input name="birthdate" class="{required:true,date:true}" />
		 * @desc Declares an input element whose value must be a valid date.
		 *
		 * @name jQuery.validator.methods.date
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		date: function(value, element) {
			return !jQuery.validator.methods.required(value, element) || !/Invalid|NaN/.test(new Date(value));
		},
	
		/**
		 * Return true, if the value is a valid date, according to ISO date standard.
		 *
		 * Works with all kind of text inputs.
		 *
		 * @example jQuery.validator.methods.date("1990/01/01")
		 * @result true
		 *
		 * @example jQuery.validator.methods.date("1990-01-01")
		 * @result true
		 *
		 * @example jQuery.validator.methods.date("01.01.1990")
		 * @result false
		 *
		 * @example <input name="birthdate" class="{dateISO:true}" />
		 * @desc Declares an optional input element whose value must be a valid ISO date (or none at all).
		 *
		 * @name jQuery.validator.methods.date
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		dateISO: function(value, element) {
			return !jQuery.validator.methods.required(value, element) || /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/.test(value);
		},
	
		/**
		 * Return true, if the value is a valid date. Supports german
		 * dates (29.04.1994 or 1.1.2006). Doesn't make any sanity checks.
		 *
		 * Works with all kind of text inputs.
		 *
		 * @example jQuery.validator.methods.date("1990/01/01")
		 * @result false
		 *
		 * @example jQuery.validator.methods.date("01.01.1990")
		 * @result true
		 *
		 * @example jQuery.validator.methods.date("0.1.2345")
		 * @result true
		 *
		 * @example <input name="geburtstag" class="{dateDE:true}" />
		 * @desc Declares an optional input element whose value must be a valid german date (or none at all).
		 *
		 * @name jQuery.validator.methods.dateDE
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		dateDE: function(value, element) {
			return !jQuery.validator.methods.required(value, element) || /^\d\d?\.\d\d?\.\d\d\d?\d?$/.test(value);
		},
	
		/**
		 * Return true, if the value is a valid number. Checks for
		 * international number format, eg. 100,000.59
		 *
		 * Works with all kind of text inputs.
		 *
		 * @example <input name="amount" class="{number:true}" />
		 * @desc Declares an optional input element whose value must be a valid number (or none at all).
		 *
		 * @name jQuery.validator.methods.number
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		number: function(value, element) {
			return !jQuery.validator.methods.required(value, element) || /^-?[,0-9]+(\.\d+)?$/.test(value); 
		},
	
		/**
		 * Return true, if the value is a valid number.
		 *
		 * Works with all kind of text inputs.
		 *
		 * Checks for german numbers (100.000,59)
		 *
		 * @example <input name="menge" class="{numberDE:true}" />
		 * @desc Declares an optional input element whose value must be a valid german number (or none at all).
		 *
		 * @name jQuery.validator.methods.numberDE
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		numberDE: function(value, element) {
			return !jQuery.validator.methods.required(value, element) || /^-?[\.0-9]+(,\d+)?$/.test(value);
		},
	
		/**
		 * Returns true if the value contains only digits.
		 *
		 * Works with all kind of text inputs.
		 *
		 * @example <input name="serialnumber" class="{digits:true}" />
		 * @desc Declares an optional input element whose value must contain only digits (or none at all).
		 *
		 * @name jQuery.validator.methods.digits
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		digits: function(value, element) {
			return !jQuery.validator.methods.required(value, element) || /^\d+$/.test(value);
		},
		
		/**
		 * Returns true if the value has the same value
		 * as the element specified by the first parameter.
		 *
		 * Keep the expression simple to avoid spaces when using metadata.
		 *
		 * Works with all kind of text inputs.
		 *
		 * @example <input name="email" id="email" class="{required:true,email:true'}" />
		 * <input name="emailAgain" class="{equalTo:'#email'}" />
		 * @desc Declares two input elements: The first must contain a valid email address,
		 * the second must contain the same adress, enter once more. The paramter is a
		 * expression used via jQuery to select the element.
		 *
		 * @param String selection A jQuery expression
		 * @name jQuery.validator.methods.digits
		 * @type Boolean
		 * @cat Plugins/Validate/Methods
		 */
		equalTo: function(value, element, param) {
			// strings read from metadata have typeof object, convert to string
			return value == jQuery(""+param).val();
		}
	},
	
	/**
	 * Add a new validation method. It must consist of a name (must be a legal
	 * javascript identifier), a function and a default message.
	 *
	 * Please note: While the temptation is great to
	 * add a regex method that checks it's paramter against the value,
	 * it is much cleaner to encapsulate those regular expressions
	 * inside their own method. If you need lots of slightly different
	 * expressions, try to extract a common parameter.
	 *
	 * A library of regular expressions: http://regexlib.com/DisplayPatterns.aspx
	 *
	 * @example jQuery.validator.addMethod("domain", function(value) {
	 *   return /^http://mycorporatedomain.com/.test(value);
	 * }, "Please specify the correct domain for your documents");
	 * @desc Adds a method that checks if the value starts with http://mycorporatedomain.com
	 *
	 * @example jQuery.validator.addMethod("math", function(value, element, params) {
	 *  return value == params[0] + params[1];
	 * }, "Please enter the correct value for this simple question.");
	 *
	 * @see jQuery.validator.methods
	 *
	 * @param String name The name of the method, used to identify and referencing it, must be a valid javascript identifier
	 * @param Function rule The actual method implementation, returning true if an element is valid
	 * @param String message The default message to display for this method
	 *
	 * @name jQuery.validator.addMethod
	 * @type undefined
	 * @cat Plugins/Validate
	 */
	addMethod: function(name, method, message) {
		jQuery.validator.methods[name] = method;
		jQuery.validator.messages[name] = message;
	}
});
