/**
* Playlist view management of the players MCV pattern.
*
* @author	Jeroen Wijering
* @version	1.00
**/


import com.jeroenwijering.players.*;
import com.jeroenwijering.utils.*;


class com.jeroenwijering.players.PlaylistView extends AbstractView { 


	/** ImageLoader **/
	var thumbLoader:ImageLoader;
	/** scroller instance **/
	var listScroller:Scroller;
	/** playlist item that is currently highlighted **/
	var currentItem:Number;


	/** Constructor **/
	function PlaylistView(ctr:AbstractController,car:Object,far:Array) {
		super(ctr,car,far);
	};


	/** onLoad event handler; sets up the playlist sizes and colors. **/
	private function onLoad() {
		var ref = this;
		var tgt = configArray["playerclip"].playlist;
		tgt.btn._visible = false;
		// iterate playlist and setup each button
		for(var i=0; i<fileArray.length; i++) {
			// set text and background
			tgt.btn.duplicateMovieClip("btn"+i,i);
			tgt["btn"+i].txt.autoSize = true;
			tgt["btn"+i].col = new Color(tgt["btn"+i].bck);
			tgt["btn"+i].col.setRGB(configArray["frontcolor"]);
			tgt["btn"+i].bck._width = configArray["width"]-2;
			tgt["btn"+i].bck.onRollOver = function() { 
				this._parent.txt.textColor = ref.configArray["lightcolor"];
				if(ref.currentItem != this._parent.getDepth()) {
					Animations.fadeIn(this,50);
				}
			};
			tgt["btn"+i].bck.onRollOut = function() { 
				this._parent.txt.textColor = ref.configArray["frontcolor"];
				if(ref.currentItem != this._parent.getDepth()) {
					Animations.fadeOut(this,10);
				}
			};
			tgt["btn"+i].bck.onRelease = function() {
				ref.sendEvent("playitem",this._parent.getDepth());
			};
			// set thumbnails
			if(configArray["thumbsinplaylist"] == "true") {
				tgt["btn"+i].bck._height = 40;
				tgt["btn"+i].icn._y += 9;
				tgt["btn"+i].txt._x += 60;
				tgt["btn"+i]._y = i*41;
				thumbLoader = new ImageLoader(tgt["btn"+i].img,true,60,40);
				thumbLoader.loadImage(fileArray[i]["image"]);
				if(fileArray[i]["author"]  == undefined) {
					tgt["btn"+i].txt.htmlText = "<b>"+(i+1)+ "</b>:<br />" + fileArray[i]["title"];
				} else {
					tgt["btn"+i].txt.htmlText = "<b>"+fileArray[i]["author"] + "</b>:<br />" + fileArray[i]["title"];
				}
				tgt["btn"+i].img.setMask(tgt["btn"+i].msk);
			} else {
				tgt["btn"+i].msk._height = 20;
				tgt["btn"+i].img._visible = tgt["btn"+i].msk._visible = false;
				tgt["btn"+i]._y = i*23;
				if(fileArray[i]["author"]  == undefined) {
					tgt["btn"+i].txt.htmlText = fileArray[i]["title"];
				} else {
					tgt["btn"+i].txt.htmlText = fileArray[i]["author"] + " - " + fileArray[i]["title"];
				}
			}
			tgt["btn"+i].txt.textColor = configArray["frontcolor"];
			// set link icon
			if(fileArray[i]["link"] != undefined) {
				tgt["btn"+i].icn._x = Number(configArray["width"]) - 24;
				tgt["btn"+i].col2 = new Color(tgt["btn"+i].icn);
				tgt["btn"+i].col2.setRGB(configArray["frontcolor"]);
				tgt["btn"+i].icn.onRollOver = function() { 
					this._parent.col2.setRGB(ref.configArray["lightcolor"]);
				};
				tgt["btn"+i].icn.onRollOut = function() { 
					this._parent.col2.setRGB(ref.configArray["frontcolor"]);
				};
				tgt["btn"+i].icn.onPress = function() { 
					ref.sendEvent("getlink",this._parent.getDepth());
				};
			} else { 
				tgt["btn"+i].icn._visible = false;
			}
		}
		// setup mask and scrollbar if needed
		var msk = configArray["playerclip"].playlistmask;
		msk._y = tgt._y = Number(configArray["displayheight"]) + 19;
		msk._width = Number(configArray["width"]-2);
		msk._height = Number(configArray["height"])-Number(configArray["displayheight"]) - 20;
		tgt.setMask(msk);
		if(tgt._height > msk._height) {
			if(configArray["autoscroll"] == "false") {
				msk._width -= 11;
				for(var i=0; i<fileArray.length; i++) {
					tgt["btn"+i].bck._width -= 11;
					tgt["btn"+i].icn._x -= 11;
				}
				listScroller = new Scroller(tgt,msk,false,configArray["frontcolor"],configArray["lightcolor"]);
			} else {	
				listScroller = new Scroller(tgt,msk,true,configArray["frontcolor"],configArray["lightcolor"]);
			}
		}
	};


	/** Update handler override for playlist view (only new item) **/
	public function getUpdate(typ:String,pr1:Number,pr2:Number):Void { 
		switch(typ) {
			case "item":
				setItem(pr1);
				break;
		}
	};


	/** 
	* Set a new item as the current playing one 
	*
	* @param itm	item to set
	**/
	private function setItem(itm:Number):Void {
		// set old item to 10% frontcolor
		var tgt = configArray["playerclip"].playlist;
		tgt["btn"+currentItem].col.setRGB(configArray["frontcolor"]);
		tgt["btn"+currentItem].bck._alpha = 10;
		currentItem = itm;
		// set new item to 50% lightcolor
		tgt["btn"+currentItem].col.setRGB(configArray["lightcolor"]);
		tgt["btn"+currentItem].bck._alpha = 50;
		tgt["btn"+currentItem].txt.textColor = configArray["frontcolor"];
		// scroll to new item
		if(configArray["autoscroll"] == "false") {
			listScroller.scrollTo(tgt["btn"+currentItem]._y);
		}
	};

}