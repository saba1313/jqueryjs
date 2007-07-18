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
 * @param Map options key/value pairs of optional settings.
 * @option String type The type of information you wish to retrieve (posts|tags|url|network|fans). Default: 'posts'
 * @option String itemTag The type of HTML element you wish to surround every item in the list. Default: '<li>'
 * @option String wrapTag The type of HTML element you wish to surround the entire list. Default: '<ul>'
 * @option Boolean append If true, this will cause the new list to be appended to the selected elements, if false it will replace it's contents with the list. Default: true
 * @option Boolean favicon If true and the type option is posts, this will attempt to load the favicon.ico file from the domain of each bookmark. Default: true
 *
 * @type jQuery
 * @name Del.icio.us
 * @cat Plugins/Delicious
 *
 */
$.fn.delicious = function(user,options,fName){
	$.delicious.$this = this;
	$.delicious(user,options,fName);
	return this;
};

$.delicious = function(user,options,fName){
	options.user = user;
	var opts = $.extend($.delicious.opts,options),
		fn = fName || 'jQuery.delicious.parsers.'+opts.type,
		url = 'http://del.icio.us/feeds/json/' + (opts.type=='posts'?'':opts.type+'/') + user
			+ (opts.type=='posts' && opts.tag? '/'+opts.tag : '') + '?',
		rOpts = $.extend({raw:'true',callback:fn},$.delicious.types[opts.type]);

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
	opts : {
		type : 'posts', // possible values = posts, tags, url, network, or fans
		itemTag : '<li>',
		wrapTag : '<ul>',
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
		url : {},
		network : {},
		fans : {}
	},
	
	parsers : {
		posts : function(data){
			var opts = $.delicious.opts,
				$obj = $(opts.wrapTag);
				
			$.each(data,function(){
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
			});
			
			$.delicious.add($obj);
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
		url : function(){},
		network : function(){},
		fans : function(){}
	},
	
	add : function($obj){
		var opts = $.delicious.opts;
		$.delicious.$this[opts.append?'append':'html']($obj);
	}
	
});

})(jQuery);