
define('fui', [], function() {
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
    function EventChain(opts) {
        this._index = 0;
        this._relative = false;
        this._steps = [];
        
        // initialise the state member
        this.state = {};
        this.lastTarget = null;
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
            // TODO: memoize this function
            return this._step(function(target) {
                var isMatch = false;
                
                // TODO: check for cached matches
                if (target._matches) {
                }
                
                if (target && target.parentNode) {
                    // find all the matches in the parent node of this node
                    var matches = document.querySelectorAll(selector, target.parentNode);
                    
                    // if this node is a match, then it should 
                    for (var ii = matches.length; ii--; ) {
                        isMatch = isMatch || matches[ii] === target;
                    }
                }
                
                return isMatch;
            });
        },
        
        relative: function() {
            return this._step(function(target, x, y) {
                if (! this._relative) {
                    if (target.offsetParent) {
                        do {
                            x -= target.offsetLeft;
                            y -= target.offsetTop;
    
                            target = target.offsetParent;
                        } while (target);
                    } // if
    
                    this.args = this.args.slice(0, 1).concat([x, y]);
                    this._relative = true;
                }
            });
        },
        
        pipe: function(target) {
            return this._step(function() {
                target.process(this.event);
            });
        },
        
        /**
        ## process(event)
        The process function is called when an event is added to the chain.
        */
        process: function(evt) {
            var result;
            
            // reset values to default
            this._index = 0;
            this._relative = false;
            
            // initialise the args to the page x and page y
            this.event = evt;
            
            // if we are using a useful browser, then initialise the events in a simple way
            this.args = [evt.target, evt.pageX, evt.pageY];
            
            do {
                result = this._next(evt);
            } while (result);
            
            // update the last target
            this.lastTarget = evt.target;
            
            return result;
        }
    };
    
    EventChain.prototype.down = function(handler) {
        return this._on('down', handler);
    };
    
    EventChain.prototype.up = function(handler) {
        return this._on('up', handler);
    };
    
    EventChain.prototype.move = function(handler) {
        return this._on('move', handler);
    };
    
    function fui(opts) {
        var chain = chains[chains.length] = new EventChain(opts),
            eventSource;
        
        // initialise the options
        opts = opts || {};
        
        // determine whether we are using a touch interface
        opts.source = opts.source || ('ontouchstart' in window ? 'touch' : 'mouse');
        
        // if we don't have an event source for the source type, then create it
        eventSource = eventSources[opts.souce];
        if (! eventSource) {
            var Source = fui.sources[opts.source];
            
            // if we have a Source creator then do that now
            if (Source) {
                eventSource = eventSources[opts.source] = new Source(document);
            }
        }
        
        // if we have an event source, then add the chain to the source
        if (eventSource) {
            eventSource.add(chain);
        }
        
        // return the chain
        return chain;
    }
    
    // initialise the different source handlers
    fui.sources = {};
    
    // initialise the templates hash
    fui.templates = {};
    
    // create a template function, which is useful for creating chains not automatically bound to an event source
    fui.define = function(name, opts) {
        var chain;
        
        // if we don't have a name specified, but have been passed options
        // then remap arguments
        if (typeof name == 'object' && (! name instanceof String)) {
            opts = name;
            name = '';
        }
        
        // initialise options
        opts = opts || {};
        opts.source = 'none';
        
        // create a chain
        chain = fui(opts);
        
        // if we have a name specified, then add to the template
        if (name) {
            fui.templates[name] = chain;
        }
        
        return chain;
    };
    
    function EventSource() {
        this.chains = [];
    }
    
    EventSource.prototype = {
        _createEvent: function(name, evt) {
            var event = {
                // initialise the name
                name: name,
                
                // initialise the target
                target: evt.target || evt.srcElement,
                
                // grab the pageX and pageY from the original event
                pageX: evt.pageX,
                pageY: evt.pageY,
                
                // save a reference to the original event
                original: evt
            };
            
            // if the pageX is not defined and we have a clientX, then update
            if (typeof event.pageX == 'undefined' && typeof evt.clientX != 'undefined') {
                var doc = document.documentElement,
                    body = document.body;
    
                // code from jquery event handling:
                // https://github.com/jquery/jquery/blob/1.5.1/src/event.js#L493
                event.pageX = evt.clientX + 
                    (doc && doc.scrollLeft || body && body.scrollLeft || 0) - 
                    (doc && doc.clientLeft || body && body.clientLeft || 0);
                    
                event.pageY = evt.clientY + 
                    (doc && doc.scrollTop  || body && body.scrollTop  || 0) - 
                    (doc && doc.clientTop  || body && body.clientTop  || 0);
            }
            
            return event;
        },
        
        add: function(chain) {
            this.chains.push(chain);
        },
        
        handle: function(eventName) {
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
        bindEvent(target, 'mousedown', source.handle('down'));
        bindEvent(target, 'mousemove', source.handle('move'));
        bindEvent(target, 'mouseup', source.handle('up'));
    
        // implement a select start handler to prevent the text selection cursor from being displayed
        target.onselectstart = function() { return false; };
    };
    
    
    
    return typeof fui != 'undefined' ? fui : undefined;
});