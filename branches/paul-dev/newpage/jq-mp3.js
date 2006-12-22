/**
 *  This is a modified version of: 
 *  jMP3 v0.2.1 - 10.10.2006 (w/Eolas fix & jQuery object replacement)
 *  by Sean O (http://www.sean-o.com/jquery/jmp3)
 *  Copyright (c) 2006 Sean O (http://www.sean-o.com)
 *  Licensed under the MIT License:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  This plugin was modified by M. Alsup (malsup at gmail dot com) so that its usage was 
 *  consistent with the flash and Quicktime plugins found at: http://malsup.com/jquery/media/
 *  This plugin converts anchor tags into flash objects that play mp3 files using the
 *  Flash Single MP3 Player.
 *  Demos can be found at: http://malsup.com/jquery/media/
 *  @version: 1.0
 *
 *  NOTE: This plugin uses (and requires) the Flash Single MP3 Player found at: 
 *  http://jeroenwijering.com/?item=Flash_Single_MP3_Player
 *
 *
 *  Simple Usage:
 *  ------------
 *  $('a.mp3').mp3();
 *
 *  The sample script above will turn an anchor like this:
 *
 *  <a href="song.mp3" class="mp3">Play my song!</a>
 *
 *  into a div like this:
 *
 *  <div class="mp3"><object ... <embed ...   <br />Play my song!</div>
 *
 *
 *
 *  Advanced Usage:
 *  --------------
 *      $('a.mp3').mp3({
 *          caption:  false,                       // supress caption text
 *          xhtml:    false,                       // use html end-tags
 *          player:   '/media/singlemp3player.swf' // path to mp3 player
 *      });
 *
 *
 *  By default, classnames assigned to the anchor will be assigned to the div.  This makes it
 *  convenient for styling:
 *
 *  <style type="text/css">
 *      a.mp3 { ... }
 *      div.mp3 { ... }
 *  </style>
 *
 *  Options are passed to the 'mp3' function using a single Object.  The options
 *  Object is a hash of key/value pairs.  The following option keys are supported:
 *
 *  Options:
 *  -------
 *  background:  background color of mp3 player* (default: none)
 *  foreground:  foreground color of player buttons* (default: 555555)
 *  width:       width of mp3 player* (default: 450)
 *  height:      height of mp3 player* (default: 370)
 *  volume:      playback volume, 0-100* (default: 50)
 *  repeat:      looping value, yes or no* (default: no)
 *  autoplay:    true of false* (default: false)
 *  cls:         classname(s) to be applied to new element (default: anchor classname)
 *  src:         source location of mp3 file (default: value of href attr)
 *  caption:     text to be used as caption; use false for no caption (default: value of anchor text)
 *  player:      full path to the singlemp3player.swf file (default: current dir)
 *  elementType: type of element to replace anchor (span, div, etc) (default: 'div')
 *  xhtml:       true for xhtml markup, false false for html (default: true)
 *
 *  * background, foreground, height, width, volume, repeat and autoplay values can be embedded 
 *    in the classname using the following syntax:
 *    <a class="mp3 vol:50 autoplay:true bg:fff></a>
 */
jQuery.fn.mp3 = function(options){
    return this.each(function(){
        var $this = jQuery(this);
        var cls = this.className;

        var opts = jQuery.extend({
            background:   ((cls.match(/bg:#?([0-9a-fA-F]+)/)||[])[1]) || '',            // background color
            foreground:   ((cls.match(/fg:#?([0-9a-fA-F]+)/)||[])[1]) ||'555555',       // foreground color (buttons)
            width:        ((cls.match(/w:(\d+)/)||[])[1]) || '25',                      // width of player
            height:       ((cls.match(/h:(\d+)/)||[])[1]) || '20',                      // height of player
            volume:       ((cls.match(/vol:(\d+)/)||[])[1]) || '50',                    // mp3 volume (0-100)
            repeat:       ((cls.match(/repeat:(yes|no)/)||[])[1]) || 'no',              // loop?
            autoplay:     ((cls.match(/autoplay:(true|false)/)||[])[1]) || 'false',     // play immediately on page load?
            showdownload: 'true',                                                       // show download button in player
            cls:          cls,
            src:          $this.attr('href'),
            caption:      $this.text(),
            player:       'singlemp3player.swf',
            elementType:  'div',
            xhtml:        true
        }, options || {});

        var endTag = opts.xhtml ? ' />' : '>';

        var a = ['<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" '];
        a.push('width="' + opts.width + '" height="' + opts.height +'" ');
        a.push('codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab">');
        a.push('<param name="movie" value="' + opts.player + '?');
        a.push('showDownload=' + opts.showdownload + '&file=' + opts.src + '&autoStart=' + opts.autoplay);
        a.push('&backColor=' + opts.background + '&frontColor=' + opts.foreground);
        a.push('&repeatPlay=' + opts.repeat + '&songVolume=' + opts.volume + '"' + endTag);
        a.push('<param name="wmode" value="transparent"'+ endTag);
        a.push('<embed wmode="transparent" width="' + opts.width + '" height="' + opts.height +'" ');
        a.push('src="' + opts.player + '?');
        a.push('showDownload=' + opts.showdownload + '&file=' + opts.src + '&autoStart=' + opts.autoplay);
        a.push('&backColor=' + opts.background + '&frontColor=' + opts.foreground);
        a.push('&repeatPlay=' + opts.repeat + '&songVolume=' + opts.volume + '" ');
        a.push('type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"> </embed>');
        a.push('</object>');
        if (opts.caption) a.push('&nbsp;' + opts.caption);

        // convert anchor to span/div/whatever...
        var $el = jQuery('<' + opts.elementType + ' class="' + opts.cls + '"></' + opts.elementType + '>');
        $this.after($el).remove();
        $el.html(a.join(''));

        // Eolas workaround for IE (Thanks Kurt!)
        if(jQuery.browser.msie){ $el[0].outerHTML = $el[0].outerHTML; }
    });
};