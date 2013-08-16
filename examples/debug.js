var fui = require('..');

var debug = (function() {
  var container = document.getElementById('debug');
  var lines = [];
  
  return function(message) {
    lines = [message].concat(lines).slice(0, 50);
    container.innerText = lines.join('\n');
  };
})();

fui()
  .down(function(target, x, y) {
    debug('pointer down @ ' + x + ', ' + y);
  })
  .move(function(target, x, y) {
    debug('pointer move @ ' + x + ', ' + y);
  })
  .up(function(target, x, y) {
    debug('pointer up @ ' + x + ', ' + y);
  });
