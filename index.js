// @flow

type SelectorOrElement = string | HTMLElement;

// define the target bundle type
// this is not a closed object type and thus can have more attributes added
// to it as part of a <TargetBundleMapFunction> but cannot have less attributes
// than what is defined below.
type TargetBundle = {
  element: HTMLElement
};

type BundleMapFunction = (bundle: TargetBundle) => TargetBundle;
type BundleFilterFunction = (bundle: TargetBundle) => boolean;

import type { PointerEventType, PointerEvent } from './lib/pointer.js';
import type { HandlerFunction } from './lib/handler.js';

class FunctionalUserInterface {
  bundles: Array<TargetBundle>;
  elementType: typeof HTMLElement;

  constructor(bundles: Array<TargetBundle>, elementType: typeof HTMLElement) {
    this.bundles = bundles;
    this.elementType = elementType;
  }

  static of(target: SelectorOrElement, elementType: typeof HTMLElement): FunctionalUserInterface {
    let elements = [];
    if (target instanceof HTMLElement) {
      elements = [target];
    } else {
      elements = Array.from(document.querySelectorAll(target));
    }

    return new FunctionalUserInterface(elements.map(element => ({ element })));
  }

  map(mapper: BundleMapFunction): FunctionalUserInterface<T> {
    return new FunctionalUserInterface(this.bundles.map(mapper));
  }

  pointer(event: PointerEventType, handler: HandlerFunction<PointerEvent>): this {
    return this;
  }
}

function fui(target: SelectorOrElement, elementType: typeof HTMLElement): FunctionalUserInterface {
  return FunctionalUserInterface.of(target, elementType);
}

module.exports = {
  FunctionalUserInterface,
  fui
};
