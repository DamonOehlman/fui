fui.define('doodle')
    .filter('canvas')
    .relative()
    .each(function(target) {
        this.args.unshift(target.getContext('2d'));
    })
    .down(function(context, target, x, y) {
        this.state.down = true;
        
        context.beginPath();
        context.moveTo(x, y);
    })
    .move(function(context, target, x, y) {
        if (this.lastTarget && target !== this.lastTarget) {
            context.moveTo(x, y);
        }
        else if (this.state.down) {
            context.lineTo(x, y);
            context.stroke();
        }
    })
    .up(function(context, target, x, y) {
        this.state.down = false;
    });