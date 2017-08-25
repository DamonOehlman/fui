// @flow

import type { EventHandler } from './handler.js';

export type PointerEventType = 'down' | 'move' | 'up';
export type PointerEvent = (evt: Event, { x: number, y: number }) => void;
type HandlerBinder = (HTMLElement, EventHandler<PointerEvent>) => void;

class Pointer {
  static bindHandler(target: HTMLElement, eventType: PointerEventType, handler: EventHandler<PointerEvent>) {
    // find the binders
    const binders: ?Array<HandlerBinder> = POINTER_EVENT_BINDERS.get(eventType);
    if (!binders) {
      throw new Error(`No pointer event binders found for event type "${eventType}"`);
    }

    // use the binders to attach event handlers
    binders.forEach(binder => binder(target, handler));
  }

  static bindTouchStart(target: HTMLElement, handler: EventHandler<PointerEvent>) {
  }

  static bindTouchEnd(target: HTMLElement, handler: EventHandler<PointerEvent>) {
  }

  static bindMouseDown(target: HTMLElement, handler: EventHandler<PointerEvent>) {
    target.addEventListener('mousedown', (evt) => {
      console.log('captured mouse down', evt);
    });
  }

  static bindMouseDown(target: HTMLElement, handler: EventHandler<PointerEvent>) {
    target.addEventListener('mousemove', (evt: MouseEvent) => {
      console.log('captured mouse move', evt);
    });
  }

  static bindMouseMove(target: HTMLElement, handler: EventHandler<PointerEvent>) {
    target.addEventListener('mousemove', (evt: MouseEvent) => {
      console.log('captured mouse move', evt);
    });
  }

  static bindMouseUp(target: HTMLElement, handler: EventHandler<PointerEvent>) {
    target.addEventListener('mouseup', (evt: MouseEvent) => {
      console.log('captured mouse up', evt);
    });
  }
}

const POINTER_EVENT_BINDERS: Map<PointerEventType, Array<HandlerBinder>> = new Map([
  ['down', [Pointer.bindTouchStart, Pointer.bindMouseDown]],
  ['move', [Pointer.bindMouseMove]],
  ['up', [Pointer.bindTouchEnd, Pointer.bindMouseUp]]
]);

module.exports = {
  Pointer
};

