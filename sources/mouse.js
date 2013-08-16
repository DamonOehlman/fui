/* jshint node: true */
'use strict';

var util = require('util');
var FuiEventSource = require('../eventsource');
var binder = require('../binder');

function MouseSource(target) {
  FuiEventSource.call(this, target);

  // bind the mouse down event handler
  binder.attach(target, 'mousedown', this.handle('down'));
  binder.attach(target, 'mousemove', this.handle('move'));
  binder.attach(target, 'mouseup', this.handle('up'));

  // implement a select start handler to prevent the text selection cursor from being displayed
  target.onselectstart = function() { return false; };
}

util.inherits(MouseSource, FuiEventSource);
module.exports = MouseSource;