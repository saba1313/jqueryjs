
(function($) {
  //If the UI scope is not availalable, add it
	$.ui = $.ui || {};
  
  	
	// Add the UI Naming seed, this is a custom function used in plugin.
	// the Naming seed based function:
	// 	@ returns a string like: myId-1

	var uiIdSeed = uiIdSeed || 0;
	$.ui.uuid = function(prefix){
		return prefix +"-" + (++uiIdSeed);
	}
  $.ui.template = function(template, items){
    if(template instanceof Array){
      template = template.join("");
    }
    $.each(items, function(key, value){
      regex = eval('/\{\{'+key+'\}\}/g');
      template = template.replace(regex, value);
    });
    return template;
  }

  

  $.fn.toaster = function(options){
    return $.ui.toaster(this, options);
  }
  var positions = new Array();
  positions[0] = "tr";
  positions[1] = "tl";
  positions[2] = "br";
  positions[3] = "bl";
  
  $.ui.toasterInit = function(el, p){
    if(!$(el).find(".toaster").is("."+positions[p])){
      $('<div class="toaster '+positions[p]+'"></div>').appendTo(el);
    }
  }
  
  var toasterCount = 0;
  
  $.ui.toaster = function(el, options){
    toasterCount++;
    var options = $.extend({
      name: '',
      data: '',
      timeout: 3,
      position: 2, // tr: 0, tl: 1, br: 2, bl: 3.
      //animation: "slideDown", // slidedown, slideup
      animationSpeed: 500,
      // callbacks
      show: function(){console.log(options.name+" is shown");},
      hide: function(){console.log(options.name+" is hidden");}
    }, options);
    var p = options.position;
    var id = $.ui.uuid("ui-toast");
    
    
    // set up toasters on the page.
    $.ui.toasterInit(el, p);
    
    var template = new Array();
    
    template.push(
      '<div id="{{id}}" class="toast" style="display:none;">'
      +'<span class="toastName">{{name}}</span>'
      +'<span class="toastData">{{data}}</span>'
      +'</div>'
    );
    
    html = $.ui.template(template, {'id':id,'name': options.name, 'data': options.data});
    $(el).find(".toaster."+positions[p]).append(html);
    eval("$('#"+id+"').animate({height: 'toggle'}, "+options.animationSpeed+", null, options.show());");
    
    
    window.setTimeout(function(){
      $("#"+id).animate({height: 0}, 500, null, function(){
        $(this).remove();
        options.hide();
        toasterCount--;
        if(toasterCount==0){
          setTimeout(function(){$(el).find(".toaster."+positions[p]).remove();}, 250);
        }
      });
    }, 1000*options.timeout);
  }
  
})(jQuery);