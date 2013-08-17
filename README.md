# fui

This is an experimental library to experiment whether handling of events
can neatly be abstracted away from the actual event handling code itself.


[![NPM](https://nodei.co/npm/fui.png)](https://nodei.co/npm/fui/)

[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)

### Example Code

Here is some example code:

```js
var fui = require('fui');

fui()
  .up(function(context, target, x, y) {
    this.state.down = false;
  })
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
    if (this.lastTarget && target !== this.lastTarget) {
      context.moveTo(x, y);
    }
    else if (this.state.down) {
      context.lineTo(x, y);
      context.stroke();
    }
  });

```

## Reference

### bind(target, evtName, callback)

## EventChain(opts)

### each(handler)

### filter(selector)

### relative()

### pipe(target)

### down(handler)

### up(handler)

### move(handler)

### _next(evt)

### _on(eventName, handler)

### _step(stepHandler)

## FuiEventSource

### add(chain)

### handle(eventName)

### _createEvent(name, evt)
