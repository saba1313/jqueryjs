/**
* Javascript user interface management of the players MCV pattern.
*
* @author	Jeroen Wijering
* @version	1.00
**/


import com.jeroenwijering.players.*;
import flash.external.*;


class com.jeroenwijering.players.JavascriptView extends AbstractView { 


	/** Constructor **/
	function JavascriptView(ctr:AbstractController,car:Object,far:Array) {
		super(ctr,car,far);
		if(ExternalInterface.available) {
			var scs:Boolean = ExternalInterface.addCallback("sendEvent",this,sendEvent);
		}
	};


	/** override of the update receiver, forwarding all to javascript **/
	public function getUpdate(typ:String,pr1:Number,pr2:Number):Void { 
		if(ExternalInterface.available) {
			ExternalInterface.call("getUpdate",typ,pr1,pr2);
		}
	};


}