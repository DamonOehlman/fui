// @flow

type SelectorOrElement = string | HTMLElement;

// define the target bundle type
// this is not a closed object type and thus can have more attributes added
// to it as part of a <TargetBundleMapFunction> but cannot have less attributes
// than what is defined below.
type TargetBundle = {
  element: HTMLElement
};

type BundleMapFunction = (bundle: TargetBundle) => ?TargetBundle;

import type { PointerEventType, PointerEvent } from './lib/pointer.js';
import type { HandlerFunction } from './lib/handler.js';

class FunctionalUserInterface {
  bundles: Array<TargetBundle>

  constructor(bundles: Array<TargetBundle>) {
    this.bundles = bundles;
  }

  static of(target: SelectorOrElement) {
    if (target instanceof HTMLElement) {
      return new FunctionalUserInterface([{ element: target }]);
    }

    const elements = Array.from(document.querySelectorAll(target));
    if (elements.length === 0) {
      throw new Error(`No valid targets found for selector "${target}"`);
    }

    return new FunctionalUserInterface(elements.map(element => ({ element })));
  }

  map(mapper: BundleMapFunction): FunctionalUserInterface {
    const bundles = this.bundles.map(mapper).filter(Boolean);

    return new FunctionalUserInterface(bundles);
  }

  pointer(event: PointerEventType, handler: HandlerFunction<PointerEvent>): this {
    return this;
  }
}

function fui(target: SelectorOrElement) {
  return FunctionalUserInterface.of(target);
}

module.exports = {
  FunctionalUserInterface,
  fui
};
