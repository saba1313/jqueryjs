/**
* Player that reads all media formats Flash can read.
*
* @author	Jeroen Wijering
* @version	1.02
**/


import com.jeroenwijering.players.*;


class com.jeroenwijering.players.MediaPlayer extends AbstractPlayer { 


	/** Array with all config values **/
	private var configArray:Object = {
		file:"playlist.xml",
		width:"undefined",
		height:"undefined",
		autostart:"false",
		shuffle:"true",
		repeat:"false",
		backcolor:"0xffffff",
		frontcolor:"0x000000",
		lightcolor:"0x000000",
		displayheight:"undefined",
		linkfromdisplay:"false",
		overstretch:"false",
		showdigits:"false",
		showfsbutton:"false",
		fullscreenmode:"false",
		fullscreenpage:"fullscreen.html",
		fsreturnpage:"mediaplayer.html",
		bufferlength:"5",
		volume:"80",
		autoscroll:"false",
		thumbsinplaylist:"false",
		rotatetime:"10",
		callback:"undefined",
		streamscript:"undefined",
		enablejs:"false",
		playerclip:"undefined"
	}
	/** Accepted types of mediafiles **/
	private var fileTypes:Array = new Array("mp3","flv","rtmp://","jpg","png","gif","swf");


	/**
	* Player application startup
	*
	* @param tgt	movieclip that contains all player graphics
	* @param fil	file that should be played
	**/
	public function MediaPlayer(tgt:MovieClip,fil:String) {
		super(tgt,fil);
	};


	/** Setup all necessary MCV blocks. **/
	private function setupMCV():Void {
		// set controller
		var ctr = new PlayerController(configArray,fileArray);
		// set views with controller registered
		var pav = new PlayerView(ctr,configArray,fileArray);
		var ipv = new InputView(ctr,configArray,fileArray);
		var vws:Array = new Array(pav,ipv);
		if(configArray["displayheight"] < configArray["height"]-20 && configArray["fullscreenmode"] == "false") {
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
		var flv = new FLVModel(vws,ctr,configArray,fileArray,configArray["playerclip"].display.video);
		var img = new ImageModel(vws,ctr,configArray,fileArray,configArray["playerclip"].display.image);
		var mds:Array = new Array(mp3,flv,img);
		// register all needed models and start the MCV cycle
		ctr.startMCV(mds);
	};


	/**
	* Player application startup
	*
	* @param tgt	MovieClip that holds the player's graphics
	* @param fil	file that should be played
	**/	
	public static function main(tgt:MovieClip,fil:String):Void {
		var player:MediaPlayer = new MediaPlayer(tgt,fil);
	};


}