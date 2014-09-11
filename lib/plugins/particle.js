/*
Base entity class for particle entities. Subclass your own particles from
this class. See the EntityDebrisParticle in debris.js for an example.

Particle entities will kill themselfs after #lifetime# seconds. #fadetime#
seconds before the #lifetime# ends, they will start to fade out.

The velocity of a particle is randomly determined by its initial .vel 
properties. Its Animation will start at a random frame.
*/
ig.module(
    'plugins.particle'
)
.requires(
	'impact.entity',
    'impact.entity-pool'
)
.defines(function() {
    EntityParticle = ig.Entity.extend({
    
        size: {x: 4, y: 4},
        offset: {x: 0, y: 0},
        maxVel: {x: 160, y: 160},
        friction: {x:20, y: 0},
        bounciness: 0.6,
        
        lifetime: 5,
        fadetime: 1,
        idleTimer: null,
        minBounceVelocity: 0,
        
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.LITE,
        
        init: function(x, y, settings) {
        
            this.parent(x, y, settings);
            this.prepareEntity(settings);
            
        },
        
        reset: function(x, y, settings) {
            
            this.parent(x, y, settings);
            this.prepareEntity(settings);
            
        },
        
        prepareEntity: function(settings) {
            
            this.vel.x = ((Math.random() * 2 - 1) * this.vel.x);
            this.vel.y = ((Math.random() * 2 - 1) * this.vel.y);
            this.currentAnim.flip.x = (Math.random() > 0.5);
            this.currentAnim.flip.y = (Math.random() > 0.5);
            this.currentAnim.gotoRandomFrame();
            this.idleTimer = new ig.Timer();
            
        },
        
        update: function() {
        
            if (this.idleTimer.delta() > this.lifetime)
            {
                this.kill();
                return;
            }
            
            //this.currentAnim.alpha = this.idleTimer.delta().map((this.lifetime - this.fadetime), this.lifetime, 1, 0);
            this.parent();
            
        },
   
    });
    
    ig.EntityPool.enableFor(EntityParticle);
});