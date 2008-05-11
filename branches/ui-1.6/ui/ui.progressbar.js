/*
 * jQuery UI ProgressBar
 *
 * Copyright (c) 2008 Eduardo Lundgren (braeker)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * http://docs.jquery.com/UI/ProgressBar
 *
 * Depends:
 *   ui.base.js
 *
 * Revision: $Id: ui.progressbar.js 5196 2008-04-04 12:52:32Z braeker $
 */
;(function($) {

	$.fn.extend({
		progressbar: function(options) {
			var args = Array.prototype.slice.call(arguments, 1);
			
			if ( options == "value" )
				return $.data(this[0], "progressbar").value(arguments[1]);
			
			return this.each(function() {
				if (typeof options == "string") {
					var progressbar = $.data(this, "progressbar");
					if (progressbar) progressbar[options].apply(progressbar, args);

				} else if(!$.data(this, "progressbar"))
					new $.ui.progressbar(this, options);
			});
		}
	});
	
	$.ui.progressbar = function(element, options) {
		//Initialize needed constants
		var self = this;
		this.element = $(element);
		$.data(element, "progressbar", this);
		this.element.addClass("ui-progressbar");
		
		//Prepare the passed options
		this.options = $.extend({}, $.ui.progressbar.defaults, options);
		var o = this.options, el = this.element;
		$.extend(o, {
			stepping: o.stepping > 100 ? 100 : o.stepping
		});
		this._step = 0;
		this.rangeValue = 0;
		this.threads = {};
		
		var text = o.text ? o.text : (o.range ? '0%' : ''), elw = el.css('width'), elh = el.css('height');
		
		this.wrapper = $("<div class='ui-progressbar-wrap'></div>");
		
		this.bar = $("<div class='ui-progressbar-bar ui-hidden'></div>").css({
			width: '0px', overflow: 'hidden', zIndex: 100
		});
		
		this.textel = $("<div class='ui-progressbar-text'></div>").html(text).css({
			width: '0px', overflow: 'hidden'
		});
		
		this.textBg = $("<div class='ui-progressbar-text ui-progressbar-text-back'></div>").html(text).css({
				width: elw
		});
		
		this.wrapper.append(this.bar.append(this.textel), this.textBg).appendTo(el);
		
	};
	
	$.extend($.ui.progressbar.prototype, {
		plugins: {},
		ui: function(e) {
			return {
				instance: this,
				options: this.options,
				step: this._step,
				rangeValue: this.rangeValue,
				pixelRange: this.pixelRange
			}
		},
		propagate: function(n,e) {
			$.ui.plugin.call(this, n, [e, this.ui()]);
			this.element.triggerHandler(
				n == "progressbar" ? n : ["progressbar", n].join(""), [e, this.ui()], this.options[n]
			);
		},
		destroy: function() {
			this.reset();
			
			this.element
				.removeClass("ui-progressbar ui-progressbar-disabled")
				.removeData("progressbar").unbind(".progressbar")
				.find('.ui-progressbar-wrap').remove();
		},
		enable: function() {
			this.element.removeClass("ui-progressbar-disabled");
			this.disabled = false;
			if (this.inprogress)	this.start();
		},
		disable: function() {
			this.element.addClass("ui-progressbar-disabled");
			this.disabled = true;
			this.clearThreads();
		},
		start: function() {
			if (this.disabled) return false;
			this.inprogress = true;
			
			var o = this.options, el = this.element, self = this;
			this.clearThreads();
			
			if (typeof o.wait == 'number' && !self.waitThread)
				self.waitThread = setTimeout(function() {
					clearInterval(self.waitThread);
					self.waitThread = null;
				}, o.wait);
			
			var frames = Math.ceil(100/o.stepping) || 0, ms = o.duration/frames || 0,
			
			render = function(step, t) {
				//clearInterval(t);
				
				console.log(step)
				
				self.progress(o.stepping * step);
				// on end
				if (step >= frames) {
					self.stop();

					if (self.waitThread || o.wait == 'loop') {
						self._step = 0;
						self.start();
					}
				}
			};
			var from = this._step, _step = (this._step - (from - 1));
			
			console.log(_step)
			
			/*for(var step = from; step <= frames; step++) {
				var interval = (step - (from - 1)) * ms;
				this.threads[step] = setTimeout(render(step, this.threads[step]), interval);
			}*/
			
			this.threads[0] = setInterval(function() {
				render(_step++);
			}, ms);
			
			this.propagate('start');
			return false;
		},
		clearThreads: function() {
			$.each(this.threads, function(s, t) { clearInterval(t); });
			this.threads = {};
		},
		stop: function() {
			if (this.disabled) return false;
			var o = this.options, self = this;
			
			this.clearThreads();
			this.propagate('stop');
			
			this.inprogress = false;
			return false;
		},
		reset: function() {
			if (this.disabled) return false;
			this._step = 0;
			this.rangeValue = 0;
			this.inprogress = false;
			this.clearThreads();
			this.progress(0);
			this.bar.addClass('ui-hidden');
			return false;
		},
		progress: function(range) {
			var o = this.options, el = this.element, bar = this.bar;
			if (this.disabled) return false;
			
			range = parseInt(range, 10);
			this.rangeValue = this._fixRange(range);
			
			var elw = el.innerWidth() - (el.outerWidth() - el.innerWidth()) - (bar.outerWidth() - bar.innerWidth());
			
			this.pixelRange = Math.round( ((this.rangeValue/100)||0) * elw );
			
			this.bar.removeClass('ui-hidden');
			
			var css = { width: this.pixelRange + 'px' };
			
			this.bar.css(css);
			
			this.textel.css(css)
			
			if (!o.text && o.range) this.text(this.rangeValue + '%');
			this.propagate('progress', this.rangeValue);
			return false;
		},
		text: function(text) {
			this.textel.html(text);
		},
		_fixRange: function(range) {
			var o = this.options;
			this._step = Math.ceil(range/o.stepping);
			this.rangeValue = Math.round(o.stepping * this._step);
			this.rangeValue = (this.rangeValue) >= 100 ? 100 : this.rangeValue;
			return this.rangeValue;
		}
	});
	
	$.ui.progressbar.defaults = {
    duration: 3000,
    stepping: 1,
		text: '',
		range: true,
		addClass: '',
		textClass: ''
	};

})(jQuery);
