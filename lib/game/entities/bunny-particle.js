ig.module(
    'game.entities.bunny-particle'
)
.requires(
    'plugins.particle'
)
.defines(function() {
    EntityBunnyParticle = EntityParticle.extend({
        
        size: {x: 12, y: 12},
        lifetime: 0.7,
        fadetime: 0.25,
        bounciness: 0.7,
        vel: {x: 300, y: 600},
        maxVel: {x: 800, y: 800},
        animSheet: new ig.AnimationSheet('media/particles.png', 12, 12),
            
        init: function(x, y, settings) {
        
            this.addAnim('idle', 5, [4,5,6,7]);
            this.parent(x, y, settings);
            
        },
        
        prepareEntity: function(settings) {
            
            this.parent(settings);
            
            var speed = ((Math.random() * 540) + 60); // 60 - 600
            this.vel.x = speed * (settings.flip ? -1 : 1);
            this.vel.y = -((Math.random() * 540) + 60); // 60 - 600
            
        },
        
    });
    
    ig.EntityPool.enableFor(EntityBunnyParticle);
});