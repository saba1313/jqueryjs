/**
* Parses RSS, XSPF and general XML lists and returns it as an array. 
*
* RSS and XSPF are returned in a numerical array with these items:
* [title,author,file,link,image,category,id,start(XSPF),end(XSPF),description(RSS),date(RSS),latitude(RSS),longitude(RSS)]
*
* Other XML lists (1 or 2 levels deep) are loaded 1 on 1 into the array. 
*
* An onParseComplete event is broadcasted upon succesful completion.
*
* @example
* parseObj = new com.jeroenwijering.utils.XMLParser();
* parseObj.onParseComplete = function() { trace(this.parseArray.length); };
* parseObj.parse("http://www.jeroenwijering.com/rss/");
*
* @author	Jeroen Wijering
* @version	1.15
**/


class com.jeroenwijering.utils.XMLParser {


	/** URL of the xml file to parse. **/
	private var parseURL:String;
	/** The array the XML is parsed into **/
	public var parseArray:Array; 
	/** Flash XML object the file is loaded into. **/
	private var parseXML:XML;
	/** Tags allowed for XSPF Format **/
	private var XSPF_TAGS:Object = {
		title:"title",
		creator:"author",
		info:"link",
		location:"file",
		image:"image",
		identifier:"id",
		album:"category"
	};
	/** Tags allowed for RSS Format **/
	private var RSS_TAGS:Object = {
		title:"title",
		author:"author",
		link:"link",
		guid:"id",
		category:"category"
	};
	/** Supporting array to translate RFC2822 months to number. **/
	private var MONTHS_TO_INTEGERS:Object = {
		January:0,
		February:1,
		March:2,
		April:3,
		May:4,
		June:5,
		July:6,
		August:7,
		September:8,
		October:9,
		November:10,
		December:11,
		Jan:0,
		Feb:1,
		Mar:2,
		Apr:3,
		May:4,
		Jun:5,
		Jul:6,
		Aug:7,
		Sep:8,
		Oct:9,
		Nov:10,
		Dec:11
	};
	                       


	/**Constructor. Nothing there. **/
	function XMLParser() { };


	/** 
	* Parse an XML list.
	*
	* @param url	URL of the playlist that should be parsed.
	* @param rst	Optional filetypes the parser should restrict to (eg: ['.mp3','.jpg']).
	**/
	public function parse(url:String):Void {
		parseURL = url;
		parseArray = new Array();
		var parser:XMLParser= this;
		// initializing the XML  object
		parseXML = new XML();
		parseXML.ignoreWhite = true;
		parseXML.onLoad = function(success:Boolean) { 
			if(success) {
				// check playlist format and jump to structure parser
				var fmt = this.firstChild.nodeName.toLowerCase();
				if( fmt == 'rss') {	
					parser.parseRSS();
				} else if (fmt == 'feed') {
					parser.parseASF();
				} else if (fmt == 'playlist') {
					parser.parseXSPF();
				} else {
					parser.parseGeneral();
				}
			} else {
				// return error if loading failed
				parseArray.push({title:"File not found: "+parser.parseURL});
			}
			// dispatch event and delete xml
			delete parser.parseXML;
			parser.onParseComplete();
		};
		// start loading xml with rand to prevent caching and without rand for local files
		if(_root._url.indexOf("file://") > -1) {
			parseXML.load(parseURL);
		} else if(parseURL.indexOf('?') > -1) {
			parseXML.load(parseURL+'&'+random(999)); 
		} else {
			parseXML.load(parseURL+'?'+random(999));
		}
	};


