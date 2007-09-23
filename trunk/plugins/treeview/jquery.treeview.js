/*
 * Treeview 1.2 - jQuery plugin to hide and show branches of a tree
 *
 * Copyright (c) 2006 J�rn Zaefferer, Myles Angell
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id$
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
 * @option Boolean navigation If set, looks for the anchor that matches location.href and activates that part of the treeview it. Great for href-based state-saving. Default: false
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
		hoverClass: function(className) {
			className = className || "hover";
			return this.hover(function() {
				$(this).addClass(className);
			}, function() {
				$(this).removeClass(className);
			});
		},
		heightToggle: function(speed, callback) {
			speed ?
				this.animate({ height: "toggle" }, speed, callback) :
				this.each(function(){
					jQuery(this)[ jQuery(this).is(":hidden") ? "show" : "hide" ]();
					if(callback)
						callback.apply(this, arguments);
				});
		},
		heightHide: function(speed, callback) {
			if (speed) {
				this.animate({ height: "hide" }, speed, callback)
			} else {
				this.hide();
				if (callback)
					this.each(callback);				
			}
		},
		treeview: function(settings) {
		
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
					.heightToggle( settings.speed, settings.toggle );
				if ( settings.unique ) {
					$( this ).parent()
						.siblings()
						.replaceclass( CLASSES.collapsable, CLASSES.expandable )
						.replaceclass( CLASSES.lastCollapsable, CLASSES.lastExpandable )
						.find( ">ul" )
						.heightHide( settings.speed, settings.toggle );
				}
			}
			
			function serialize() {
				function binary(arg) {
					return arg ? 1 : 0;
				}
				var data = [];
				branches.each(function(i, e) {
					data[i] = $(e).is(":has(>ul:visible)") ? 1 : 0;
				});
				$.cookie("treestorage", data.join(""), settings.store.expiration );
			}
			
			function deserialize() {
				var stored = $.cookie("treestorage");
				if ( stored ) {
					var data = stored.split("");
					branches.each(function(i, e) {
						$(e).find(">ul")[ parseInt(data[i]) ? "show" : "hide" ]();
					});
				}
			}
			
			// add treeview class to activate styles
			this.addClass("treeview");
			
			// mark last tree items
			$("li:last-child", this).addClass(CLASSES.last);
			
			// collapse whole tree, or only those marked as closed, anyway except those marked as open
			$( (settings.collapsed ? "li" : "li." + CLASSES.closed) + ":not(." + CLASSES.open + ") > ul", this).hide();
			
			// find all tree items with child lists
			var branches = $("li:has(>ul)", this);
			
			if (settings.store)	{
				var toggleCallback = settings.toggle;
				settings.toggle = function() {
					serialize();
					if(toggleCallback) {
						toggleCallback.apply(this, arguments);
					}
				} 
				deserialize();
			}
			
			// try to open based on location.href
			if ( settings.navigation ) {
				var current = this.find("a").filter(function() { return this.href == location.href; });
				if ( current.length ) {
					current.addClass("selected").parents("ul, li").add( current.next() ).show();
				}
			}
			
			$("li:has(ul):not(:has(>a))>span", this).click(function(event) {
				if ( this == event.target ) {
					toggler.apply($(this).next());
				}
			}).add( $("a", this) ).hoverClass();
			
			// handle closed ones first
			branches.filter(":has(>ul:hidden)")
					.addClass(CLASSES.expandable)
					.swapClass(CLASSES.last, CLASSES.lastExpandable);
					
			// handle open ones
			branches.not(":has(>ul:hidden)")
					.addClass(CLASSES.collapsable)
					.swapClass(CLASSES.last, CLASSES.lastCollapsable);
					
			// append hitarea
			branches.prepend("<div class=\"" + CLASSES.hitarea + "\">")
				// find hitarea
				.find("div." + CLASSES.hitarea)
				// apply styles to hitarea
				.css(hitareaCSS)
				// apply click event to hitarea
				.click( toggler );
				
			// if control option is set, create the treecontroller
			if ( settings.control )
				treeController(this, settings.control);
			
			return this;
		}
	});
})(jQuery);