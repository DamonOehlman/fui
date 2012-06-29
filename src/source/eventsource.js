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