/**
* MP3 model class of the players MCV pattern.
*
* @author	Jeroen Wijering
* @version	1.00
**/


import com.jeroenwijering.players.*;


class com.jeroenwijering.players.MP3Model extends AbstractModel { 


	/** array with extensions used by this model **/
	private var activeExtensions:Array = new Array("mp3");
	/** Sound instance **/
	private var soundObject:Sound;
	/** interval ID of the buffer update function **/
	private var loadedInterval:Number;
	/** current percentage of the sound that's loaded **/
	private var currentLoaded:Number;
	/** interval ID of the position update function **/
	private var positionInterval:Number;
	/** current position of the sound that is playing **/
	private var currentPosition:Number = 0;
	/** Duration of the current sound **/
	private var soundDuration:Number = 0;
	/** current state of the sound that is playing **/
	private var currentState:Number;
	/** Current volume **/
	private var currentVolume:Number;


	/** Constructor **/
	function MP3Model(vws:Array,ctr:AbstractController,car:Object,far:Array) {
		super(vws,ctr,car,far);
	};


	/** MP3 override of the default getChange handler **/
	public function getChange(typ:String,prm:Number):Void {
		switch(typ) {
			case "item":
				setItem(prm);
				break;
			case "start": 
				isActive == true ? startSound(prm): clearInterval(loadedInterval);
				break;
			case "stop":
				isActive == true ? stopSound(prm): null;
				break;
			case "volume":
				setVolume(prm);
				break;
		}
	};


	/** Play a specific sound
	*
	* @param pos	Start position of the sound
	**/
	private function startSound(pos:Number) {
		clearInterval(positionInterval);
		if(fileArray[currentItem]["file"] != currentURL) {
			var ref = this;
			clearInterval(loadedInterval);
			currentURL = fileArray[currentItem]["file"];
			delete soundObject;
			soundObject = new Sound(configArray["playerclip"]);
			soundObject.onSoundComplete = function() {
				ref.sendUpdate("state",3);
				ref.sendCompleteEvent();
			};
			//soundObject.start(0);
			//soundObject.stop();
			soundObject.loadSound(currentURL,true);
			soundObject.setVolume(currentVolume);
			sendUpdate("load",0);
			loadedInterval = setInterval(this,"updateLoaded",200);
		}
		pos == undefined ? null: currentPosition = pos*soundDuration/100;
		soundObject.start(currentPosition);
		sendUpdate("state",2);
		updatePosition();
		positionInterval = setInterval(this,"updatePosition",200);
	};


	/** Read and broadcast the amount of the mp3 that's currently loaded **/
	private function updateLoaded() {
		var pct:Number = Math.round(soundObject.getBytesLoaded() / soundObject.getBytesTotal() * 100);
		if(isNaN(pct)) {
			currentLoaded = 1;
		} else if (pct != currentLoaded) {
			currentLoaded= pct;
			sendUpdate("load",currentLoaded);
		} else if(pct == 100) {
			clearInterval(loadedInterval);
			sendUpdate("load",100);
		}
	};


	/** Read and broadcast the current position of the song **/
	private function updatePosition() {
		var pos = soundObject.position/1000;
		// switch to buffer
		if(pos == currentPosition && currentState != 1) {
			sendUpdate("state",1);
			currentState = 1;
		// switch to play
		} else if (pos != currentPosition && currentState != 2) { 
			sendUpdate("state",2);
			currentState = 2;
		} 
		// send time update
		if (pos != currentPosition) {
			currentPosition = pos;
			soundDuration = soundObject.duration/(10*currentLoaded);
			sendUpdate("time",currentPosition,soundDuration-currentPosition);
		}
	};


	/** Stop the sound that's currently playing.
	*
	* @param pos	position to stop the sound at.
	**/
	private function stopSound(pos:Number) {
		soundObject.stop();
		clearInterval(positionInterval);
		if(pos != undefined) {
			currentPosition = pos*soundDuration/100;
			sendUpdate("time",currentPosition,soundDuration-currentPosition);
		}
		currentState = 0;
		sendUpdate("state",0);
	};


	/** Set volume of the sound object. **/
	private function setVolume(vol:Number) {
		currentVolume = vol;
		soundObject.setVolume(vol);
		isActive == true ? sendUpdate("volume",vol): null;
	};


}