/**
 * @author paul.bakaus
 */

(function($) {
	jQuery.fDrop = {
		manager: {},
		init: function(o) {

			if(!o)
				var o = {};	
			
			return this.each(function() {
				this.options = {
					accept: o.accept && o.accept.constructor == Function ? o.accept : function(dragEl) {
						return dragEl.className.match(new RegExp('(\\s|^)'+o.accept+'(\\s|$)'));	
					},
					onHover : o.onHover && o.onHover.constructor == Function ? o.onHover : false,
					onOut : o.onOut && o.onOut.constructor == Function ? o.onOut : false,
					onDrop : o.onDrop && o.onDrop.constructor == Function ? o.onDrop : false,
					onHoverHelper : o.onHoverHelper || false 
				}

				/* Bind the hovering events */
				$(this).hover(d.evHover,d.evOut);
				
				/* Bind the Drop event */
				$(this).bind("mouseup", d.evDrop);
				
			});
		},
		destroy: function() {
			
		},
		evHover: function(e) {

			var o = this.options;
			
			/* Fire the callback if we are dragging and the accept function returns true */
			if(f.current && o.onHover && o.accept(f.current)) o.onHover.apply(this, [f.current, f.helper]);
			if(f.current && o.onHoverHelper && o.accept(f.current)) {
				f.helper.oldContent =$(f.helper).html();
				$(f.helper).html(o.onHoverHelper);
			}

		},
		evOut: function(e) {

			var o = this.options;
			
			/* Fire the callback if we are dragging and the accept function returns true */
			if(f.current && o.onOut && o.accept(f.current)) o.onOut.apply(this, [f.current, f.helper]);	
			if(f.current && o.onHoverHelper && o.accept(f.current)) {
				$(f.helper).html(f.helper.oldContent);
			}	

		},
		evDrop: function(e) {

			var o = this.options;
			
			/* Fire the callback if we are dragging and the accept function returns true */
			if(f.current && o.onDrop && o.accept(f.current)) o.onDrop.apply(this, [f.current, f.helper]);			

		}
	}
	
	jQuery.fDrag = {
		manager: {},
		current: null,
		position: null,
		oldPosition: null,
		helper: null,
		init: function(o) {

			if(!o)
				var o = {};

			return this.each(function() {			

				/* Prepare the options */
				f.manager[this] = {
					handle : o.handle ? ($(o.handle, this).get(0) ? $(o.handle, this) : $(this)) : $(this),
					onStart : o.onStart && o.onStart.constructor == Function ? o.onStart : false,
					onStop : o.onStop && o.onStop.constructor == Function ? o.onStop : false,
					onDrag : o.onDrag && o.onDrag.constructor == Function ? o.onDrag : false,
					helper: o.helper ? o.helper : "",
					dragPrevention: o.dragPrevention ? o.dragPrevention : 0,
					dragPreventionOn: o.dragPreventionOn ? o.dragPreventionOn.toLowerCase().split(",") : ["input","textarea","button"],
					cursorAt: { top: ((o.cursorAt && o.cursorAt.top && o.cursorAt.top < 0) ? o.cursorAt.top : -1), left: ((o.cursorAt && o.cursorAt.left && o.cursorAt.left < 0) ? o.cursorAt.left : -1) },
					init: false
				};

				/* Bind the mousedown event */
				f.manager[this].handle.bind("mousedown", f.evClick);
				
				/* Link the original element to the handle for later reference */
				f.manager[this].handle.get(0).dragEl = this;
				
				/* Prevent text selection */
				if($.browser.mozilla){
					this.style.MozUserSelect = "none";
				}else if($.browser.safari){
					this.style.KhtmlUserSelect = "none";
				}else if($.browser.msie){
					this.unselectable = "on";
				}else{
					return false;
				}				
			
			});	
		},
		destroy: function() {
			/* Destroy all droppables */	
		},
		evClick: function(e) {

			/* Prevent execution on defined elements */
			var targetName = (e.target) ? e.target.nodeName.toLowerCase() : e.srcElement.nodeName.toLowerCase();
			for(var i=0;i<f.manager[this.dragEl].dragPreventionOn.length;i++) {
				if(targetName == f.manager[this.dragEl].dragPreventionOn[i]) return;
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

			var o = f.manager[f.current];

			/* Get the current mouse position */
			f.position = (e.pageX) ? [e.pageX,e.pageY] : [e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,e.clientY + document.body.scrollTop + document.documentElement.scrollTop];
				
			/* Append a helper div if helper is not a function */
			if(typeof o.helper == "function") {
				f.helper = o.helper();
			} else {
				f.helper = document.createElement("div");
				$(f.helper).attr("class", o.helper);				
			}
			$(f.helper).css("position", "absolute").css("left", f.position[0]-o.cursorAt.left+"px").css("top", f.position[1]-o.cursorAt.top+"px").appendTo("body");

			/* Okay, initialization is done, then set it to true */
			o.init = true;			
			
			/* Trigger the onStart callback */
			if(o.onStart)
				o.onStart.apply(f.current, [f.helper]);
			
		},
		evStop: function(e) {			

			var o = f.manager[f.current];

			/* Unbind the mouse events */
			$(document).unbind("mouseup");
			$(document).unbind("mousemove");
			
			/* If init is false, don't do the following, just set properties to null */
			if(f.manager[f.current].init == false)
				return f.current = f.oldPosition = f.position = null;
			
			/* Trigger the onStop callback */
			if(f.manager[f.current].onStop)
				f.manager[f.current].onStop.apply(f.current);
				
			/* Remove helper */
			$("body").get(0).removeChild(f.helper);

			f.manager[f.current].init = false;
			f.current = f.oldPosition = f.position = f.helper = null;
				
		},
		evDrag: function(e) {

			var o = f.manager[f.current];
		
			/* Get the current mouse position */
			f.position = (e.pageX) ? [e.pageX,e.pageY] : [e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,e.clientY + document.body.scrollTop + document.documentElement.scrollTop];

			/* If position is more than x pixels from original position, start dragging */
			if( (Math.abs(f.position[0]-f.oldPosition[0]) > o.dragPrevention || Math.abs(f.position[1]-f.oldPosition[1]) > o.dragPrevention) && o.init == false)
				f.evStart.apply(f.current,[e]);			
			else {
				if(f.manager[f.current].init == false) return;
			}
			
			/* Trigger the onDrag callback */
			if(f.manager[f.current].onDrag)
				f.manager[f.current].onDrag.apply(f.current, [f.helper,f.position[0],f.position[1]]);		
				
			/* Stick the helper to the cursor or to modified x/y */			
			$(f.helper).css("left", f.position[0]-(o.cursorAt.left ? o.cursorAt.left : 0)+"px").css("top", f.position[1]-(o.cursorAt.top ? o.cursorAt.top : 0)+"px");
				
		}
	}

	/* Map keyword 'f' to jQuery.fDrag for convienence */
	var f = jQuery.fDrag;
	
	/* Map keyword 'd' to jQuery.fDrop for convienence */
	var d = jQuery.fDrop;
	
	/* Extend jQuery's methods, map two of our internals */
	jQuery.fn.extend(
		{
			removeDraggables : jQuery.fDrag.destroy,
			addDraggables : jQuery.fDrag.init,
			addDroppables : jQuery.fDrop.init
		}
	);
 })(jQuery);