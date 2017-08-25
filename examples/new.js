// @flow

const { fui } = require('..');

fui('canvas')
  .map(({ element }) => {
    if (element instanceof HTMLCanvasElement) {
      const context = element.getContext('2d');
      return context ? { element, context } : undefined;
    }
  })
  .pointer('down', ({ context, x, y }) => {
    context.beginPath();
    context.moveTo(x, y);
  })
  .pointer('move', ({ context, x, y }) => {
    context.lineTo(x, y)
  })
  .pointer('up', ({ context }) => {
    context.stroke();
  });
