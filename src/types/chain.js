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