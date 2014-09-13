ig.module(
	'game.entities.squirrel-acorn'
)
.requires(
	'impact.entity',
    'impact.entity-pool'
)
.defines(function() {
    EntitySquirrelAcorn = ig.Entity.extend({
        
        size: {x: 42, y: 42},
        offset: {x: 0, y: 0},
        maxVel: {x: 200, y: 200},
        flip: false,
        speed: 480,
        gravityFactor: 0,
        animSheet: new ig.AnimationSheet('media/squirrel-acorn.png', 42, 42),
        
        canDamage: false,
        decayTime: 3.0,
        timerDecay: null,
        
        type: ig.Entity.TYPE.B, // add to enemy group
        checkAgainst: ig.Entity.TYPE.A, // check collisions against friendly group
        collides: ig.Entity.COLLIDES.PASSIVE,
        _wmIgnore: true,
        
        init: function(x, y, settings) {
        
            this.parent(x, y, settings);
            this.prepareEntity();
            
            // add the animations
            this.addAnim('idle', 1, [0], true);
            
        },
        
        // resurrect this entity from the entity pool
        reset: function(x, y, settings) {
        
            this.parent(x, y, settings);
            this.prepareEntity();
            
        },
              
        // reset parameters
        prepareEntity: function() {
        
            // reset parameters
            this.canDamage = true;
            this.timerDecay = new ig.Timer(this.decayTime);
            
            // move towards player entity
            if (ig.game.player)
            {
                // get player position
                var xPos = ig.game.player.pos.x + (ig.game.player.size.x / 2);
                var yPos = ig.game.player.pos.y + (ig.game.player.size.y / 2);
                
                // randomize player position so the shot isn't perfect
                xPos += ((Math.random() * 180) - 90); // -90 to 90
                yPos += ((Math.random() * 180) - 90); // -90 to 90
                
                // get angle from entity to new position in radians
                //var radians = this.angleTo(ig.game.player);
                var radians = Math.atan2(
                    (yPos - (this.pos.y + this.size.y / 2)),
                    (xPos - (this.pos.x + this.size.x / 2))
                );
                var xVel = (Math.cos(radians) * this.speed);
                var yVel = (Math.sin(radians) * this.speed);
                
                this.maxVel.x = this.vel.x = this.accel.x = xVel;
                this.maxVel.y = this.vel.y = this.accel.y = yVel;
            }
            
        },
        
        update: function() {
        
            if (ig.game.isPaused)
            {
                return;
            }
            
            this.checkStatus();
            this.parent();
            
        },
        
        checkStatus: function() {
        
            // if decayed
            if (this.timerDecay.delta() > 0)
            {
                this.kill();
            }
            
        },
        
        // opt out of collision
        handleMovementTrace: function(res) {
        
            var mx = (this.vel.x * ig.system.tick);
            var my = (this.vel.y * ig.system.tick);
            this.pos.x += mx;
            this.pos.y += my;
            
        },
        
        // when overlapping with .checkAgainst entities
        check: function(other) {
        
            if (this.canDamage)
            {
                other.receiveDamage(1, this);
            }
            
        },
        
    });
    
    ig.EntityPool.enableFor(EntitySquirrelAcorn);
});