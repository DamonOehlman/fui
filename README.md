# fui

This is an experimental library to experiment whether handling of events
can neatly be abstracted away from the actual event handling code itself.


[![NPM](https://nodei.co/npm/fui.png)](https://nodei.co/npm/fui/)

[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)

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
