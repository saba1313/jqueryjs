/**
* Manages startup and overall control of the Flash MP3 Player
*
* @author	Jeroen Wijering
* @version	1.02
**/


import com.jeroenwijering.players.*;


class com.jeroenwijering.players.MP3Player extends AbstractPlayer { 


	/** Array with all config values **/
	private var configArray:Object = {
		file:"song.mp3",
		width:"undefined",
		height:"undefined",
		autostart:"false",
		shuffle:"true",
		repeat:"false",
		backcolor:"0xffffff",
		frontcolor:"0x000000",
		lightcolor:"0x006699",
		displayheight:"0",
		linkfromdisplay:"false",
		showeq:"false",
		overstretch:"true",
		showdigits:"false",
		volume:"80",
		autoscroll:"false",
		thumbsinplaylist:"false",
		callback:"undefined",
		enablejs:"false",
		playerclip:"undefined"
	}
	/** Accepted types of mediafiles **/
	private var fileTypes:Array = new Array("mp3");


	/** Constructor **/
	function MP3Player(tgt:MovieClip,fil:String) {
		super(tgt,fil);
	};


	/** Setup all necessary MCV blocks. **/
	private function setupMCV():Void {
		// displayheight fix for EQ
		configArray["showeq"] == "true" && configArray["displayheight"] == 0 ? configArray["displayheight"] = 50: null; 
		// set controller
		var ctr = new PlayerController(configArray,fileArray);
		// set views with controller registered
		var pav = new PlayerView(ctr,configArray,fileArray);
		var ipv = new InputView(ctr,configArray,fileArray);
		var vws:Array = new Array(pav,ipv);
		if(configArray["showeq"] == "true") {
			var eqv = new EqualizerView(ctr,configArray,fileArray);
			vws.push(eqv);
		} else {
			configArray["playerclip"].display.equalizer._visible = false;
		}
		if(configArray["displayheight"] < configArray["height"]-20 ) {
			var plv = new PlaylistView(ctr,configArray,fileArray);
			vws.push(plv);
		} else {
			configArray["playerclip"].playlist._visible = false;
		}
		if(configArray["enablejs"] == "true") {
			var jsv = new JavascriptView(ctr,configArray,fileArray);
			vws.push(jsv);
		}
		if(configArray["callback"] != "undefined") {
			var cbv = new CallbackView(ctr,configArray,fileArray);
			vws.push(cbv);
		}
		// set models with views registered
		var mp3 = new MP3Model(vws,ctr,configArray,fileArray);
		var mds:Array = new Array(mp3);
		// register all needed models and start the MCV cycle
		ctr.startMCV(mds);
	};


	/**
	* Player application startup
	*
	* @param tgt	the MovieClip that holds the player's graphics
	* @param fil	file that should be played
	**/	
	public static function main(tgt:MovieClip,fil:String):Void {
		var player:MP3Player = new MP3Player(tgt,fil);
	};


}