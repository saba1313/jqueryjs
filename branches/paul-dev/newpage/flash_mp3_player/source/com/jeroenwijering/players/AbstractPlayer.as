/**
* Abstract player class, extended by all other players.
* Class loads config and file XML's and sets up MCV triangle.
*
* @author	Jeroen Wijering
* @version	1.02
**/


import com.jeroenwijering.players.*;
import com.jeroenwijering.utils.XMLParser;


class com.jeroenwijering.players.AbstractPlayer { 


	/** Array with all config values **/
	private var configArray:Object = {
		file:"",
		width:"",
		height:"",
		autostart:"",
		shuffle:"",
		repeat:"",
		backcolor:"",
		frontcolor:"",
		lightcolor:"",
		displayheight:"",
		linkfromdisplay:"",
		overstretch:"",
		showdigits:"",
		showfsbutton:"",
		fullscreenmode:"",
		fullscreenpage:"",
		fsreturnpage:"",
		bufferlength:"",
		volume:"",
		autoscroll:"",
		thumbsinplaylist:"",
		rotatetime:"",
		shownavigation:"",
		transition:"",
		callback:"",
		streamscript:"",
		enablejs:"",
		playerclip:""
	}
	/** Accepted types of mediafiles **/
	private var fileTypes:Array;
	/** reference to the XML parser **/
	private var fileParser:XMLParser;
	/** Array with all playlist items **/
	private var fileArray:Array;


	/**
	* Player application startup
	*
	* @param tgt	movieclip that contains all player graphics
	* @param fil	file that should be played
	**/
	public function AbstractPlayer(tgt:MovieClip,fil:String) {
		configArray["playerclip"] = tgt;
		configArray["playerclip"]._visible = false;
		fil == undefined ? null: configArray["file"] = fil;
		loadConfigArray();
	};


	/** Set configArray variables or load them from flashvars. **/
	private function loadConfigArray() {
		// set default dimensions
		configArray["width"] == "undefined" ? configArray["width"] = Stage.width: null;
		configArray["height"] == "undefined" ? configArray["height"] = Stage.height: null;
		configArray["displayheight"] == "undefined" ? configArray["displayheight"] = Stage.height-20: null;
		// load flashvars
		for(var cfv in configArray) {
			_root[cfv] == undefined ? null: configArray[cfv] = unescape(_root[cfv]);
		}
		// load file from sharedobject if fullscreenmode is true
		if(configArray["fullscreenmode"] == "true") {
			var pso = SharedObject.getLocal("com.jeroenwijering.players", "/");
			configArray["file"] = pso.data.file;
		}
		// proceed to file loading
		loadFileArray();
	};


	/** Load fileArray variables from XML or single flashvars. **/
	private function loadFileArray() {
		fileArray = new Array();
		// first check if we have a single file
		var fnd = false;
		for(var i in fileTypes) {
			if(configArray["file"].toLowerCase().indexOf(fileTypes[i].toLowerCase()) > -1) { 
				fnd = true;
			}
		}
		// if single file, add to playlistArray and load titles
		if (fnd == true) {
			fileArray[0] = new Array();
			fileArray[0]['file'] = configArray["file"];
			_root.title == undefined ? fileArray[0]["title"] = fileArray[0]["file"]: fileArray[0]["title"] = unescape(_root.title);
			_root.image == undefined ? null: fileArray[0]["image"] = unescape(_root.image);
			_root.link == undefined ? null: fileArray[0]["link"] = unescape(_root.link);
			_root.id == undefined ? null: fileArray[0]["id"] = unescape(_root.id);
			if(configArray["fullscreenmode"] == "true") {
				var pso = SharedObject.getLocal("com.jeroenwijering.players", "/");
				fileArray[0]["id"] = pso.data.id;
			}
			// single file added; show player and setup MCV
			configArray["playerclip"]._visible = true;
			_root.activity._visible = false;
			setupMCV();
			return;
		// else load entire array from XML
		} else { 
			var ref = this;
			fileParser = new XMLParser();
			fileParser.onParseComplete = function() { 
				ref.fileArray = this.parseArray;
				ref.configArray["playerclip"]._visible = true;
				_root.activity._visible = false;
				ref.setupMCV();
			};
			fileParser.parse(configArray["file"]);	
		}	
	};


	/** Setup all necessary MCV blocks. **/
	private function setupMCV():Void {
		// set controller
		var ctr = new AbstractController(configArray,fileArray);
		// set views ans register controller
		var asv = new AbstractView(ctr,configArray,fileArray);
		var vws:Array = new Array(asv);
		// set models and register an array of views
		var asm = new AbstractModel(vws,ctr,configArray,fileArray);
		var mds:Array = new Array(asm);
		// register models with controller and start MCV cycle
		ctr.startMCV(mds);
	};


	/**
	* Player application startup
	*
	* @param tgt	the MovieClip that holds the player's graphics
	* @param fil	file that should be played
	**/	
	public static function main(tgt:MovieClip,fil:String):Void {
		var player:AbstractPlayer = new AbstractPlayer(tgt,fil);
	};


}