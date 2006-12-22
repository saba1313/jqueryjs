/**
* Callback to serverside script for statistics handling.
* It sends the current file,title,id and state on start and complete of an item.
*
* @author	Jeroen Wijering
* @version	1.00
**/


import com.jeroenwijering.players.*;


class com.jeroenwijering.players.CallbackView extends AbstractView { 


	/** Currently playing item **/
	private var currentItem:Number;
	/** Currently playing item **/
	private var varsObject:LoadVars;
	/** Boolean for if a start call has already been sent for the current item (to prevent multiple start calls) **/
	private var playSent:Boolean;


	/** Constructor **/
	function CallbackView(ctr:AbstractController,car:Object,far:Array) {
		super(ctr,car,far);
		varsObject = new LoadVars();
	};


	/**
	* Override of the AbstractModel's UpdateReceiver
	**/
	public function getUpdate(typ:String,pr1:Number,pr2:Number):Void { 
		switch(typ) {
			case "state":
				if(pr1 == 3) { 
					sendVars("complete");
				} else if (pr1 == 2 && playSent == false) {
					sendVars("play");
					playSent = true;
				}
				break;
			case "item":
				currentItem = pr1;
				playSent = false;
				break;
		}
	};


	/** 
	* sending the current file,title,id,state to an external callback location
	*
	* @param stt	The state change that´s sent to the callback.
	**/
	private function sendVars(stt:String) {
		varsObject.file = fileArray[currentItem]["file"];
		varsObject.title = fileArray[currentItem]["title"];
		varsObject.id = fileArray[currentItem]["id"];
		varsObject.state = stt;
		varsObject.sendAndLoad(configArray["callback"],varsObject,"POST");
	};


}