	/** Convert RSS structure to array. **/
	private function parseRSS():Void {
		//crappy hack to add RSS tags with a ':' included
		RSS_TAGS["itunes:author"] = "author";
		RSS_TAGS["geo:lat"] = "latitude";
		RSS_TAGS["geo:long"] = "longitude";
		//on to the real parsing
		var tpl = parseXML.firstChild.firstChild.firstChild;
		while(tpl != null) { 
			if (tpl.nodeName.toLowerCase() == "item") {
					var obj = new Object();
					for(var j=0; j<tpl.childNodes.length; j++) {
						var nod:XMLNode = tpl.childNodes[j];
						// straightforward copies
						if(RSS_TAGS[nod.nodeName.toLowerCase()] != undefined) {
							obj[RSS_TAGS[nod.nodeName.toLowerCase()]] = nod.firstChild.nodeValue; 
						// special translations
						} else if(nod.nodeName.toLowerCase() == "description") {
							obj["description"] = stripTagsBreaks(nod.firstChild.nodeValue);
						} else if(nod.nodeName.toLowerCase() == "pubdate") {
							obj["date"] = rfc2Date(nod.firstChild.nodeValue);
						} else if(nod.nodeName.toLowerCase() == "media:thumbnail") {
							obj["image"] = nod.attributes.url;
						} else if(nod.nodeName.toLowerCase() == "itunes:image") {
							obj["image"] = nod.attributes.href;
						} else if(	(nod.nodeName.toLowerCase() == "enclosure" || nod.nodeName.toLowerCase() == "media:content") && 
									(nod.attributes.type == "audio/mpeg" || nod.attributes.type == "video/x-flv" || 
									 nod.attributes.type == "image/jpeg" || nod.attributes.type == "image/png" || nod.attributes.type == "image/gif")) {
							obj["file"] = nod.attributes.url;
						} else if(nod.nodeName.toLowerCase() == "media:group") { 
							for(var k=0; k< nod.childNodes.length; k++) {
								nod.childNodes[k].attributes.type.toLowerCase() == "video/x-flv" ? obj["file"] = nod.childNodes[k].attributes.url: null;
								nod.childNodes[k].nodeName.toLowerCase() == "media:thumbnail" ? obj["image"] = nod.childNodes[k].attributes.url: null;
							}
						}
					}
					obj["file"] == undefined ? null: parseArray.push(obj);
			} 
			tpl = tpl.nextSibling;
		}
		parseArray.length == 0 ? parseArray.push({title:"Wrongly formatted or empty XML file"}): null;
	};


	/** Convert ATOM structure to array **/
	private function parseASF():Void {
		var tpl = parseXML.firstChild.firstChild;
		while(tpl != null) { 
			//parseArray.push({title:"element found: "+tpl.nodeName});
			if (tpl.nodeName.toLowerCase() == "entry") {
					var obj = new Object();
					for(var j=0; j<tpl.childNodes.length; j++) {
						var nod:XMLNode = tpl.childNodes[j];
						// straightforward copies
						if(nod.nodeName.toLowerCase() == "title") {
							obj["title"] = stripTagsBreaks(nod.firstChild.nodeValue);
						} else if(nod.nodeName.toLowerCase() == "link" && nod.attributes.rel == "alternate") {
							obj["link"] =  nod.attributes.href;
						}else if(nod.nodeName.toLowerCase() == "author" && nod.firstChild.nodeType == 1) {
							obj["author"] =  stripTagsBreaks(nod.firstChild.firstChild.nodeValue);
						}else if(nod.nodeName.toLowerCase() == "summary") {
							obj["description"] = stripTagsBreaks(nod.firstChild.nodeValue);
						} else if(nod.nodeName.toLowerCase() == "updated") {
							obj["date"] = rfc2Date(nod.firstChild.nodeValue);
						} else if(	(nod.nodeName.toLowerCase() == "link" && nod.attributes.rel == "enclosure") &&   
									(nod.attributes.type == "audio/mpeg" || nod.attributes.type == "video/x-flv" || 
									 nod.attributes.type == "image/jpeg" || nod.attributes.type == "image/png" || nod.attributes.type == "image/gif")) {
							obj["file"] = nod.attributes.href;
						} 
					}
					obj["file"] == undefined ? null: parseArray.push(obj);
			} 
			tpl = tpl.nextSibling;
		}
		parseArray.length == 0 ? parseArray.push({title:"Wrongly formatted or empty XML file"}): null;
	};


