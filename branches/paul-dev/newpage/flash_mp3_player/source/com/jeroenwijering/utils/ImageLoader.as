/**
* Class for loading, scaling and smoothing images to a given MovieClip
*
* @example 
* import com.jeroenwijering.utils.ImageLoader;
* var myLoader = new ImageLoader(this);
* myLoader.loadImage("somephoto.jpg");
* 
* @author	Jeroen Wijering
* @version	1.05
**/


import com.jeroenwijering.utils.*;


class com.jeroenwijering.utils.ImageLoader {


	/** MovieClip Loader Instance **/
	private var mcLoader:MovieClipLoader;
	/** Target MovieClip **/
	private var targetClip:MovieClip;
	/** Target Width **/
	private var targetWidth:Number;
	/** Target Height **/
	private var targetHeight:Number;
	/** Overstretch Boolean **/
	private var overStretch:Boolean = false;
	/** Boolean that checks whether an SWF is loaded **/
	private var useSmoothing:Boolean;


	/**
	 * Constructor for the ImageLoader
	 *
	 * @param tgt	MovieClip to load the image into
	 * @param ost	Overstretch the image to fill the entire target, default false
	 * @param wid	Width of the image target, defaults to target movieclip width
	 * @param hei	Height if the image target, defaults to target movieclip height
	 */
	function ImageLoader(tgt:MovieClip,ost:Boolean,wid:Number,hei:Number) {
		targetClip = tgt;
		arguments.length > 1 ? overStretch = ost: null;
		if(arguments.length > 2) { 
			targetWidth = wid;
			targetHeight = hei;
		} else {
			targetWidth = targetClip._width;
			targetHeight = targetClip._height;
		}
		mcLoader = new MovieClipLoader();
		mcLoader.addListener(this);
	};


	/**
	 * Switch image with bitmaparray (Triggered by MovieClipLoader)
	 */
	private function onLoadInit(inTarget:MovieClip):Void {
		if(useSmoothing  == true) {
			var bmp = new flash.display.BitmapData(targetClip.raw_mc._width,targetClip.raw_mc._height, true, 0x000000);
			bmp.draw(targetClip.raw_mc);
			var bmc:MovieClip = targetClip.createEmptyMovieClip("bmp_mc", targetClip.getNextHighestDepth());
			bmc.attachBitmap(bmp, bmc.getNextHighestDepth(),"auto",true);
			targetClip["raw_mc"].unloadMovie();
			targetClip["raw_mc"].removeMovieClip();
			delete targetClip["raw_mc"];
			scaleImage(bmc);
		} else { 
			scaleImage(targetClip.raw_mc);	
		}
		onLoadFinished();
	};


	/**
	 * Scale the image while maintaining aspectratio 
	 *
	 * @param tgt	MovieClip to scale
	 */
	private function scaleImage(tgt:MovieClip):Void {
		// calculate scale ratios properties
		var xsr:Number = targetWidth/tgt._width;
		var ysr:Number = targetHeight/tgt._height;
		// scale image
		if ((overStretch == true && xsr > ysr) || (overStretch == false && xsr < ysr)) { 
			tgt._xscale = tgt._yscale = xsr*100;
		} else { 
			tgt._xscale = tgt._yscale = ysr*100;
		}
		// put image in middle
		tgt._x = targetWidth/2 - tgt._width/2;
		tgt._y = targetHeight/2 - tgt._height/2;
	};


	/**
	 * Start loading an image
	 *
	 * @param img URL of the image to load
	 */
	public function loadImage(img:String):Void {
		// delete smoothed image
		targetClip["raw_mc"].clear();
		targetClip["bmp_mc"].unloadMovie();
		targetClip["bmp_mc"].removeMovieClip();
		delete targetClip["bmp_mc"];
		// start loading new image
		checkSmoothing(img);
		var raw:MovieClip = targetClip.createEmptyMovieClip("raw_mc",1);
		mcLoader.loadClip(img,raw);
	};


	/** Check whether smoothing can be enabled **/
	public function checkSmoothing(img:String):Void {
		var idx:Number = _root._url.indexOf("/",8);
		var rot:String = _root._url.substring(0,idx);
		if(img.toLowerCase().indexOf(".swf") > -1 || _root._url.indexOf("file://") > -1) {
			useSmoothing = false;
		} else  if (img.indexOf("http://") > -1 && img.indexOf(rot) == -1) {
			useSmoothing = false;
		} else  if (System.capabilities.version.indexOf("7,0,") > -1) {
			useSmoothing = false;
		} else {
			useSmoothing = true;
		}
	};


	/** event handler for finished loading **/
	public function onLoadFinished() { };


}