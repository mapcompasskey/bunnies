ig.module(
    'game.entities.blood-particle'
)
.requires(
    'plugins.particle'
)
.defines(function() {
    EntityBloodParticle = EntityParticle.extend({
        
        size: {x: 4, y: 4},
        lifetime: 0.5,
        fadetime: 0.25,
        bounciness: 0.6,
        vel: {x: 100, y: 200},
        maxVel: {x: 200, y: 200},
        animSheet: new ig.AnimationSheet('media/blood-particle.png', 4, 4),
            
        init: function(x, y, settings) {
        
            this.addAnim('idle', 5, [0,1,2,3,4,5,6,7]);
            this.parent(x, y, settings);
            
        },
        
        prepareEntity: function(settings) {
        
            this.parent(settings);
            
            var speed = ((Math.random() * 180) + 20); // 20 - 200
            this.vel.x = speed * (settings.flip ? -1 : 1);
            this.vel.y = -((Math.random() * 180) + 20); // 20 - 200
            
        },
        
    });
    
    ig.EntityPool.enableFor(EntityBloodParticle);
});