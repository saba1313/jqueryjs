/**
* User input management of the players MCV pattern.
*
* @author	Jeroen Wijering
* @version	1.00
**/


import com.jeroenwijering.players.*;
import com.jeroenwijering.utils.*;


class com.jeroenwijering.players.RotatorController extends AbstractController {


	/** Which one of the models to send the changes to **/
	private var currentModel:Number;


	/** Constructor, inherited from super **/
	function RotatorController(car:Object,far:Array) {
		super(car,far);
	};


	/** Override of AbstractController event receiver. **/
	public function getEvent(typ:String,prm:Number):Void { 
		switch(typ) {
			case "playpause":
				playPause();
				break;
			case "prev":
				prevItem();
				break;
			case "next":
				nextItem();
				break;
			case "playitem":
				playItem(prm);
				break;
			case "getlink":
				getLink(prm);
				break;
			case "complete":
				itemComplete();
				break;
		}
	};


	/**
	* Sending the change to the currently active image model.
	* The active model switches on an item switch.
	*
	* @param typ	The type of change
	* @param prm	Parameter of the  change
	**/
	private function sendChange(typ:String,prm:Number):Void {
		if(typ == "item") {
			currentModel == 0 ? currentModel = 1: currentModel = 0;
		}
		registeredModels[currentModel].getChange(typ,prm);
	};


}