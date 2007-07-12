/* resizable ~ Sean Catchpole - Version 1.0 */

/*
Examples:
<textarea class="resize height"></textarea>
<tt>...</tt>
*/
(function($){ 
  $.fn.resizable = function(o){ 
  this.each(function(){
    //Defaults 
    var s = { "resize":"height" };

    //Check Arguments matching options 
    if(typeof o == "string" && o.match(/height/i)) s.resize="height";
    else if(typeof o == "string" && o.match(/width/i)) s.resize="width";
    else if(typeof o == "string" && o.match(/both/i)) s.resize="both";
    else if(typeof o == "string" && o.match(/height/i) && o.match(/width/i)) s.resize="both";
    else $.extend(s,o);

    //Check Class for resize
    var c = this.className;
    if(c.match(/resizable/i)) {
      if(c.match(/height/i)) s.resize="height";
      if(c.match(/width/i)) s.resize="width"; 
      if(c.match(/height/i) && c.match(/width/i)) s.resize="both";
      if(c.match(/both/i)) s.resize="both";
    }

    var self = this; //Save scope 
    if(!$("+ tt",this).length)
      $(this).after('<tt>...</tt>');
    var tt = $("+ tt",this);

    var resizing=false;
    var pos = function(m) {
      var x = ($.browser.msie)?document.body.scrollLeft:window.pageXOffset;
      var y = ($.browser.msie)?document.body.scrollTop:window.pageYOffset;
      return { x:m.clientX+x, y:m.clientY+y };
    }
    var xy = {};
    var down = function(m){ resizing=true; xy=pos(m); }
    var up = function(m) { if(resizing) { resizing=false; self.focus(); } }
    var move = function(m) {
      if(resizing) {
        var p = pos(m);
        var w = (p.x - xy.x) + $(self).width();
        var h = (p.y - xy.y) + $(self).height();
        if(s.resize=="height" || s.resize=="both")
          $(self).css("height",((h<20)?20:h)+("px"));
        if(s.resize=="width" || s.resize=="both")
          $(self).css("width",((w<40)?40:w)+("px"));
        xy = p;
      }
    }
    tt.mousedown(down);
    $().mouseup(up).mousemove(move);
  });
    return this; //Chainable 
  }; 
  $(function(){ $(".resizable").resizable(); }); 
})(jQuery);

