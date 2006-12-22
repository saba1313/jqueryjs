/**
* A couple of commonly used animation functions
*
* @example
* import com.jeroenwijering.utils.Animations;
* Animations.fadeIn('some_clip');
* Animations.write('some_title_clip','A sunny day at the beach',2);
*
* @author	Jeroen Wijering
* @version	1.01
**/


class com.jeroenwijering.utils.Animations {


	/**
	* Fadein function for MovieClip.
	*
	* @param tgt	Movieclip to fade.
	* @param end	Final alpha value.
	* @param inc	Speed of the fade (increment per frame).
	**/
	public static function fadeIn(tgt:MovieClip,end:Number,spd:Number):Void {
		arguments.length < 3 ? spd = 10: null;
		arguments.length < 2 ? end = 100: null;
		tgt._visible = true;
		tgt.onEnterFrame = function() {
			if(this._alpha > end-spd) {
				delete this.onEnterFrame;
				this._alpha = end;
			} else {
				this._alpha += spd;
			}
		};
	};


	/**
	* Fadeout function for MovieClip.
	*
	* @param tgt	Movieclip to fade.
	* @param end	Final alpha value.
	* @param inc	Speed of the fade (increment per frame).
	* @param rmv	Remove the clip after fadeout.
	**/
	public static function fadeOut(tgt:MovieClip,end:Number,spd:Number,rmv:Boolean):Void {
		arguments.length < 4 ? rmv = false: null;
		arguments.length < 3 ? spd = 10: null;
		arguments.length < 2 ? end = 0: null;
		tgt.onEnterFrame = function() {
			if(this._alpha < end+spd) {
				delete this.onEnterFrame;
				this._alpha = end;
				end == 0 ? this._visible = false: null;
				rmv == true ? this.removeMovieClip(): null;
			} else {
				this._alpha -= spd;
			}
		};
	};


	/**
	* Easing enterframe function for a Movieclip.
	*
	* @param tgt	MovieClip of the balloon to iterate
	* @param xps	Final x position.
	* @param yps	Final y position.
	* @param spd	Speed of the ease (1 to 10)
	**/
	public static function easeTo(tgt:MovieClip,xps:Number,yps:Number,spd:Number):Void {
		arguments.length < 4 ? spd = 2: null;
		tgt.onEnterFrame = function() {
			this._x = xps-(xps-this._x)/(1+1/spd);
			this._y = yps-(yps-this._y)/(1+1/spd);
			if (this._x>xps-1 && this._x<xps+1 && this._y>yps-1 && this._y<yps+1) {
				this._x = xps;
				this._y = yps;
				delete this.onEnterFrame;
			} 
		}; 
	};


	/**
	* Write text character by character in a Movieclip's 'tf' (and 'tf2') textfield.
	*
	* @param tgt	Movieclip to draw the shape into.
	* @param txt	Text to write.
	* @param spd	Writing speed (number of chars per frame).
	**/
	public static function write(tgt:MovieClip, txt:String, spd:Number):Void {
		arguments.length < 3 ? spd = 1: null;
		tgt.tmp = "";
		tgt.i = 0;
		tgt.onEnterFrame = function() {
			var inc:Number = 0;
			while (inc < spd) {
				this.tmp = this.tmp + txt.charAt(this.i);
				// correct for html chars
				if (txt.charAt(this.i) == "<") {
					var eot:Number = txt.indexOf(">", this.i);
					var tag:Number = eot-this.i;
					this.i = this.i+tag;
					this.tmp = txt.substr(0, this.i);
				} else {
					this.i++;
				}
				inc++;
			}
			this.tf.htmlText = this.tf2.htmlText = this.tmp;
			if (this.i >= txt.length) {
				delete this.onEnterFrame;
				this.tf.htmlText = this.tf2.htmlText = txt;
			}
		};
	};


	/**
	* Make a Movieclip jump to a specific scale
	*
	* @param tgt	Movieclip that should jump.
	* @param scl	Final scale.
	* @param spd	Oscillation speed (0 to 1).
	**/
	public static function jump(tgt:MovieClip,scl:Number,spd:Number):Void {
		arguments.length < 3 ? spd = 0.5: null;
		arguments.length < 2 ? scl = 100: null;
		tgt.i = 0;
		tgt._alpha = 0;
		tgt.onEnterFrame = function() {
			this._alpha = 100;
			if (this.i < 44) {
				// don't ask...
				var tsc =  scl - scl * (Math.cos(this.i*spd/2 + this.i*spd)) / Math.pow(this.i+1,1.5);
				this._xscale =  this._yscale = tsc;
				this.i++;
			} else {
				delete this.onEnterFrame;
				this._xscale = this._yscale = scl;
			} 
		}; 
	};


	/**
	* Transform the color of a MovieClip over time
	*
	* @param tgt	Target MovieClip.
	* @param red	Red channel offset.
	* @param gre	Green channel offset.
	* @param blu	Blue channel offset.
	* @param dur	Duration of the transformation (1 to 100).
	**/
	public static function setColor(tgt:MovieClip,red:Number,gre:Number,blu:Number,dur:Number):Void {
		arguments.length < 5 ? dur = 5: null;
		tgt.col = new Color(tgt);
		tgt.cr = tgt.cg = tgt.cb = 0;
		tgt.onEnterFrame = function() {
			this.cr = this.cr+(red-this.cr)/dur;
			this.cg = this.cg+(gre-this.cg)/dur;
			this.cb = this.cb+(blu-this.cb)/dur;
			this.col.setTransform({rb:this.cr, gb:this.cg, bb:this.cb});
			if (Math.abs(this.cr-red)<2 && Math.abs(this.cg-gre)<2 && Math.abs(this.cb-blu)<2) {
				delete this.onEnterFrame;
				this.col.setTransform({rb:red, gb:gre, bb:blu}); 
			}  
		}; 
	};

}