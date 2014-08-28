ig.module(
	'plugins.camera'
)
.defines(function(){ "use strict";
    ig.Camera = ig.Class.extend({
        
        trap: {
            pos: { x: 0, y: 0},
            size: { x: 16, y: 16 }
        },
        max: { x: 0, y: 0 },
        offset: {x: 0, y:0},
        pos: {x: 0, y: 0},
        damping: 5,
        
        init: function() {
            this.damping = 5;
            this.resize();
        },
        
        resize: function() {
            this.offset.x = ( ig.system.width / 2 );
            this.offset.y = ( ig.system.height / 2 );
            this.max.x = ( ig.game.collisionMap.pxWidth - ig.system.width );
            this.max.y = ( ig.game.collisionMap.pxHeight - ig.system.height );
        },
        
        set: function( entity ) {
            this.pos.x = ( entity.pos.x - this.offset.x );
            this.pos.y = ( entity.pos.y - this.offset.y );
            
            this.trap.pos.x = ( entity.pos.x - this.trap.size.x / 2 );
            this.trap.pos.y = ( entity.pos.y - this.trap.size.y );
        },
        
        follow: function( entity ) {
            this.pos.x = this.moveX( entity );
            this.pos.y = this.moveY( entity );
            ig.game.screen.x = this.pos.x;
            ig.game.screen.y = this.pos.y;
        },
        
        moveX: function( entity ) {
            var pos = ( entity.pos.x - ( ig.system.width / 2 ) );
            return (pos).limit( 0, this.max.x );
        },
        
        moveY: function( entity ) {
            if ( entity.pos.y < this.trap.pos.y ) {
                this.trap.pos.y = entity.pos.y;
            }
            else if ( ( entity.pos.y + entity.size.y ) > ( this.trap.pos.y + this.trap.size.y ) ) {
                this.trap.pos.y = ( entity.pos.y + entity.size.y - this.trap.size.y );
            }
            
            var pos = ( this.pos.y - this.trap.pos.y + this.offset.y );
            pos = ( pos * ig.system.tick * this.damping );
            pos = ( this.pos.y - pos );
            
            return (pos).limit( 0, this.max.y );
        },
        
    });
});