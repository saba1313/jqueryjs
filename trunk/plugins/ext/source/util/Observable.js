/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 * 
 * http://www.extjs.com/license.txt
 */


/**
 * @class Ext.util.Observable
 * Abstract base class that provides a common interface for publishing events. Subclasses are expected to
 * to have a property "events" with all the events defined.<br>
 * For example:
 * <pre><code>
 Employee = function(name){
    this.name = name;
    this.events = {
        "fired" : true,
        "quit" : true
    }
 }
 Ext.extend(Employee, Ext.util.Observable);
</code></pre>
 */
Ext.util.Observable = function(){};
Ext.util.Observable.prototype = {
    /**
     * Fires the specified event with the passed parameters (minus the event name).
     * @param {String} eventName
     * @param {Object...} args Variable number of parameters are passed to handlers
     * @return {Boolean} returns false if any of the handlers return false otherwise it returns true
     */
    fireEvent : function(){
        var ce = this.events[arguments[0].toLowerCase()];
        if(typeof ce == "object"){
            return ce.fire.apply(ce, Array.prototype.slice.call(arguments, 1));
        }else{
            return true;
        }
    },

    filterOptRe : /^(?:scope|delay|buffer|single)$/,    
    /**
     * Appends an event handler to this component
     * @param {String}   eventName     The type of event to listen for
     * @param {Function} handler        The method the event invokes
     * @param {<i>Object</i>}   options  (optional)
     */
    addListener : function(eventName, fn, scope, o){
        if(typeof eventName == "object"){
            o = eventName;
            for(var e in o){
                if(this.filterOptRe.test(e)){
                    continue;
                }
                if(typeof o[e] == "function"){
                    // shared options
                    this.addListener(e, o[e], o.scope,  o);
                }else{
                    // individual options
                    this.addListener(e, o[e].fn, o[e].scope, o[e]);
                }
            }
            return;
        }
        o = (!o || typeof o == "boolean") ? {} : o;
        eventName = eventName.toLowerCase();
        var ce = this.events[eventName];
        if(!ce){
            // added for a better message when subscribing to wrong event
            throw 'Event does not exist: "' + eventName + '".';
        }
        if(typeof ce == "boolean"){
            ce = new Ext.util.Event(this, eventName);
            this.events[eventName] = ce;
        }
        ce.addListener(fn, scope, o);
    },

    /**
     * Removes a listener
     * @param {String}   eventName     The type of event to listen for
     * @param {Function} handler        The handler to remove
     * @param {<i>Object</i>}   scope  (optional) The scope (this object) for the handler
     */
    removeListener : function(eventName, fn, scope){
        var ce = this.events[eventName.toLowerCase()];
        if(typeof ce == "object"){
            ce.removeListener(fn, scope);
        }
    },

    /**
     * Removes all listeners for this object
     */
    purgeListeners : function(){
        for(var evt in this.events){
            if(typeof this.events[evt] == "object"){
                 this.events[evt].clearListeners();
            }
        }
    },

    relayEvents : function(o, events){
        var createHandler = function(ename){
            return function(){
                return this.fireEvent.apply(this, Ext.combine(ename, Array.prototype.slice.call(arguments, 0)));
            };
        };
        for(var i = 0, len = events.length; i < len; i++){
            var ename = events[i];
            if(!this.events[ename]){ this.events[ename] = true; };
            o.on(ename, createHandler(ename), this);
        }
    },

    addEvents : function(o){
        if(!this.events){
            this.events = {};
        }
        Ext.applyIf(this.events, o);
    },

    hasListener : function(eventName){
        var e = this.events[eventName];
        return typeof e == "object" && e.listeners.length > 0;
    }
};
/**
 * Appends an event handler to this element (shorthand for addListener)
 * @param {String}   eventName     The type of event to listen for
 * @param {Function} handler        The method the event invokes
 * @param {<i>Object</i>}   options  (optional) 
 * @method
 */
Ext.util.Observable.prototype.on = Ext.util.Observable.prototype.addListener;
/**
 * Removes a listener (shorthand for removeListener)
 * @param {String}   eventName     The type of event to listen for
 * @param {Function} handler        The handler to remove
 * @param {<i>Object</i>}   scope  (optional) The scope (this object) for the handler
 * @method
 */
Ext.util.Observable.prototype.un = Ext.util.Observable.prototype.removeListener;

/**
 * Starts capture on the specified Observable. All events will be passed
 * to the supplied function with the event name + standard signature of the event
 * <b>before</b> the event is fired. If the supplied function returns false,
 * the event will not fire.
 * @param {Observable} o The Observable to capture
 * @param {Function} fn The function to call
 * @param {Object} scope (optional) The scope (this object) for the fn
 * @static
 */
Ext.util.Observable.capture = function(o, fn, scope){
    o.fireEvent = o.fireEvent.createInterceptor(fn, scope);
};

/**
 * Removes <b>all</b> added captures from the Observable.
 * @param {Observable} o The Observable to release
 * @static
 */
Ext.util.Observable.releaseCapture = function(o){
    o.fireEvent = Ext.util.Observable.prototype.fireEvent;
};

(function(){

    var createBuffered = function(h, o, scope){
        var task = new Ext.util.DelayedTask();
        return function(){
            task.delay(o.buffer, h, scope, Array.prototype.slice.call(arguments, 0));
        };
    };

    var createSingle = function(h, e, fn, scope){
        return function(){
            e.removeListener(fn, scope);
            return h.apply(scope, arguments);
        };
    };

    var createDelayed = function(h, o, scope){
        return function(){
            var args = Array.prototype.slice.call(arguments, 0);
            setTimeout(function(){
                h.apply(scope, args);
            }, o.delay || 10);
        };
    };

    Ext.util.Event = function(obj, name){
        this.name = name;
        this.obj = obj;
        this.listeners = [];
    };

    Ext.util.Event.prototype = {
        addListener : function(fn, scope, options){
            var o = options || {};
            scope = scope || this.obj;
            if(!this.isListening(fn, scope)){
                var l = {fn: fn, scope: scope, options: o};
                var h = fn;
                if(o.delay){
                    h = createDelayed(h, o, scope);
                }
                if(o.single){
                    h = createSingle(h, this, fn, scope);
                }
                if(o.buffer){
                    h = createBuffered(h, o, scope);
                }
                l.fireFn = h;
                this.listeners.push(l);
            }
        },

        findListener : function(fn, scope){
            scope = scope || this.obj;
            var ls = this.listeners;
            for(var i = 0, len = ls.length; i < len; i++){
                var l = ls[i];
                if(l.fn == fn && l.scope == scope){
                    return i;
                }
            }
            return -1;
        },

        isListening : function(fn, scope){
            return this.findListener(fn, scope) != -1;
        },

        removeListener : function(fn, scope){
            var index;
            if((index = this.findListener(fn, scope)) != -1){
                this.listeners.splice(index, 1);
                return true;
            }
            return false;
        },

        clearListeners : function(){
            this.listeners = [];
        },

        fire : function(){
            var args = Array.prototype.slice.call(arguments, 0);
            var ls = this.listeners, scope;
            for(var i = 0, len = ls.length; i < len; i++){
                var l = ls[i];
                if(l.fireFn.apply(l.scope, arguments) === false){
                    return false;
                }
            }
            return true;
        }
    };
})();