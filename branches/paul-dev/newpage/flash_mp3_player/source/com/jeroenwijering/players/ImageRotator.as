/**
* Manages startup and overall control of the Flash Image Rotator
*
* @author	Jeroen Wijering
* @version	1.01
**/


import com.jeroenwijering.players.*;


class com.jeroenwijering.players.ImageRotator extends AbstractPlayer { 


	/** Array with all config values **/
	private var configArray:Object = {
		file:"playlist.xml",
		width:"undefined",
		height:"undefined",
		shuffle:"true",
		backcolor:"0x000000",
		frontcolor:"0xffffff",
		lightcolor:"0x990000",
		linkfromdisplay:"true",
		overstretch:"true",
		rotatetime:"5",
		shownavigation:"false",
		transition:"fade",
		callback:"undefined",
		enablejs:"false",
		playerclip:"undefined"
	}
	/** Accepted types of mediafiles **/
	private var fileTypes:Array = new Array("jpg","png","gif","swf");


	/** Constructor **/
	function ImageRotator(tgt:MovieClip,fil:String) {
		super(tgt,fil);
	};


	/** Setup all necessary MCV blocks. **/
	private function setupMCV():Void {
		// set controller
		var ctr = new RotatorController(configArray,fileArray);
		// set views with controller registered
		var rov = new RotatorView(ctr,configArray,fileArray);
		var ipv = new InputView(ctr,configArray,fileArray);
		var vws:Array = new Array(rov,ipv);
		if(configArray["enablejs"] == "true") {
			var jsv = new JavascriptView(ctr,configArray,fileArray);
			vws.push(jsv);
		}
		if(configArray["callback"] != "undefined") {
			var cbv = new CallbackView(ctr,configArray,fileArray);
			vws.push(cbv);
		}
		// set models with views registered
		configArray["displayheight"] = configArray["height"];
		var im1 = new ImageModel(vws,ctr,configArray,fileArray,configArray["playerclip"].img1);
		var im2 = new ImageModel(vws,ctr,configArray,fileArray,configArray["playerclip"].img2);
		var mds:Array = new Array(im1,im2);
		// register all needed models and start the MCV cycle
		ctr.startMCV(mds);
	};


	/**
	* Rotator application startup
	*
	* @param tgt	the MovieClip that holds the player's graphics
	* @param fil	file that should be played
	**/	
	public static function main(tgt:MovieClip,fil:String):Void {
		var rotator:ImageRotator = new ImageRotator(tgt,fil);
	};


}