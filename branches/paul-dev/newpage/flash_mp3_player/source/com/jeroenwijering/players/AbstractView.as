/**
* Basic view class of the players MCV pattern, extended by all views.
* Create you own views by extending this one.
*
* @author	Jeroen Wijering
* @version	1.00
**/


import com.jeroenwijering.players.*;


class com.jeroenwijering.players.AbstractView { 


	/** Controller reference **/
	private var controller:AbstractController;
	/** reference to the config array **/
	private var configArray:Object;
	/** reference to the file array **/
	private var fileArray:Array;


	/**
	* Constructor
	*
	* @param ctr	reference to the PlayerController
	* @param car	reference to the player's config array
	* @param far	reference to the player's file array
	**/
	function AbstractView(ctr:AbstractController,car:Object,far:Array) {
		controller = ctr;
		configArray = car;
		fileArray = far;
		onLoad();
	};


	/** onLoad event handler; sets up the view. **/
	private function onLoad() { };


	/**
	* Receive updates from the models.
	* 
	* The updates events are catched (parameter between brackets):
	* state(0:'play',1:'pause',2:'buffer',3:conplete),buffer(percent),
	* time(elapsed,remaining),volume(percent),item(index)
	* 
	* @param typ	event type
	* @param prm	parameter value
	* @param pr2	second parameter value
	**/
	public function getUpdate(typ:String,pr1:Number,pr2:Number):Void { 
		switch(typ) {
			case "state": 
				var arr = new Array("stop","buffer","play","complete");
				trace("new state: "+arr[pr1]);
				break;
			case "load":
				trace("new load: "+pr1+"%");
				break;
			case "time":
				trace("new time: "+pr1+" elapsed / "+pr2+" remaining");
				break;
			case "item":
				trace("new item: "+pr1);
				break;
			case "volume":
				trace("volume: "+pr1);
				break;
			default:
				trace("View: incompatible update received");
				break;
		}
	};


	/**
	* Send event to the controller.
	*
	* @param typ	the event tyle (eg. "volume")
	* @param prm	(optional) the event parameter  (eg. 80)
	**/	
	public function sendEvent(typ:String,prm:Number) {
		controller.getEvent(typ,prm);	
	};


}