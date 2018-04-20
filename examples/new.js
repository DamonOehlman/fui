// @flow

const { fui } = require('..');

fui <
  HTMLCanvasElement >
  'canvas'
    .map(({ element }) => {
      let context = element.getContext('2d');
      return { element, context };
    })
    .filter(({ context }) => !!context)
    .pointer('down', ({ context, x, y }) => {
      context.beginPath();
      context.moveTo(x, y);
    })
    .pointer('move', ({ context, x, y }) => {
      context.lineTo(x, y);
    })
    .pointer('up', ({ context }) => {
      context.stroke();
    });
