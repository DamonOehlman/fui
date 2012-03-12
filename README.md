# fui - a Functional User Interaction experiment

This is an experimental library to experiment whether handling of events can neatly be abstracted away from the actual event handling code itself.

## Example Code

Here is some very early example code (which is actually running):

```js
fui()
    .filter('canvas')
    .relative()
    .each(function(target) {
        this.args.unshift(target.getContext('2d'));
    })
    .down(function(context, target, x, y) {
        this.state.down = true;
        
        context.beginPath();
        context.moveTo(x, y);
    })
    .move(function(context, target, x, y) {
        if (this.state.down) {
            context.lineTo(x, y);
            context.stroke();
        }
    })
    .up(function(context, target, x, y) {
        this.state.down = false;
        context.closePath();
    });
```

Rather than target specific element, event capture is targeted at the `document` level during the [event capture phase](http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-flow-capture) and the filtered using [qwery](https://github.com/ded/qwery).

If the element matches, then remaining steps execute and not if it doesn't.  In this way, the event handling code is not reliant on DOM elements being available when the code is first initialized, but rather is inspected on a case by case basis.  