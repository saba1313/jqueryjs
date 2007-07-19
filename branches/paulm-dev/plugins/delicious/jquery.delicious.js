/*
 * Del.icio.us jQuery plugin
 *
 * Copyright (c) 2007 Paul McLanahan
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id$
 *
 */

(function($){

/**
 * Load a list of bookmarks or tags from del.icio.us for
 * a specific user.
 *
 * @param String user The del.icio.us user who's bookmarks you want to load.
 * @param Map options key/value pairs of optional settings for the list display.
 * @option String type (posts|tags|network|fans) The type of information you wish to retrieve. Default: 'posts'
 * @option String itemTag The type of HTML element you wish to surround every item in the list. Default: '<li>'
 * @option String wrapTag The type of HTML element you wish to surround the entire list. Default: '<ul>'
 * @option Boolean append If true, this will cause the new list to be appended to the selected elements, if false it will replace it's contents with the list. Default: true
 * @option Boolean favicon If true and the type option is posts, this will attempt to load the favicon.ico file from the domain of each bookmark. Default: true
 * @param Map tOptions key/value pairs of optional settings for the list itself.
 * @option Interger count Available for types 'posts' and 'tags'. Indicates the number of items to retrieve.
 * @option Interger atleast Available for type 'tags'. Select only tags with this minimum number of posts associated.
 * @option String sort (alpha|count) Available for type 'tags'. Sort the list alphanumerically or by number of posts respectively.
 *
 * @type jQuery
 * @name Del.icio.us
 * @cat Plugins/Delicious
 *
 */
$.fn.delicious = function(user,options,tOptions,fName){
	//options.instance = $.delicious.these.length;
	$.delicious.these[0] = this;
	$.delicious(user,options,tOptions,fName);
	return this;
};

$.delicious = function(user,options,tOptions,fName){
	options.user = user;
	var opts = $.extend($.delicious.opts,options),
		fn = fName || 'jQuery.delicious.parsers.'+opts.type,
		url = 'http://del.icio.us/feeds/json/' + (opts.type=='posts'?'':opts.type+'/') + user
			+ (opts.type=='posts' && opts.tag? '/'+opts.tag : '') + '?',
		rOpts = $.extend({raw:'true',callback:fn},$.delicious.types[opts.type],tOptions);

	url += $.param(rOpts);
	if(document.createElement){
		var oScript = document.createElement("script");
		oScript.src = url;
		document.body.appendChild(oScript);
	}
	else
		$('body').append('<scr'+'ipt type="text/javascript" src="'+url+'"><\/script>');
};

$.extend($.delicious,{
	these : [],
	opts : {
		type : 'posts', // possible values = posts, tags, url, network, or fans
		itemTag : 'li',
		wrapTag : 'ul',
		append : true,
		favicon : true
	},
	
	types : {
		posts : {
			count : 20
		},
		tags : {
			count : 20,
			atleast : 1,
			sort : 'alpha'
		},
		network : {},
		fans : {}
	},
	
	parsers : {
		posts : function(data){
			var opts = $.delicious.opts,
				lis = [];
				
			$.each(data,function(){
				var fIcon, oSpan;
				if(opts.favicon)
					fIcon = $.IMG({src:this.u.split('/').splice(0,3).join('/')+'/favicon.ico',height:16,width:16,border:0})
				lis[lis.length] = $[opts.itemTag.toUpperCase()]({},
					$.A({href:this.u}, opts.favicon ? fIcon : '',
						oSpan = $.SPAN({},this.d)
					)
				);
				if(opts.favicon){
					$(fIcon).css({display:'none',position:'absolute'})
						.bind('load',function(){$(this).show('slow')});
					$(oSpan).css('margin-left','20px');
				}
				
				/*
				var item = [];
				item[item.length] = '<a href="';
				item[item.length] = this.u;
				item[item.length] = '">';
				if(opts.favicon){
					item[item.length] = '<img src="';
					item[item.length] = this.u.split('/').splice(0,3).join('/')+'/favicon.ico';
					item[item.length] = '" style="display:none;position:absolute" height="16" width="16" border="0" /><span style="margin-left:20px">';
				}
				item[item.length] = this.d;
				if(opts.favicon)
					item[item.length] = '</span>';
				item[item.length] = '</a>';
				$obj.append($(opts.itemTag).append(item.join(''))).find('img').bind('load',function(){$(this).show('slow')});
				*/
			});
			
			$.delicious.add($[opts.wrapTag.toUpperCase()]({},lis));
			//$.delicious.add($obj);
		},
		tags : function(data){
			var $obj = $($.delicious.opts.wrapTag),
				opts = $.delicious.opts;
			$.each(data,function(name){
				var item = [];
				item[item.length] = '<a href="';
				item[item.length] = 'http://del.icio.us/'+opts.user+'/'+name;
				item[item.length] = '">';
				item[item.length] = name + ' ('+this+')';
				item[item.length] = '</a>';
				$obj.append($(opts.itemTag).append(item.join('')));
			});
			$.delicious.add($obj);
		},
		network : function(){
		
		},
		fans : function(){
		
		}
	},
	
	add : function(obj){
	// TODO: figure out a way to have more than one per page
	//		the 'these' variable was a failed attempt at that.
		var opts = $.delicious.opts;
		$.delicious.these[0][opts.append?'append':'html'](obj);
	}
	
});



// DOM element creator for jQuery and Prototype by Michael Geary
// http://mg.to/topics/programming/javascript/jquery
// Inspired by MochiKit.DOM by Bob Ippolito
// Free beer and free speech. Enjoy!

$.defineTag = function( tag ) {
	$[tag.toUpperCase()] = function() {
		return $._createNode( tag, arguments );
	}
};

(function() {
	var tags = [
		'a', 'br', 'button', 'canvas', 'div', 'fieldset', 'form',
		'h1', 'h2', 'h3', 'hr', 'img', 'input', 'label', 'legend',
		'li', 'ol', 'optgroup', 'option', 'p', 'pre', 'select',
		'span', 'strong', 'table', 'tbody', 'td', 'textarea',
		'tfoot', 'th', 'thead', 'tr', 'tt', 'ul' ];
	for( var i = tags.length - 1;  i >= 0;  i-- ) {
		$.defineTag( tags[i] );
	}
})();

$.NBSP = '\u00a0';

$._createNode = function( tag, args ) {
	var fix = { 'class':'className', 'Class':'className' };
	var e;
	try {
		var attrs = args[0] || {};
		e = document.createElement( tag );
		for( var attr in attrs ) {
			var a = fix[attr] || attr;
			e[a] = attrs[attr];
		}
		for( var i = 1;  i < args.length;  i++ ) {
			var arg = args[i];
			if( arg == null ) continue;
			if( arg.constructor != Array ) append( arg );
			else for( var j = 0;  j < arg.length;  j++ )
				append( arg[j] );
		}
	}
	catch( ex ) {
		alert( 'Cannot create <' + tag + '> element:\n' +
			args.toSource() + '\n' + args );
		e = null;
	}
	
	function append( arg ) {
		if( arg == null ) return;
		var c = arg.constructor;
		switch( typeof arg ) {
			case 'number': arg = '' + arg;  // fall through
			case 'string': arg = document.createTextNode( arg );
		}
		e.appendChild( arg );
	}
	
	return e;
};

})(jQuery);

