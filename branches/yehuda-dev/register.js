(function($) {
  
  $.registeredPlugins = {
    runFunctions: function(fnName) {
      return function() {
        var params = arguments;
        var ret = {};
        this.each(function() {
          var thisPlugins = this.registeredPlugins || [];
          for(i=0,j=thisPlugins.length; i<j; i++) {
            var plugin = thisPlugins[i];
            ret[plugin] = ret[plugin] || [] 
            if($.registeredPlugins[plugin][fnName])
              ret[plugin].push($.registeredPlugins[plugin][fnName].apply(this, params));
          }
        });
        var toChain = true, pluginCount = 0;
        for(plugin in ret) {
          pluginCount += 1;
          if(ret[plugin].length > 0 && !(ret[plugin].length == 1 && ret[plugin][0] === undefined)) toChain = false; 
          if(ret[plugin].length == 1) ret[plugin] = ret[plugin][0];
          else if(ret[plugin].length == 0) delete ret[plugin];
        }
        if(pluginCount == 0) throw "The plugin function " + fnName + " was not defined for any elements in the jQuery object";
        if(toChain) return this;
        else return ret;
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