var MouseSource = fui.sources.mouse = function(target) {
    // call the inherited constructor
    EventSource.call(this, target);
    
    // bind the event handlers
    this._bindEvents(target);
};

MouseSource.prototype = new EventSource();
MouseSource.prototype.constructor = MouseSource;

MouseSource.prototype._bindEvents = function(target) {
    var source = this;
    
    // bind the mouse down event handler
    bindEvent(target, 'mousedown', source.handle('down'));
    bindEvent(target, 'mousemove', source.handle('move'));
    bindEvent(target, 'mouseup', source.handle('up'));

    // implement a select start handler to prevent the text selection cursor from being displayed
    target.onselectstart = function() { return false; };
};

