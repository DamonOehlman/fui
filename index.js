/* jshint node: true */
'use strict';

var chains = [];
var activeSources = {};
var sourceTypes = {
  mouse: require('./sources/mouse')
};
var EventChain = require('./eventchain');

/**
  # fui

  This is an experimental library to experiment whether handling of events
  can neatly be abstracted away from the actual event handling code itself.

  ### Example Code

  Here is some example code:

  <<< examples/draw.js

  ## Reference
**/

var fui = module.exports = function(opts) {
  var chain = chains[chains.length] = new EventChain(opts);
  var eventSource;
  var SourceClass;
  
  // initialise the options
  opts = opts || {};
  
  // determine whether we are using a touch interface
  opts.source = opts.source || ('ontouchstart' in window ? 'touch' : 'mouse');
  
  // if we don't have an event source for the source type, then create it
  eventSource = activeSources[opts.source];
  if (! eventSource) {
    SourceClass = sourceTypes[opts.source];
    
    // if we have a Source creator then do that now
    if (SourceClass) {
      eventSource = activeSources[opts.source] = new SourceClass(document);
    }
  }
  
  // if we have an event source, then add the chain to the source
  if (eventSource) {
    eventSource.add(chain);
  }
  
  // return the chain
  return chain;
};

// initialise the templates hash
fui.templates = {};

// create a template function, which is useful for creating chains
// not automatically bound to an event source
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