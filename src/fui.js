var chains = [],
    eventSources = {};
    
//= helpers/bind
//= types/chain

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

//= source/eventsource
//= source/mouse