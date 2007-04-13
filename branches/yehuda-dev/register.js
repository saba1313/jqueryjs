(function($) {
  
  /**
   * The Basics
   * 
   * This plugin allows you to register plugins, and the functions that are associated with those plugins.
   * 
   * You can then assign plugins to any DOM elements, which will make them eligible to call functions
   * associated with that plugin.
   * 
   * For example, you might have a plugin which creates a text field widget, with two functions, clearText()
   * and validateText(). You would register the functions as follows:
   * 
   *   * $.registerPluginFunction("textfieldwidget", "clearText", function(options) { // stuff });
   *   * $.registerPluginFunction("textfieldwidget", "validateText", function(par1, par2) { // stuff });
   *   
   *   * In your function that creates the text field widget (let's call it makeTextFieldWidget), you would
   *     add the followin line:
   *     * this.register("textfieldwidget")
   *   * You would then call $("#myTextField").makeTextFieldWidget(), which would do all of the things
   *     that create the widget, plus make it a "textfieldwidget"
   *   * Now, you could do $("#myTextField").clearText()
   *   
   * From the end user's perspective, it's as simple as calling the function that creates the widget
   * (as they already do), and then having access to related functions (as they already do). The only
   * difference is that those functions will only be available to registered elements, so you could
   * have another clearText() for some other plugin, which will not be called for textfieldwidgets.
   */
  
  /**
   * If you register multiple plugins with the same function name, and call the function, the following
   * happens:
   * 
   * 1) For each element, the bound plugin function is fired
   *    a) The responses for each plugin are pushed into an array
   *    b) When done, we have an object like: {plugin1: [1,2], plugin2: [3,4]}, where
   *       1, 2 are the return results for plugin1 and 3, 4 are the return results for plugin2
   * 2) If one exists, the original ("default") function is called on the entire jQuery object
   *    a) The results are put added to the object returned in step 1 under the plugin name
   *       "default"
   * 3) For any plugin (except default), if the array of results has only one element, return
   *    just the element.
   * 4) If no plugin returns any results, the original object is returned to allow for chaining
   * 5) If any plugin returns results, the results object is returned
   *    a) Again, the keys of this object are the plugin names (including "default")
   *    b) and the values of each pair are either a single value (if only one value was returned),
   *       or an array of all of the values that were returned.
   * 6) In other words, if you have a function that is designed to return some information 
   *    about a single element only, it will return only a single value for that plugin. 
   *    If you call such a function on a jQuery object containing multiple elements, it will
   *    return an array of values, one for each element in the jQuery object.
   * 7) Even if only one plugin is bound to an element, an object like {plugin1: "response"} will
   *    be returned. This is so that the same response is returned regardless of whether or not
   *    another plugin exists using the same function name (plugin writers should not *need* to
   *    know what other plugins are registered).       
   */
  
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
        if($.registeredPlugins["defaultFn"][fnName]) {
          ret["default"] = $.registeredPlugins["defaultFn"][fnName].call(this);
        }
        var toChain = true, pluginCount = 0;
        for(plugin in ret) {
          pluginCount += 1;
          if(ret[plugin].length > 0 && !(ret[plugin].length == 1 && ret[plugin][0] === undefined)) toChain = false; 
          if(ret[plugin].length == 1 && plugin != "default") ret[plugin] = ret[plugin][0];
          else if(ret[plugin].length == 0) delete ret[plugin];
        }
        if(toChain) return this;
        else return ret;
      };
    },
    defaultFn: {}
  };
  
  /**
   * Register a function for a particular plugin. Any elements later registered with this
   * plugin will have access to this function.
   * 
   * The function will automatically be called once for each element in the jQuery object
   * calling it. "this", in each case, will reference the element the function was called for.
   * 
   * If you wish to allow chaining, make sure not to return anything from the function. Note
   * that if any other plugin using the same function name returns something, you will not
   * be able to chain.
   * 
   * @example $.registerPluginFunction("selectable", "selectAll", function() { // stuff here })
   */
  
  $.registerPluginFunction = function(pluginName, fnName, fn) {
    $.registeredPlugins[pluginName] = $.registeredPlugins[pluginName] || {};
    $.registeredPlugins[pluginName][fnName] = fn;
    if($.fn[fnName] && !$.registeredPlugins.defaultFn[fnName]) {
      $.registeredPlugins.defaultFn[fnName] = $.fn[fnName]; 
      $.fn[fnName] = $.registeredPlugins.runFunctions(fnName);
    } else if(!$.fn[fnName]){
      $.fn[fnName] = $.registeredPlugins.runFunctions(fnName);
    }
  };
  
  /**
   * Register all of the elements in the jQuery object with a particular plugin name.
   * 
   * Once registered, the elements will have access to any functions registered to the plugin.
   */
  
  $.fn.register = function(pluginName) {
    return this.each(function() {
      this.registeredPlugins = (this.registeredPlugins || []);
      this.registeredPlugins.push(pluginName);
    })
  };
  
})(jQuery)