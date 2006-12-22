/**
* FLV model class of the players MCV pattern.
*
* @author	Jeroen Wijering
* @version	1.02
**/


import com.jeroenwijering.players.*;


class com.jeroenwijering.players.FLVModel extends AbstractModel { 


	/** array with extensions used by this model **/
	private var activeExtensions:Array = new Array("flv","rtmp://");
	/** NetConnection object reference **/
	private var connectObject:NetConnection;
	/** NetStream object reference **/
	private var streamObject:NetStream;
	/** Sound object reference **/
	private var soundObject:Sound;
	/** interval ID of the buffer update function **/
	private var loadedInterval:Number;
	/** current percentage of the video that's loaded **/
	private var currentLoaded:Number;
	/** interval ID of the position update function **/
	private var positionInterval:Number;
	/** current position of the video that is playing **/
	private var currentPosition:Number;
	/** Duration metadata of the current video **/
	private var metaDuration:Number;
	/** current state of the video that is playing **/
	private var currentState:Number;
	/** Current volume **/
	private var currentVolume:Number;
	/** MovieClip with "display" video Object  **/
	private var videoClip:MovieClip;
	/** object with keyframe times and positions, saved for PHP streaming **/
	private var metaKeyframes:Object = new Object();


	/** Constructor **/
	function FLVModel(vws:Array,ctr:AbstractController,car:Object,far:Array,fcl:MovieClip) {
		super(vws,ctr,car,far);
		// set sound and videodisplay
		connectObject = new NetConnection();
		videoClip = fcl;
		videoClip.display.smoothing = true;
		videoClip.display.deblocking = 4;
		videoClip.createEmptyMovieClip("snd", videoClip.getNextHighestDepth());
		soundObject = new Sound(videoClip.snd);
	};


	/** 
	* Scaling the movie so dimensions won't get distorted
	*
	* @param wid	original width of the FLV
	* @param hei	original height of the FLV
	**/
	private function scaleMovie(wid:Number,hei:Number):Void {
		// calculate scale ratios properties
		var xsr:Number = configArray["width"]/wid;
		var ysr:Number = configArray["displayheight"]/hei;
		// scale image
		if (xsr < ysr && configArray["overstretch"] == "false" || ysr < xsr && configArray["overstretch"] == "true") { 
			videoClip._width = wid*xsr;
			videoClip._height = hei*xsr;
		} else { 
			videoClip._width = wid*ysr;
			videoClip._height = hei*ysr;
		}
		// put image in middle
		videoClip._x = configArray["width"]/2 - videoClip._width/2;
		videoClip._y = configArray["displayheight"]/2 - videoClip._height/2;
	};


	/** 
	* FLV override of the default getChange handler 
	*
	* @param typ	the type of change 
	* @param prm	the change parameter
	**/
	public function getChange(typ:String,prm:Number) {
		switch(typ) {
			case "item":
				setItem(prm); 
				if (isActive == false) {
					videoClip._visible = false;
					streamObject.close();
				}
				break;
			case "start": 
				isActive == true ? startVideo(prm): clearInterval(loadedInterval);
				break;
			case "stop":
				isActive == true ? stopVideo(prm): null;
				break;
			case "volume":
				setVolume(prm);
				break;
		}
	};


