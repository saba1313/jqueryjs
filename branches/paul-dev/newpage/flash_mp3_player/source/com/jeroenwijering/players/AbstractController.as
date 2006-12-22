/**
* User input management of the players MCV pattern.
* Holds all functionality the controllers share.
*
* @author	Jeroen Wijering
* @version	1.01
**/


import com.jeroenwijering.players.*;
import com.jeroenwijering.utils.Randomizer;


class com.jeroenwijering.players.AbstractController {


	/** Randomizer instance **/
	private var  randomizer:Randomizer;
	/** array with all registered models **/
	private var registeredModels:Array;
	/** reference to the config array **/
	private var configArray:Object;
	/** reference to the file array **/
	private var fileArray:Array;
	/** Current item **/
	private var currentItem:Number;
	/** Current item **/
	private var isPlaying:Boolean;


	/**
	* Constructor, save arrays and set currentItem.
	*
	* @param car	reference to the config array
	* @param far	reference to the file array
	**/
	function AbstractController(car:Object,far:Array) {
		configArray = car;
		fileArray = far;
		if(configArray["shuffle"] == "true") {
			randomizer = new Randomizer(fileArray);
			currentItem = randomizer.pick();
		} else {
			currentItem = 0;
		}
	};


	/**
	* Complete the build of the MCV cycle and start flow of events.
	*
	* @param mar	Array with all models the controller should send events to
	**/
	public function startMCV(mar:Array) {
		registeredModels = mar;
		sendChange("item",currentItem);
		if(configArray["autostart"] == "false") {
			sendChange("stop",0);
			isPlaying = false;
		} else { 
			sendChange("start",0);
			isPlaying = true;
		}
	};


	/**
	* Receive events from the views.
	* 
	* @param typ	event type
	* @param prm	parameter value
	**/
	public function getEvent(typ:String,prm:Number):Void { 
		switch(typ) {
			case "playpause": 
				trace("event: playpause");
				playPause();
				break;
			case "prev":
				trace("event: prev");
				prevItem();
				break;
			case "next":
				trace("event: next");
				nextItem();
				break;
			case "scrub":
				trace("event: scrub: "+prm+"%");
				setScrub(prm);
				break;
			case "fullscreen":
				trace("event: fullscreen");
				break;
			case "volume":
				trace("event: volume: "+prm+"%");
				break;
			case "playitem":
				playItem(prm);
				trace("event: playitem: "+prm);
				break;
			case "getlink":
				trace("event: getlink: "+prm);
				getLink(prm);
				break;
			case "complete":
				trace("event: complete");
				itemComplete();
				break;
			default:
				trace("Controller: incompatible event received");
				break;
		}
	};


	/** playPause switch **/
	private  function playPause() {
		if(isPlaying == true) {
			isPlaying = false;
			sendChange("stop");
		} else { 
			isPlaying = true;
			sendChange("start");
		}
	};


	/** play previous item **/
	private  function prevItem() {
		if(currentItem == 0) {
			var i:Number = fileArray.length - 1;
		} else { 
			var i:Number = currentItem-1;
		}
		playItem(i);
	};


	/** play next item **/
	private function nextItem() {
		if(currentItem == fileArray.length - 1) {
			var i:Number = 0;
		} else { 
			var i:Number = currentItem+1;
		}
		playItem(i);
	};


	/** Check scrub percentage and forward to model. **/
	private function setScrub(prm) {
		if (prm < 3 ) { prm = 0; } else if (prm > 99) { prm = 99; }
		isPlaying == true ? sendChange("start",prm): sendChange("stop",prm);
	};


	/** Play a new item. **/
	private function playItem(itm:Number) {
		sendChange("stop",0);
		currentItem = itm;
		sendChange("item",itm);
		fileArray[itm]["start"] == undefined ? sendChange("start",0): sendChange("start",fileArray[itm]["start"]);
		isPlaying = true;
	};


	/** Get url from an item if link exists, else playpause. **/
	private function getLink(idx) {
		if(fileArray[idx]["link"] == undefined) { 
			playPause();
		} else {
			getURL(fileArray[idx]["link"] );
		}
	};


	/** Determine what to do if an item is completed **/
	private function itemComplete() { 
		if(configArray["repeat"] == "false") { 
			sendChange("stop",0);
			isPlaying = false;
		} else {
			if(configArray["shuffle"] == "true") {
				var i:Number = randomizer.pick();
			} else if(currentItem == fileArray.length - 1) {
				var i:Number = 0;
			} else { 
				var i:Number = currentItem+1;
			}
			playItem(i);
		}
	};


	/**
	* Sending the change to all registered models.
	*
	* @param typ	The type of change
	* @param prm	Parameter of the  change
	**/
	private function sendChange(typ:String,prm:Number):Void {		
		for(var i=0; i<registeredModels.length; i++) {
			registeredModels[i].getChange(typ,prm);
		}
	};


}