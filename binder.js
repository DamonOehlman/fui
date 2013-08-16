/* jshint node: true */
/* global window: false */
'use strict';

var isIE = typeof window.attachEvent != 'undefined';

/**
### bind(target, evtName, callback)
**/
exports.attach = isIE ?

  // the ie version
  function(target, evtName, callback) {
    target.attachEvent('on' + evtName, callback);
  } :

  // everybody else
  function(target, evtName, callback) {
    target.addEventListener(evtName, callback, true);
  };

exports.detach = isIE ?

  // the ie version
  function(target, evtName, callback) {
      target.detachEvent('on' + evtName, callback);
  } :

  // everbody else
  function(target, evtName, callback) {
      target.removeEventListener(evtName, callback, true);
  };