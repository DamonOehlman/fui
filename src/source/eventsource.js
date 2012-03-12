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