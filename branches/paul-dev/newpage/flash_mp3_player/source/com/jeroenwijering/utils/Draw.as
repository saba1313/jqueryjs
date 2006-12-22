/**
* A couple of commonly used draw functions
*
* @example
* import com.jeroenwijering.utils.Draw;
* Draw.square(myClip,myWidth,myHeight,myColor);
* Draw.roundedSquare(myClip,myWidth,myHeight,myCornerRadius,myColor,myStrokeThickness,myStrokeColor);
*
* @author	Jeroen Wijering
* @version	1.00
**/


class com.jeroenwijering.utils.Draw {


	/**
	* Draw a square in a given movieclip.
	*
	* @param tgt	Movieclip to draw the square into.
	* @param wth	Square width.
	* @param hei	Square height.
	* @param clr	Square color.
	* @param tck	(optional) Stroke Thickness.
	* @param cls	(optional) Stroke color.
	**/
	public static function square(tgt:MovieClip,wth:Number,hei:Number,clr:Number,tck:Number,cls:Number):Void {
		tgt.clear();
		if(tck != undefined) { tgt.lineStyle(tck,cls,100); }
		tgt.beginFill(clr,100);
		tgt.moveTo(0,0);
		tgt.lineTo(wth,0);
		tgt.lineTo(wth,hei);
		tgt.lineTo(0,hei);
		tgt.lineTo(0,0);
		tgt.endFill();
	};


	/**
	* Draw a rounded-corner square in a given movieclip.
	*
	* @param tgt	Movieclip to draw the square into.
	* @param wth	Square width.
	* @param hei	Square height.
	* @param rad	Square corner radius.
	* @param clr	Square color.
	* @param tck	(optional) Stroke Thickness.
	* @param cls	(optional) Stroke color.
	**/
	public static function roundedSquare(tgt:MovieClip,wth:Number,hei:Number,rad:Number,clr:Number,tck:Number,cls:Number):Void {
		tgt.clear();
		if(tck > 0) { tgt.lineStyle(tck,cls,100); }
		tgt.beginFill(clr,100);
		tgt.moveTo(rad,0);
		tgt.lineTo(wth-rad,0);
		tgt.curveTo(wth,0,wth,rad);
		tgt.lineTo(wth,hei-rad);
		tgt.curveTo(wth,hei,wth-rad,hei);
		tgt.lineTo(rad,hei);
		tgt.curveTo(0,hei,0,hei-rad);
		tgt.lineTo(0,rad);
		tgt.curveTo(0,0,rad,0);
		tgt.endFill();
	};


}