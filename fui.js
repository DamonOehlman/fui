// fui 0.0.1
// ────────────────────────────────────────────────────────────────────────────────────────
// Functional User Interaction
// ────────────────────────────────────────────────────────────────────────────────────────

(function (glob) {
    var chains = [],
        eventSources = {};
        
    var isIE = typeof window.attachEvent != 'undefined',
    
        // define the bind function
        bindEvent = isIE ?
            // the ie version
            function(target, evtName, callback) {
                target.attachEvent('on' + evtName, callback);
            } : 
            // everybody else
            function(target, evtName, callback) {
                target.addEventListener(evtName, callback, true);
            },
            
        // define the unbind function
        unbindEvent = isIE ? 
            // the ie version
            function(target, evtName, callback) {
                target.detachEvent('on' + evtName, callback);
            } :
            // everbody else
            function(target, evtName, callback) {
                target.removeEventListener(evtName, callback, true);
            };

    function EventChain() {
        this._index = 0;
        this._steps = [];
        
        // initialise the state member
        this.state = {};
    }
    
    EventChain.prototype = {
        _next: function(evt) {
            var handler = this._steps[this._index++];
            if (typeof handler == 'function') {
                var result = handler.apply(this, this.args);
                
                return typeof result == 'undefined' || result;
            }
            
            return false;
        },
        
        _on: function(eventName, handler) {
            return this._step(function() {
                if (this.event.name === eventName) {
                    return handler.apply(this, arguments);
                }
            });
        },
        
        _step: function(stepHandler) {
            this._steps[this._steps.length] = stepHandler;
            
            return this;
        },
        
        each: function(handler) {
            return this._step(handler);
        },
        
        filter: function(selector) {
            return this._step(function(target) {
                return qwery.is(target, selector);
            });
        },
        
        relative: function() {
            return this._step(function(target, x, y) {
                if (target.offsetParent) {
                    do {
                        x -= target.offsetLeft;
                        y -= target.offsetTop;
    
                        target = target.offsetParent;
                    } while (target);
                } // if
                
                this.args = this.args.slice(0, 1).concat([x, y]);
            });
        },
        
        /**
        ## process(event)
        The process function is called when an event is added to the chain.
        */
        process: function(evt) {
            var result;
            
            // reset the chain index
            this._index = 0;
            
            // initialise the args to the page x and page y
            this.event = evt;
            this.args = [evt.target, evt.pageX, evt.pageY];
            
            do {
                result = this._next(evt);
            } while (result);
            
            return result;
        }
    };
    
    // autowire the down, move and up handlers
    ['down', 'up', 'move'].forEach(function(eventName) {
        EventChain.prototype[eventName] = function(handler) {
            return this._on(eventName, handler);
        };
    });

    
    function fui(opts) {
        var chain = chains[chains.length] = new EventChain(),
            eventSource;
        
        // initialise the options
        opts = opts || {};
        
        // determine whether we are using a touch interface
        opts.source = opts.source || ('ontouchstart' in window ? 'touch' : 'mouse');
        
        // if we don't have an event source for the source type, then create it
        eventSource = eventSources[opts.souce];
        if (! eventSource) {
            eventSource = eventSources[opts.source] = new fui.sources[opts.source](document);
        }
        
        // add the chain to the event source
        eventSource.add(chain);
        
        // return the chain
        return chain;
    }

    // initialise the different source handlers
    fui.sources = {};

    function EventSource() {
        this.chains = [];
    }
    
    EventSource.prototype = {
        _createEvent: function(name, evt) {
            return {
                // initialise the name
                name: name,
                
                // initialise the target
                target: evt.target || evt.sourceElement,
                
                // grab the pageX and pageY from the original event
                pageX: evt.pageX,
                pageY: evt.pageY,
                
                // save a reference to the original event
                original: evt
            };
        },
        
        add: function(chain) {
            this.chains.push(chain);
        },
        
        pipe: function(eventName) {
            var source = this;
            
            return function(evt) {
                var event = source._createEvent(eventName, evt);
                
                // iterate through the chains and start the event on each of them
                for (var ii = source.chains.length; ii--; ) {
                    source.chains[ii].process(event);
                }
            };
        }
    };

    var MouseSource = fui.sources.mouse = function(target) {
        // call the inherited constructor
        EventSource.call(this, target);
        
        // bind the event handlers
        this._bindEvents(target);
    };
    
    MouseSource.prototype = new EventSource();
    MouseSource.prototype.constructor = MouseSource;
    
    MouseSource.prototype._bindEvents = function(target) {
        var source = this;
        
        // bind the mouse down event handler
        bindEvent(target, 'mousedown', source.pipe('down'));
        bindEvent(target, 'mousemove', source.pipe('move'));
        bindEvent(target, 'mouseup', source.pipe('up'));
    };
    
    


    (typeof module != "undefined" && module.exports) ? (module.exports = fui) : (typeof define != "undefined" ? (define("fui", [], function() { return fui; })) : (glob.fui = fui));
})(this);