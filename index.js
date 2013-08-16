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

  ## Examples

  There are examples available both in this repository,
  and online at jsfiddle:

  - [Simple Draw Example - Manual Event Handling](http://jsfiddle.net/DamonOehlman/QuydV/)
  - [Simple Draw Example - Using Template](http://jsfiddle.net/DamonOehlman/v5ydb/)

  ### Example Code

  Here is some very early example code (which is actually running):

  ```js
  fui()
    // only continue if the element matches the selector (uses qwery)
    .filter('canvas')
    
    // convert to relative coordinates
    .relative()
    
    // for each of the targets matched, push a context onto the argument list
    .each(function(target) {
        this.args.unshift(target.getContext('2d'));
    })
    
    // handle pointer down events
    .down(function(context, target, x, y) {
        this.state.down = true;
        
        context.beginPath();
        context.moveTo(x, y);
    })
    
    // handle pointer move events
    .move(function(context, target, x, y) {
        if (this.state.down) {
            context.lineTo(x, y);
            context.stroke();
        }
    })
    
    // handle pointer up events
    .up(function(context, target, x, y) {
        this.state.down = false;
        context.closePath();
    });
  ```

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