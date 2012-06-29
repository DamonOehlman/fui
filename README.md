# fui - a Functional User Interaction experiment

This is an experimental library to experiment whether handling of events can neatly be abstracted away from the actual event handling code itself.

## Examples

There are examples available both in this repository, and online at jsfiddle:

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

Rather than target specific element, event capture is targeted at the `document` level during the [event capture phase](http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-flow-capture) and the filtered using [qwery](https://github.com/ded/qwery).

If the element matches, then remaining steps execute and not if it doesn't.  In this way, the event handling code is not reliant on DOM elements being available when the code is first initialized, but rather is inspected on a case by case basis.

## Roadmap

If this works out, then I will implement touch handlers for the same interface (as per Interact).