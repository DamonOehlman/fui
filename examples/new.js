// @flow

const { fui } = require('fui');

fui('canvas')
  // NOTE: we should memoize map functions as they probably don't change
  .map({ canvas } => {
    return {
      canvas,
      context: canvas.getContext('2d')
    };
  })
  .pointer('down', { context, x, y }) => {
    context.beginPath();
    context.moveTo(x, y);
  })
  .pointer('move', ({ context, x, y }) => {
    context.lineTo(x, y)
  })
  .pointer('up', ({ context }) => {
    context.stroke();
  });
