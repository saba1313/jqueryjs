(function($) {
  
  $.registeredPlugins = {
    runFunctions: function(fnName) {
      return function() {
        var params = arguments;
        return this.each(function() {
          var thisPlugins = this.registeredPlugins || [];
          for(i=0,j=thisPlugins.length; i<j; i++) {
            $.registeredPlugins[thisPlugins[i]][fnName].apply(this, params);
          }  
        });
      };
    }
  };
  
  $.registerPluginFunction = function(pluginName, fnName, fn) {
    $.registeredPlugins[pluginName] = $.registeredPlugins[pluginName] || {};
    $.registeredPlugins[pluginName][fnName] = fn;
    if($.fn[fnName] && !$.fn[fnName].plugins) {
      var defaultFn = $.fn[fnName];
      $.fn[fnName] = $.registeredPlugins.runFunctions(fnName);
      $.fn[fnName].plugins = {};
      $.fn[fnName].plugins.defaultFn = defaultFn;
    } else if(!$.fn[fnName]){
      $.fn[fnName] = $.registeredPlugins.runFunctions(fnName);
    }
  };
  
  $.fn.register = function(pluginName) {
    return this.each(function() {
      this.registeredPlugins = (this.registeredPlugins || []);
      this.registeredPlugins.push(pluginName);
    })
  };
  
})(jQuery)