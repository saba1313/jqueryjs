/**
* Keyboard input management of the players MCV pattern.
* SPACE: playpause,LEFT:prev,RIGHT:next,UP:volume+10,DOWN:volume-10
*
* @author	Jeroen Wijering
* @version	1.01
**/


import com.jeroenwijering.players.*;


class com.jeroenwijering.players.InputView extends AbstractView { 


	private var currentVolume:Number;
	private var currentTime:Number;
	private var isSingle:Boolean;


	/** Constructor **/
	function InputView(ctr:AbstractController,car:Object,far:Array) {
		super(ctr,car,far);
		fileArray.length == 1 ? isSingle = true: isSingle = false;
		Key.addListener(this);
	};


	/** Override of the AbstractView's update receiver **/
	public function getUpdate(typ:String,pr1:Number,pr2:Number):Void { 
		switch(typ) {
			case "volume":
				currentVolume = pr1;
				break;
			case "time":
				currentTime = Math.round(pr1/(pr1+pr2)*100);
				break;
		}
	};


	/** KeyDown handler, forwarded by Key object **/
	public function onKeyDown() {
		if (Key.getCode() == 32) { 
			sendEvent("playpause"); 
		} else if (Key.getCode() == 38) {  
			isSingle == true ? sendEvent("scrub",currentTime-10): sendEvent("prev");
		} else if (Key.getCode() == 40) {
				isSingle == true ? sendEvent("scrub",currentTime+10): sendEvent("next");
		} else if (Key.getCode() == 37) {
			sendEvent("volume",currentVolume-10);
		} else if (Key.getCode() == 39) {
			sendEvent("volume",currentVolume+10);
		}
	};


}