	/**
	* Play a specific video
	*
	* @param pos	start position of the movie
	**/
	private function startVideo(pos:Number) {
		clearInterval(positionInterval);
		if ((fileArray[currentItem]["file"].indexOf("rtmp://") ==  -1 && fileArray[currentItem]["file"] != currentURL) ||
			(fileArray[currentItem]["file"].indexOf("rtmp://") !=  -1 && fileArray[currentItem]["id"] != currentURL)) {
			clearInterval(loadedInterval);
			streamObject.close();
			metaDuration = undefined;
			// set netstream for progressive and streaming
			if(fileArray[currentItem]["file"].indexOf("rtmp://") == -1) {
				connectObject.connect(null);
				streamObject = new NetStream(connectObject);
				currentURL = fileArray[currentItem]["file"];
				if(configArray["streamscript"] == "undefined") {
					sendUpdate("load",0);
					loadedInterval = setInterval(this,"updateLoaded",200);
				} else {
					currentLoaded = 99;
					sendUpdate("load",100);
				}
			} else {
				connectObject.connect(fileArray[currentItem]["file"]);
				streamObject = new NetStream(connectObject);
				currentURL = fileArray[currentItem]["id"];
				currentLoaded = 99;
				sendUpdate("load",100);
			}
			// attach video and set handlers
			streamObject.setBufferTime(configArray["bufferlength"]);
			var ref = this;
			streamObject.onMetaData = function(obj) {
				trace("meta: "+obj.duration+" / "+obj.width+"-"+obj.height);
				obj.duration > 1 ? ref.metaDuration = obj.duration: null;
				obj.width < 10 ? null: ref.scaleMovie(obj.width,obj.height);
				ref.metaKeyframes = obj.keyframes;
				delete this.onMetaData;
			};
			streamObject.onStatus = function(object) {
				if(object.code == "NetStream.Play.Stop") {
					ref.sendUpdate("state",3);
					ref.sendCompleteEvent();
					ref.videoClip._visible = false;
					delete this.onStatus;
				}
			};
			videoClip.display.attachVideo(streamObject);
			videoClip.snd.attachAudio(streamObject);
			// start playing
			configArray["streamscript"] == "undefined" ? streamObject.play(currentURL): streamObject.play(configArray["streamscript"]+"?file="+currentURL);
		}
		streamObject.pause(false);
		if (pos != undefined) {
			currentPosition = pos*metaDuration/100;
			if(configArray["streamscript"] == "undefined") {
				streamObject.seek(currentPosition);
			} else {	
				for (var i=0; i< metaKeyframes.times.length; i++) {
					if((metaKeyframes.times[i] <= currentPosition) && (metaKeyframes.times[i+1] >= currentPosition)) {
						streamObject.play(configArray["streamscript"]+"?file="+currentURL+"&pos="+metaKeyframes.filepositions[i]);
						break;
					}
				}
			}
		}
		positionInterval = setInterval(this,"updatePosition",200);
	};


	/** Read and broadcast the amount of the flv that's currently loaded **/
	private function updateLoaded() {
		var pct:Number = Math.round(streamObject.bytesLoaded/streamObject.bytesTotal*100);
		if(isNaN(pct)) {
			currentLoaded = 0;
		} else if (pct != currentLoaded) {
			currentLoaded= pct;
		} 
		if(pct >= 100) { 
			clearInterval(loadedInterval);
		}	
		sendUpdate("load",currentLoaded);
	};


	/** Read and broadcast the current position of the song **/
	private function updatePosition() {
		var pos = streamObject.time;
		// switch to buffer
		if(pos == currentPosition && currentState != 1 && streamObject.bufferLength < configArray["bufferlength"]-1) {
			sendUpdate("state",1);
			currentState = 1;
		// switch to play
		} else if (pos != currentPosition && currentState != 2) { 
			sendUpdate("state",2);
			currentState = 2;
			videoClip._visible = true;
		} 
		// set new position
		if (pos != currentPosition) {
			currentPosition = pos;
			sendUpdate("time",currentPosition,metaDuration-currentPosition);
		// send complete if buffer is flushed
		} else if (streamObject.bufferLength < 1 && currentLoaded == 100 && currentPosition > 1) {
			videoClip._visible = false;
			sendUpdate("state",3);
			sendCompleteEvent();
		}
	};


	/** 
	* Stop the sound that's currently playing. 
	*
	* @param pos	stop position of the movie
	**/
	private function stopVideo(pos:Number) {
		clearInterval(positionInterval);
		if(pos != undefined) {
			pos == 0 ? currentPosition = 0: currentPosition = pos*metaDuration/100;
			sendUpdate("time",currentPosition,metaDuration-currentPosition);
			streamObject.seek(currentPosition);
		}
		streamObject.pause(true);
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