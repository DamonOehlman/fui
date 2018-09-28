// @flow

type SelectorOrElement<T: HTMLElement> = string | T;

type ElementBundle = {
  element: HTMLElement
};

type BundleMapFunction<T: HTMLElement> = (bundle: TargetBundle<T>) => TargetBundle<T>;
type BundleFilterFunction<T: HTMLElement> = (bundle: TargetBundle<T>) => boolean;

import type { PointerEventType, PointerEvent } from './lib/pointer.js';
import type { HandlerFunction } from './lib/handler.js';

class FunctionalUserInterface<T: ElementBundle> {
  bundles: T[];

  constructor(bundles: T[]) {
    this.bundles = bundles;
  }

  // map(mapper: BundleMapFunction<T>): FunctionalUserInterface<T> {
  //   return new FunctionalUserInterface(this.bundles.map(mapper));
  // }

  // pointer(event: PointerEventType, handler: HandlerFunction<PointerEvent>): this {
  //   return this;
  // }
}

function fui<T: ElementBundle>(target: string): FunctionalUserInterface<T> {
  const elements: HTMLElement[] = Array.from(document.querySelectorAll(target));
  return new FunctionalUserInterface(elements.map(element => ({ element })));
}

module.exports = {
  FunctionalUserInterface,
  fui,
};
