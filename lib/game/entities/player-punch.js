ig.module(
	'game.entities.player-punch'
)
.requires(
	'impact.entity',
    'impact.entity-pool'
)
.defines(function() {
    EntityPlayerPunch = ig.Entity.extend({
        
        size: {x: 24, y: 20},
        offset: {x: 0, y: 0},
        maxVel: {x: 0, y: 0},
        gravityFactor: 0,
        flip: false,
        canDamage: false,
        
        attack_1: false,
        attack_jump: false,
        
        type: ig.Entity.TYPE.NONE, // don't add to any groups
        checkAgainst: ig.Entity.TYPE.B, // check collisions against enemy group
        collides: ig.Entity.COLLIDES.PASSIVE,
        _wmIgnore: true,
        
        init: function(x, y, settings) {
        
            this.parent(x, y, settings);
            this.prepareEntity();
            
        },
        
        // resurrect this entity from the entity pool
        reset: function(x, y, settings) {
        
            this.parent(x, y, settings);
            this.prepareEntity();
            
        },
              
        // reset parameters
        prepareEntity: function() {
        
            this.canDamage = false;
            this.attack_1 = false;
            this.attack_jump = false;
            
        },
        
        update: function() {
        
            if (ig.game.isPaused)
            {
                return;
            }
            
            // sometimes this entity remains
            if ( ! ig.game.player.attacking)
            {
                this.kill();
            }
            
            this.parent();
            
        },
        
        // called by player.js after it's updated
        updatePosition: function(entity) {
        
            // if entity is facing left
            if (entity.flip)
            {
                this.pos.x = (entity.pos.x - this.size.x + entity.size.x);
                this.pos.y = (entity.pos.y - this.size.y + entity.size.y);
            }
            // else, entity is facing right
            else
            {
                this.pos.x = entity.pos.x;
                this.pos.y = (entity.pos.y - this.size.y + entity.size.y);
            }
            
            this.flip = entity.flip;
            
        },
        
        // update the size of the collision box
        updateCollisionBox: function() {
            /*
            if (this.attack_1)
            {
                this.size.x = 30;
                this.size.y = 20;
            }
            else if (this.attack_jump)
            {
                this.size.x = 30;
                this.size.y = 20;
            }
            */
        },
        
        // opt out of collision
        handleMovementTrace: function(res) {
        
            //this.pos.x = ig.game.player.pos.x - 20;
            //this.pos.y = ig.game.player.pos.y - 12;
            
        },
        
        // when overlapping with .checkAgainst entities
        check: function(other) {
            
            if (this.canDamage)
            {
                other.receiveDamage(1, this);
            }
            
        },
        
    });
    
    ig.EntityPool.enableFor(EntityPlayerPunch);
});