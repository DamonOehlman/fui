//@header
(function (glob) {
    var chains = [],
        eventSources = {};
        
    //= helpers/bind
    //= types/chain
    
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

    //= source/eventsource
    //= source/mouse

    //@export fui
})(this);