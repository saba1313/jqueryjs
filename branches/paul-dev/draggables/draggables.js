/**
 * This plugin features Drag & Drop for jQuery. It is part of Interface.
 * A documentation is available on http://interface.eyecon.ro.
 *
 * @example $("#testdiv").drag()
 *
 * @example $("#testdiv").drop({ accept: "drag" });
 * 
 * @name drop
 * @type Function
 * @cat Plugins/Interface
 */

(function($) {
	jQuery.fDrop = {
		manager: [],
		init: function(o) {

			if(!o) var o = {};			
			return this.each(function() {
				this.dropOptions = {
					accept: o.accept && o.accept.constructor == Function ? o.accept : function(dragEl) {
						return dragEl.className.match(new RegExp('(\\s|^)'+o.accept+'(\\s|$)'));	
					},
					onHover: o.onHover && o.onHover.constructor == Function ? o.onHover : false,
					onOut: o.onOut && o.onOut.constructor == Function ? o.onOut : function(drag,helper) {
						$(helper).html(helper.oldContent);					
					},
					onDrop: o.onDrop && o.onDrop.constructor == Function ? o.onDrop : false,
					greedy: o.greedy ? o.greedy : false
				}

				/* Add the reference and positions to the manager */
				d.manager.push({ item: this, over: 0, out: 1 });
			
				/* Bind the hovering events */
				$(this).hover(d.evHover,d.evOut);
				
				/* Bind the mouseover event */
				$(this).bind("mousemove", d.evMove);
				
				/* Bind the Drop event */
				$(this).bind("mouseup", d.evDrop);
				
			});
		},
		destroy: function() {
			
		},
		evMove: function(e) {
			
			if(!f.current) return;

			var o = this.dropOptions;
			
			/* Save current target, if no last target given */
			var findCurrentTarget = function(e) {
				if(e.currentTarget) return e.currentTarget;
				var element = e.srcElement;
				do {
					if(element.dropOptions) return element;
					element = element.parentNode;
				} while (element);
			}
			if(f.current && o.accept(f.current)) f.currentTarget = findCurrentTarget(e);
			
			f.evDrag.apply(document, [e]);
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
				
		},
		evHover: function(e) {

			if(!f.current) return;
			
			var o = this.dropOptions;
			
			/* Save helper content in the oldContent property */
			f.helper.oldContent = $(f.helper).html();			

			/* Fire the callback if we are dragging and the accept function returns true */
			if(o.onHover && o.accept(f.current)) o.onHover.apply(this, [f.current, f.helper]);

		},
		evOut: function(e) {

			var o = this.dropOptions;
		
			/* Fire the callback if we are dragging and the accept function returns true */
			if(f.current && o.onOut && o.accept(f.current)) o.onOut.apply(this, [f.current, f.helper]);	

		},
		evDrop: function(e) {

			var o = this.dropOptions;
			/* Fire the callback if we are dragging and the accept function returns true */
			if(f.current && o.onDrop && o.accept(f.current)) {
				if(o.greedy && !f.slowMode) {
					if(f.currentTarget == this) o.onDrop.apply(this, [f.current, f.helper]);
				} else {
					o.onDrop.apply(this, [f.current, f.helper]);	
				}
			}			

		}
	}
	
	jQuery.fDrag = {
		manager: {},
		current: null,
		position: null,
		oldPosition: null,
		currentTarget: null,
		lastTarget: null,
		helper: null,
		slowMode: false,
		init: function(o) {

			if(!o) var o = {};
			return this.each(function() {			

				/* Prepare the options */
				this.dragOptions = {
					handle : o.handle ? ($(o.handle, this).get(0) ? $(o.handle, this) : $(this)) : $(this),
					onStart : o.onStart && o.onStart.constructor == Function ? o.onStart : false,
					onStop : o.onStop && o.onStop.constructor == Function ? o.onStop : false,
					onDrag : o.onDrag && o.onDrag.constructor == Function ? o.onDrag : false,
					helper: o.helper ? o.helper : "clone",
					dragPrevention: o.dragPrevention ? o.dragPrevention : 0,
					dragPreventionOn: o.dragPreventionOn ? o.dragPreventionOn.toLowerCase().split(",") : ["input","textarea","button"],
					cursorAt: { top: ((o.cursorAt && o.cursorAt.top) ? o.cursorAt.top : 0), left: ((o.cursorAt && o.cursorAt.left) ? o.cursorAt.left : 0), bottom: ((o.cursorAt && o.cursorAt.bottom) ? o.cursorAt.bottom : 0), right: ((o.cursorAt && o.cursorAt.right) ? o.cursorAt.right : 0) },
					cursorAtIgnore: (!o.cursorAt) ? true : false, //Internal property
					iframeFix: o.iframeFix != undefined ? o.iframeFix : true,
					wrapHelper: o.wrapHelper != undefined ? o.wrapHelper : true,
					scroll: o.scroll != undefined ? o.scroll : 20,
					appendTo: o.appendTo ? o.appendTo : "parent",
					axis: o.axis ? o.axis : null,
					containment: o.containment ? (o.containment == "parent" ? this.parentNode : o.containment) : null,
					init: false //Internal property
				};
				
				if(this.dragOptions.helper == "clone" || this.dragOptions.helper == "original") {

					/* Let's save the margins for better reference */
					this.dragOptions.margins = {
						top: parseInt($(this).css("marginTop")) || 0,
						left: parseInt($(this).css("marginLeft")) || 0,
						bottom: parseInt($(this).css("marginBottom")) || 0,
						right: parseInt($(this).css("marginRight")) || 0
					};

					/* We have to add margins to our cursorAt */
					if(this.dragOptions.cursorAt.top != 0) this.dragOptions.cursorAt.top += this.dragOptions.margins.top;
					if(this.dragOptions.cursorAt.left != 0) this.dragOptions.cursorAt.left += this.dragOptions.margins.left;
					if(this.dragOptions.cursorAt.bottom != 0) this.dragOptions.cursorAt.bottom += this.dragOptions.margins.bottom;
					if(this.dragOptions.cursorAt.right != 0) this.dragOptions.cursorAt.right += this.dragOptions.margins.right;
				} else {
					this.dragOptions.margins = { top: 0, left: 0, right: 0, bottom: 0 };
				}

				/* Bind the mousedown event */
				this.dragOptions.handle.bind("mousedown", f.evClick);
				
				/* Link the original element to the handle for later reference */
				this.dragOptions.handle.get(0).dragEl = this;				
			
			});
		},
		destroy: function() {
			/* Destroy all droppables */	
		},
		evClick: function(e) {
			/* Prevent execution on defined elements */
			var targetName = (e.target) ? e.target.nodeName.toLowerCase() : e.srcElement.nodeName.toLowerCase();
			for(var i=0;i<this.dragEl.dragOptions.dragPreventionOn.length;i++) {
				if(targetName == this.dragEl.dragOptions.dragPreventionOn[i]) return false;
			}
		
			/* Set f.current to the current element */
			f.current = this.dragEl;

			/* Bind mouseup and mousemove events */
			$(document).bind("mouseup", f.evStop);
			$(document).bind("mousemove", f.evDrag);

			/* Get the original mouse position */
			f.oldPosition = (e.pageX) ? [e.pageX,e.pageY] : [e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,e.clientY + document.body.scrollTop + document.documentElement.scrollTop];
		
			return false;
		},
		evStart: function(e) {
			var o = f.current.dragOptions;

			/* get the current offset */
			o.curOffset = $(f.current).offset({ border: false });
				
			/* Append a helper div if helper is not a function */
			if(typeof o.helper == "function") {
				f.helper = o.helper(f.current);
			} else {
				/* It's not a custom helper, then clone the original element
				 * or drag the original
				 */
				if(o.helper == "clone") f.helper = $(f.current).clone()[0];
				if(o.helper == "original") f.helper = f.current;
			}
			
			/* Let's see if we have a positioned parent */
			var curParent = f.current.parentNode;
			while (curParent) {
				if(curParent.style && (curParent.style.position == "relative" || curParent.style.position == "absolute")) {
					o.positionedParent = curParent;
					o.positionedParentOffset = $(curParent).offset({ border: false });
					break;	
				}
				curParent = curParent.parentNode ? curParent.parentNode : null;
			};
			
			/* Get the current mouse position */
			f.position = (e.pageX) ? [e.pageX,e.pageY] : [e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,e.clientY + document.body.scrollTop + document.documentElement.scrollTop];
					
			/* If we want to pick the element where we clicked, we borrow cursorAt and add margins */
			if(o.cursorAtIgnore) {
				o.cursorAt.left = f.position[0] - o.curOffset.left + o.margins.left;
				o.cursorAt.top = f.position[1] - o.curOffset.top + o.margins.top;
			}
			
			/* If we have a positioned parent, we pick the draggable relative to it */
			if(o.positionedParent) {
				f.position[0] -= o.positionedParentOffset.left;
				f.position[1] -= o.positionedParentOffset.top;	
			}
			
			/* Get the containment */
			if(o.containment && o.cursorAtIgnore) {
				if(o.containment.left == undefined) {
					console.log(o.containment);
					//I'm a node, so compute top/left/right/bottom
					var conEl = $(o.containment)[0];
					var conOffset = $(o.containment).offset({ border: false });

					o.containment = {
						top: conOffset.top-(o.positionedParentOffset ? o.positionedParentOffset.top : 0)-o.margins.top,
						left: conOffset.left-(o.positionedParentOffset ? o.positionedParentOffset.left : 0)-o.margins.left,
						right: conOffset.left-(o.positionedParentOffset ? o.positionedParentOffset.left : 0)+(conEl.offsetWidth || conEl.scrollWidth)-o.margins.right,
						bottom: conOffset.top-(o.positionedParentOffset ? o.positionedParentOffset.top : 0)+(conEl.offsetHeight || conEl.scrollHeight)-o.margins.bottom
					}
				}
			}
			
			/* If cursorAt is within the helper, set slowMode to true */
			f.slowMode = (o.cursorAt && (o.cursorAt.top-o.margins.top > 0 || o.cursorAt.bottom-o.margins.bottom > 0) && (o.cursorAt.left-o.margins.left > 0 || o.cursorAt.right-o.margins.right > 0)) ? true : false;

			/* Append the helper */
			$(f.helper).css("left", o.curOffset.left+"px").css("top", o.curOffset.top+"px").css("position", "absolute").appendTo((o.appendTo == "parent" ? f.current.parentNode : o.appendTo));

			/* Remap right/bottom properties for cursorAt to left/top */
			if(o.cursorAt.right && !o.cursorAt.left) o.cursorAt.left = f.helper.offsetWidth+o.margins.right+o.margins.left - o.cursorAt.right;
			if(o.cursorAt.bottom && !o.cursorAt.top) o.cursorAt.top = f.helper.offsetHeight+o.margins.top+o.margins.bottom - o.cursorAt.bottom;

			/* Make clones on top of iframes (only if we are not in slowMode) */
			if(!f.slowMode && o.iframeFix) {
				$("iframe").each(function() {
					var curOffset = $(this).offset({ border: false });
					$("<div class='DragDropIframeFix' style='background: #fff;'></div>").css("width", this.offsetWidth+"px").css("height", this.offsetHeight+"px").css("position", "absolute").css("opacity", "0.001").css("z-index", "1000").css("top", curOffset.top+"px").css("left", curOffset.left+"px").appendTo("body");
				});				
			}
			
			/* Only after we have appended the helper, we compute the offsets
			 * for the slowMode! This is important, so the user aready see's
			 * something going on.
			 */
			if(f.slowMode) {
				var m = d.manager;
				for(var i=0;i<m.length;i++) { m[i].offset = $(m[i].item).offset({ border: false }); }
			}
		
			/* Okay, initialization is done, then set it to true */
			o.init = true;			
			
			/* Trigger the onStart callback */
			if(o.onStart) o.onStart.apply(f.current, [f.helper]);

			return false;		
		},
		evStop: function(e) {			
			var o = f.current.dragOptions;

			/* Unbind the mouse events */
			$(document).unbind("mouseup");
			$(document).unbind("mousemove");
			
			/* If init is false, don't do the following, just set properties to null */
			if(o.init == false)
				return f.current = f.oldPosition = f.position = null;
			
			/* Trigger the onStop callback */
			if(o.onStop) o.onStop.apply(f.current, [f.helper]);
			
			/* If cursorAt is within the helper, we must use our drop manager */
			if(f.slowMode) {
				var m = d.manager;
				for(var i=0;i<m.length;i++) {
					/* Let's see if the droppable is within the cursor's area, then fire onDrop */
					var cO = m[i].offset;
					if((f.position[0] > cO.left && f.position[0] < cO.left + m[i].item.offsetWidth) && (f.position[1] > cO.top && f.position[1] < cO.top + m[i].item.offsetHeight)) {
						d.evDrop.apply(m[i].item);
					}
				}
			}
				
			/* Remove helper, if it's not f.current (a clone) */
			if(f.helper != f.current) $(f.helper).remove();	
			
			/* Remove frame helpers */
			if(o.iframeFix) $("div.DragDropIframeFix").each(function() { this.parentNode.removeChild(this); });			

			/* Clear temp variables */
			o.init = false;
			f.oldPosition = f.position = f.current = f.helper = null;
			
			return false;
		},
		evDrag: function(e) {
			// check for IE mouseup when moving into the document again
			if ($.browser.msie && !e.button) return f.evStop.apply(document, [e]);

			var o = f.current.dragOptions;
			
			/* Get the current mouse position */
			f.position = (e.pageX) ? [e.pageX,e.pageY] : [e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,e.clientY + document.body.scrollTop + document.documentElement.scrollTop];
			if(o.positionedParent) {
				f.position[0] -= o.positionedParentOffset.left;
				f.position[1] -= o.positionedParentOffset.top;	
			}

			/* If position is more than x pixels from original position, start dragging */
			if( (Math.abs(f.position[0]-f.oldPosition[0]) > o.dragPrevention || Math.abs(f.position[1]-f.oldPosition[1]) > o.dragPrevention) && o.init == false)
				f.evStart.apply(f.current,[e]);			
			else {
				if(o.init == false) return false;
			}
		
			/* Trigger the onDrag callback */
			if(o.onDrag) var retPos = o.onDrag.apply(f.current, [f.helper,f.position[0],f.position[1]]);		
			/* If something came back from our callback, use it as modified position */
			if(retPos) {
				if(retPos.x) f.position[0] = retPos.x;
				if(retPos.y) f.position[1] = retPos.y;	
			}
			
			/* If cursorAt is within the helper, we must use our drop manager to look where we are */
			if(f.slowMode) {
				var m = d.manager;
				for(var i=0;i<m.length;i++) {
					/* Let's see if the droppable is within the cursor's area */
					var cO = m[i].offset;
					if((f.position[0] > cO.left && f.position[0] < cO.left + m[i].item.offsetWidth) && (f.position[1] > cO.top && f.position[1] < cO.top + m[i].item.offsetHeight)) {
						if(m[i].over == 0) { m[i].out = 0; m[i].over = 1; d.evHover.apply(m[i].item); }
					} else {
						if(m[i].out == 0) { m[i].out = 1; m[i].over = 0; d.evOut.apply(m[i].item); }
					}
				}
			}
			
			/* If wrapHelper is set to true (and we have a defined cursorAt),
			 * wrap the helper when coming to a side of the screen.
			 */
			if(o.wrapHelper && !o.cursorAtIgnore) {
				var xOffset = ((f.position[0]-o.cursorAt.left - $(window).width() + f.helper.offsetWidth+o.margins.right) - $(document).scrollLeft() > 0 || (f.position[0]-o.cursorAt.left+o.margins.left) - $(document).scrollLeft() < 0) ? (f.helper.offsetWidth+o.margins.left+o.margins.right - o.cursorAt.left * 2) : 0;
				var yOffset = ((f.position[1]-o.cursorAt.top - $(window).height() + f.helper.offsetHeight+o.margins.bottom) - $(document).scrollTop() > 0 || (f.position[1]-o.cursorAt.top+o.margins.top) - $(document).scrollTop() < 0) ? (f.helper.offsetHeight+o.margins.top+o.margins.bottom - o.cursorAt.top * 2) : 0;
			} else {
				var xOffset = 0;
				var yOffset = 0;	
			}
			
			/* Auto scrolling */
			if(o.scroll) {
				/* If we have a positioned parent, we only scroll in this one */
				if(o.positionedParent) {
					/* TODO: Extremely strange issues are waiting here..handle with care */
					if(f.position[0] - o.positionedParent.offsetWidth - o.positionedParent.scrollLeft > -10) o.positionedParent.scrollLeft += o.scroll;
					if(f.position[0] - o.positionedParent.scrollLeft < 10) o.positionedParent.scrollLeft -= o.scroll;	
					if(f.position[1] - o.positionedParent.offsetHeight - o.positionedParent.scrollTop > -10) o.positionedParent.scrollTop += o.scroll;
					if(f.position[1] - o.positionedParent.scrollTop < 10) o.positionedParent.scrollTop -= o.scroll;
				} else {
					if((f.position[1] - $(window).height()) - $(document).scrollTop() > -10) window.scrollBy(0,o.scroll);
					if(f.position[1] - $(document).scrollTop() < 10) window.scrollBy(0,-o.scroll);
					if((f.position[0] - $(window).width()) - $(document).scrollLeft() > -10) window.scrollBy(o.scroll,0);
					if(f.position[0] - $(document).scrollLeft() < 10) window.scrollBy(-o.scroll,0);
				}
			}

			/* map new helper left/top values to temp vars */
			var newTop = f.position[1]-yOffset-(o.cursorAt.top ? o.cursorAt.top : 0);
			var newLeft = f.position[0]-xOffset-(o.cursorAt.left ? o.cursorAt.left : 0);

			/* If we have a axis or containment, use it.
			 * Cannot be used with cursorAt.
			 */
			if(o.axis && o.cursorAtIgnore) {
				switch(o.axis) {
					case "horizontal":
						newTop = o.curOffset.top - o.margins.top;
						break;
					case "vertical":
						newLeft = o.curOffset.left - o.margins.left;
						break;
					default:
						var grid = [parseInt(o.axis.split("[")[1].split(",")[1]),parseInt(o.axis.split("[")[1].split(",")[0])];
						newLeft = o.curOffset.left + o.margins.left + Math.round((newLeft - o.curOffset.left - o.margins.left) / grid[0]) * grid[0];
						newTop = o.curOffset.top + o.margins.top + Math.round((newTop - o.curOffset.top - o.margins.top) / grid[1]) * grid[1];
						break;
				}					
			}
			
			/* Stick to a defined containment */
			if(o.containment && o.cursorAtIgnore) {
				if((newLeft < o.containment.left)) newLeft = o.containment.left;
				if((newTop < o.containment.top)) newTop = o.containment.top;
				if(newLeft+$(f.helper)[0].offsetWidth > o.containment.right) newLeft = o.containment.right-$(f.helper)[0].offsetWidth;
				if(newTop+$(f.helper)[0].offsetHeight > o.containment.bottom) newTop = o.containment.bottom-$(f.helper)[0].offsetHeight;
			}

			/* Stick the helper to the cursor */			
			$(f.helper).css("left", newLeft+"px").css("top", newTop+"px");
			
			return false;
		}
	}

	/* Map keyword 'f' to jQuery.fDrag for convienence */
	var f = jQuery.fDrag;
	
	/* Map keyword 'd' to jQuery.fDrop for convienence */
	var d = jQuery.fDrop;
	
	/* Extend jQuery's methods, map two of our internals */
	jQuery.fn.extend(
		{
			undrag : jQuery.fDrag.destroy,
			undrop : jQuery.fDrop.destroy,
			drag : jQuery.fDrag.init,
			drop : jQuery.fDrop.init
		}
	);
 })(jQuery);