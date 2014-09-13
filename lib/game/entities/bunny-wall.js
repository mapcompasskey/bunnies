ig.module(
    'game.entities.bunny-wall'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityBunnyWall = ig.Entity.extend({
        
        size: {x: 60, y: 60},
        offset: {x: 0, y: 0},
        maxVel: {x: 0, y: 0},
        
        checkAgainst: ig.Entity.TYPE.B,
        
        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 170, 66, 0.7)',
        
        init: function(x, y, settings) {
        
            this.parent(x, y, settings);
            
        },
        
        // colliding with .checkAgainst objects
        check: function(other) {
        
            if (other.bunnyWallCollision)
            {
                other.bunnyWallCollision();
            }
            
        },
        
    });
});