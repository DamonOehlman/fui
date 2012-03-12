// the ensure ensurePagePos event is designed as a pass through event handler
// that checks that the pagePos handler is available
function ensureValid(handler) {
    return function(evt) {
        var doc = document.documentElement,
            body = document.body;
            
        // ensure the target is defined correctly
        evt.target = evt.target || evt.srcElement;

        // ensure we have a pageX value
        evt.pageX = typeof evt.pageX != 'undefined' ? evt.pageX : 
            evt.clientX + 
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) - 
                (doc && doc.clientLeft || body && body.clientLeft || 0);

        // ensure we have a pageY value
        evt.pageY = typeof evt.pageY != 'undefined' ? evt.pageY :
            evt.clientY + 
                (doc && doc.scrollTop  || body && body.scrollTop  || 0) - 
                (doc && doc.clientTop  || body && body.clientTop  || 0);
                
        handler.apply(this, [evt].concat(Array.prototype.slice.call(arguments, 1)));
    };
}

function captureMouse(target, chain) {
    bindEvent(target, 'mousedown',  ensureValid(interactor._accept('down')));
    bindEvent(target, 'mousemove',  ensureValid(interactor._accept('move')));
    bindEvent(target, 'mouseup',    ensureValid(interactor._accept('up')));
    
    /*
    opts.binder('mousedown', handleMouseDown);
    opts.binder('mousemove', handleMouseMove);
    opts.binder('mouseup', handleMouseUp);
    opts.binder('dblclick', handleDoubleClick);
    */
}