	/** Convert XSPF structure to array. **/
	private function parseXSPF():Void {
		var tpl = parseXML.firstChild.firstChild;
		while(tpl != null) { 
			if (tpl.nodeName == 'trackList') {
				for(var i=0; i<tpl.childNodes.length; i++) {
					parseArray[i] = new Array();
					for(var j=0; j<tpl.childNodes[i].childNodes.length; j++) {
						var nod:XMLNode = tpl.childNodes[i].childNodes[j];
						// straightforward copies
						if(XSPF_TAGS[nod.nodeName.toLowerCase()] != undefined) {
							parseArray[i][XSPF_TAGS[nod.nodeName.toLowerCase()]] = nod.firstChild.nodeValue; 
						// special translations
						} else if( nod.nodeName.toLowerCase() == "meta" && nod.attributes.rel == "http://www.jeroenwijering.com/start") {
							parseArray[i]["start"] = nod.firstChild.nodeValue;
						}
					}
				} 
			}
			tpl = tpl.nextSibling;
		}
		parseArray.length == 0 ? parseArray.push({title:"Wrongly formatted or empty XML file"}): null;
	};


	/** Covert general XML list to array. **/
	private function parseGeneral():Void {
		for(var i=0; i<parseXML.firstChild.childNodes.length; i++) {
			var itm = parseXML.firstChild.childNodes[i];
			// very simple lists, only one level deep
			if(itm.firstChild.nodeName == null) {
				parseArray[itm.nodeName] = itm.firstChild.nodeValue;
			} else {
				parseArray[i] = new Array();
				for(var j=0; j<itm.childNodes.length; j++) {
					parseArray[i][itm.childNodes[j].nodeName] = itm.childNodes[j].firstChild.nodeValue;
				}
			}
		} 
	};


	/** 
	* Strip tags and breaks from a string 
	*
	* @param  str	string to filter
	* @return		filtered string
	**/
	private function stripTagsBreaks(str:String):String {
		var tmp:Array = str.split("\n");
		str = tmp.join("");
		var tmp:Array = str.split("\r");
		str = tmp.join("");
		var i:Number = str.indexOf("<");
		while(i != -1 && i != undefined) {
			var j = str.indexOf(">",i+1);
			j == -1 ? j = str.length -1: null;
			str = str.substr(0,i) + str.substr(j+1,str.length);
			i = str.indexOf("<");
		}
		return str;
	}


	/**
	* Translate RFC2822 date strings (used in RSS) to timestamp.
	*
	* @param dat	Date string to be parsed.
	* @return		Extracted timestamp.
	* @todo			Make function more fool-proof for erroneous implementations.
	**/
	private function rfc2Date(dat):Number {
		if(isNaN(dat)) {
			// split RFC2822 string
			var darr:Array = dat.split(' ');
			// set all data for date
			darr[1] == "" ? darr.splice(1,1) : null;
			var month:Number = MONTHS_TO_INTEGERS[darr[2]];
			var date:Number = darr[1].substring(0,2);
			var year:Number = darr[3];
			var zone = darr[5];
			// also split time string
			var tarr:Array = darr[4].split(':');
			var hour:Number = tarr[0];
			var minute:Number  = tarr[1];
			var second:Number  = tarr[2];
			// transform to timestamp
			// trace(year+' - '+month+' - '+date+' - '+hour+' - '+minute+' - '+second);
			var myDate:Date = new Date(year,month,date,hour,minute,second);
			var stamp = Math.round(myDate.valueOf()/1000);
			// calculate timezone offset back to GMT, for some abbreviations or numerical zone
			if(zone == 'GMT') { 
				break;
			} else if(zone == 'PDT') { 
				stamp -= 3600*7; 
			} else if(zone == 'CEST' || zone == 'CET') { 
				stamp += 3600; 
			} else if(!isNaN(zone)) { 
				stamp -= 3600*Number(zone.substring(1,3)); 
			}
			// return timestamp
			return stamp;
		} else {
			return dat;
		}
	};


	/** Invoked when parsing is completed. **/
	public function onParseComplete() { };


}