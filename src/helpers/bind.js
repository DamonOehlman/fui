var isIE = typeof window.attachEvent != 'undefined',

    // define the bind function
    bindEvent = isIE ?
        // the ie version
        function(target, evtName, callback) {
            target.attachEvent('on' + evtName, callback);
        } : 
        // everybody else
        function(target, evtName, callback) {
            target.addEventListener(evtName, callback, true);
        },
        
    // define the unbind function
    unbindEvent = isIE ? 
        // the ie version
        function(target, evtName, callback) {
            target.detachEvent('on' + evtName, callback);
        } :
        // everbody else
        function(target, evtName, callback) {
            target.removeEventListener(evtName, callback, true);
        };