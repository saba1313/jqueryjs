/**
* Image model class of the players MCV pattern.
*
* @author	Jeroen Wijering
* @version	1.00
**/


import com.jeroenwijering.players.*;
import com.jeroenwijering.utils.ImageLoader;


class com.jeroenwijering.players.ImageModel extends AbstractModel { 


	/** array with extensions used by this model **/
	private var activeExtensions:Array = new Array("jpg","gif","png","swf");
	/** ImageLoader instance **/
	private var imageLoader:ImageLoader;
	/** Clip to load the image into **/
	private var imageClip:MovieClip;
	/** interval ID of image duration function **/
	private var currentPosition:Number = 0;
	/** interval ID of image duration function **/
	private var positionInterval:Number;
	/** current state **/
	private var currentState:Number;


	/** Constructor **/
	function ImageModel(vws:Array,ctr:AbstractController,car:Object,far:Array,imc:MovieClip) {
		super(vws,ctr,car,far);
		imageClip = imc;
		if(configArray["overstretch"] == "true") { 
			imageLoader = new ImageLoader(imageClip,true,configArray["width"],configArray["displayheight"]);
		} else {
			imageLoader = new ImageLoader(imageClip,false,configArray["width"],configArray["displayheight"]);
		}
		// fire new state event if image is fully loaded
		var ref = this;
		imageLoader.onLoadFinished = function() {
			ref.currentState = 2;
			ref.sendUpdate("state",2);
			ref.sendUpdate("load",100);
		}
	};


	/** Image override of the default getChange handler **/
	public function getChange(typ:String,prm:Number) {
		switch(typ) {
			case "item":
				setItem(prm);
				isActive == true ? imageClip._visible = true: imageClip._visible = false;
				break;
			case "start": 
				isActive == true ? startInterval(prm): null;
				break;
			case "stop":
				isActive == true ? stopInterval(prm): null;
				break;
			case "volume":
				setVolume(prm);
				break;
		}
	};


	/** 
	* Start display interval for a specific image
	*
	* @param pos	start position of the interval 
	**/
	private function startInterval(pos:Number) {
		clearInterval(positionInterval);
		if(fileArray[currentItem]["file"] != currentURL) {
			currentURL = fileArray[currentItem]["file"];
			sendUpdate("state",1);
			currentState = 1;
			imageLoader.loadImage(fileArray[currentItem]["file"]);
		} else { 
			sendUpdate("state",2);
			currentState = 2;
		}
		pos == undefined ? null: currentPosition = pos*configArray["rotatetime"]/100;
		updatePosition();
		positionInterval = setInterval(this,"updatePosition",200);
	};


	/** Read and broadcast the current position of the song **/
	private function updatePosition() {
		currentState == 2 ? currentPosition += 0.2: null;
		// if image rotation is completed, clear interval and play next or stop
		if(currentPosition >= configArray["rotatetime"]) {
			sendUpdate("state",3);
			currentState = 3;
			sendCompleteEvent();
		} else {	
			sendUpdate("time",currentPosition,configArray["rotatetime"]-currentPosition);
		}
	};


	/**
	* stop the image display interval
	*
	* @param pos	position to stop on.
	**/
	private function stopInterval(pos:Number) {
		clearInterval(positionInterval);
		imageClip.stopAllSounds();
		imageClip.stop();
		if(pos != undefined) {
			currentPosition = pos*configArray["rotatetime"]/100;
			sendUpdate("time",currentPosition,configArray["rotatetime"]-currentPosition);
		}
		sendUpdate("state",0);
		currentState = 0;
	};


}