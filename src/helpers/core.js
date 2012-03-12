function calcRelative(target, x, y) {
    if (target.offsetParent) {
        do {
            x -= target.offsetLeft;
            y -= target.offsetTop;

            target = target.offsetParent;
        } while (target);
    } // if

    return { x: x, y: y };
}

function matchTarget(evt, targetElement) {
    var targ = evt.target || evt.srcElement,
        targClass = targ.className;
    
    // while we have a target, and that target is not the target element continue
    // additionally, if we hit an element that has an interactor bound to it (will have the class interactor)
    // then also stop
    while (targ && (targ !== targetElement)) {
        targ = targ.parentNode;
    } // while
    
    return targ && (targ === targetElement);
} // matchTarget