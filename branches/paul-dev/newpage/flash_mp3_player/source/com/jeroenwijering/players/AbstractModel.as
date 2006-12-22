/**
* Abstract model class of the players MCV pattern, extended by all models.
*
* @author	Jeroen Wijering
* @version	1.01
**/


import com.jeroenwijering.players.*;


class com.jeroenwijering.players.AbstractModel {


	/** a list of all registered views **/
	private var registeredViews:Array;
	/** a reference to the controller (for completes) **/
	private var controller:AbstractController;
	/** reference to the config array **/
	private var configArray:Object;
	/** reference to the file array **/
	private var fileArray:Array;
	/** item that's currently playing **/
	private var currentItem:Number;
	/** url of the item that's currently used by this model **/
	private var currentURL:String;
	/** array with extensions used by this model **/
	private var activeExtensions:Array;
	/** boolean to check if this model is currently active **/
	private var isActive:Boolean;


	/**
	* Constructor
	*
	* @param	vws		an array with all views to register
	* @param	ply		reference to the mediaplayer (for file and config array)
	**/
	function AbstractModel(vws:Array,ctr:AbstractController,car:Object,far:Array) {
		registeredViews = vws;
		controller = ctr;
		configArray = car;
		fileArray = far;
	};


	/**
	* Receive changes from the PlayerController.
	* 
	* @param	typ		event type
	* @param	par		parameter value
	**/
	public function getChange(typ:String,prm:Number):Void {
		switch(typ) {
			case "item": 
				trace("new item: "+prm);
				setItem(prm);
				break;
			case "start": 
				trace("start: "+prm);
				break;
			case "stop":
				trace("stop: "+prm);
				break;
			case "volume":
				trace("new volume: "+prm);
				setVolume(prm);
				break;
			default:
				trace("Model: incompatible change received");
				break;
		}
	};


	/**
	* Set new item and check if the model should be the active one.
	* If so, the model forwards the new item to the views.
	*
	* @param idx	fileArray index of the item to check
	**/
	private function setItem(idx:Number) {
		currentItem = idx;
		var fnd:Boolean = false;
		for (var i=0; i<activeExtensions.length; i++) {
			if(fileArray[idx]["file"].toLowerCase().indexOf(activeExtensions[i]) > -1 ) { 
				fnd = true;
			}
		}
		if(fnd == true) {
			isActive = true;
			sendUpdate("item",idx);
		} else {
			isActive = false;
		}
	};


	/** Set volume of the sound object. **/
	private function setVolume(vol:Number) {
		isActive == true ? sendUpdate("volume",vol): null;
	};


	/**
	* Send updates to the views. A limited number of views can be sent: 
	* The updates events are catched (parameter between brackets):
	* state(0:play,1:pause,2:buffer,load(percent),time(elapsed,remaining),item(index),volume(percent)
	*
	* @param	typ		the event tyle (eg. "volume")
	* @param	prm		(optional) the event parameter  (eg. 80)
	**/	
	private function sendUpdate(typ:String,prm:Number,pr2:Number) {
		for(var i=0; i<registeredViews.length; i++) {
			registeredViews[i].getUpdate(typ,prm,pr2);
		}
	};


	/**
	* Send the "complete" event directly to the controller.
	**/	
	private function sendCompleteEvent() {
		controller.getEvent("complete");
	};

}