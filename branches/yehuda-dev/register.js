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
  
  $.registeredPlugins = {
    runFunctions: function(fnName) {
      return function() {
        var params = [].slice.apply(arguments);
        var ret = [];
        this.each(function() {
          var thisPlugins = this.registeredPlugins || [];
          var plugin = thisPlugins[params[0]] || thisPlugins[0];
          if($.registeredPlugins[plugin] && $.registeredPlugins[plugin][fnName])
            ret.push($.registeredPlugins[plugin][fnName].apply(this, params.slice(1)));
        });
        
        var usingDefault = false;
        
        if($.registeredPlugins["defaultFn"][fnName] && (ret.length == 0 || params[0] === undefined || params[0] == "default")) {
          ret = $.registeredPlugins["defaultFn"][fnName].call(this);
          usingDefault = true;
        }
        var toChain = true;
        if(ret.length > 0 && !(ret.length == 1 && ret[0] === undefined)) toChain = false;
        if(ret.length == 1 && usingDefault == false) ret = ret[0];
        else if(ret.length == 0) ret == undefined;
        
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