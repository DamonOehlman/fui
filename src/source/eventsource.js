function EventSource() {
    this.chains = [];
}

EventSource.prototype = {
    add: function(chain) {
        this.chains.push(chain);
    },
    
    pipe: function(eventName) {
        var source = this;
        
        return function(evt) {
            // standardize the target
            evt.target = evt.target || evt.sourceElement;
            
            // add the event name
            evt.name = eventName;

            // iterate through the chains and start the event on each of them
            for (var ii = source.chains.length; ii--; ) {
                source.chains[ii].process(evt);
            }
        };
    }
};