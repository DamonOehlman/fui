/* jshint node: true */
'use strict';

/**
  ## FuiEventSource

**/
function FuiEventSource() {
  if (! (this instanceof FuiEventSource)) {
    return new FuiEventSource();
  }

  this.chains = [];
}

module.exports = FuiEventSource;

/**
  ### add(chain)
**/
FuiEventSource.prototype.add = function(chain) {
  this.chains.push(chain);
};

/**
  ### handle(eventName)
**/
FuiEventSource.prototype.handle = function(name) {
  var source = this;
  
  return function(evt) {
    var data = source._createEvent(name, evt);
    
    // iterate through the chains and start the event on each of them
    for (var ii = source.chains.length; ii--; ) {
      source.chains[ii].process(data);
    }
  };
};

/**
  ### _createEvent(name, evt)
**/
FuiEventSource.prototype._createEvent = function(name, evt) {
  var doc;
  var body;
  var data = {
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
  if (typeof evt.pageX == 'undefined' && typeof evt.clientX != 'undefined') {
    doc = document.documentElement;
    body = document.body;

    // code from jquery event handling:
    data.pageX = evt.clientX + 
        (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
        (doc && doc.clientLeft || body && body.clientLeft || 0);
        
    data.pageY = evt.clientY + 
        (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
        (doc && doc.clientTop  || body && body.clientTop  || 0);
  }
  
  return data;
};