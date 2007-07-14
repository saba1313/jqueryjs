//Select DOM creation (or at least the start) ~Sean
//Reference: http://www.zachleat.com/web/2007/07/07/domdom-easy-dom-element-creation/
//Current supports:
// $.dom("tag#id.class[@type='value']{css:styles;} 'text'");
//Planned Features:
// multiple children "p [span 'text', span 'more'], a#id 'text'"
// TODO: add [] around entire query at start
$.dom = function(z) {
  var l,e,t,s = new RegExp(/(\w\w+):['"]?([\w#()]*)['"]?;?/ig);
  var d,o = new RegExp(/@(\w+)=(['"])([^'"]*)\2,?/ig);
  var m,a,g,i,c = new RegExp(/\s*((['"])([^\2]*)\2|(\w+)?(#\w+)?((?:\.[a-z]\w*)*)(?:\[((?:@\w+=(['"])[^'"]*['"],?)*)\])?(?:\{([^\}]*)\})?)\s*/ig);
  //lets = {css:style;}      //do = [@type='value']
  //        (1)  (2)         //       (1)    (3)
  //magic = tag#id.class[@type='value']{css:style;} 'text'
  //        (4)(5)  (6)      (7)           (9)       (3)
  g = d = $("<div/>");
  while(m=c.exec(z),m&&m[0]) {
    //console.log("%o: %o",z,m);
    if(m[3]) d.html(d.html()+m[3]);
    if(m[4]) e=$('<'+m[4]+'>');
    if(m[5]) e.attr('id',m[5].substr(1));
    if(m[6]) for(l=m[6].substr(1).split('.'),i=l.length; i-->0;) e.addClass(l[i]);
    if(m[7]) while(t=o.exec(m[7]),t&&t[0]) e.attr(t[1],t[3]);
    if(m[9]) while(t=s.exec(m[9]),t&&t[0]) e.css(t[1],t[2]);
    if(e){ d=d.append(e); d=e; e=null; }
  }
  //console.log("%o: %o",z,(t=g.children(),t.length)?t:g);
  return (t=g.children(),t.length)?t:g;
}


