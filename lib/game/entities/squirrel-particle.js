ig.module(
    'game.entities.squirrel-particle'
)
.requires(
    'plugins.particle'
)
.defines(function() {
    EntitySquirrelParticle = EntityParticle.extend({
        
        size: {x: 4, y: 4},
        lifetime: 0.7,
        fadetime: 0.25,
        bounciness: 0.7,
        vel: {x: 100, y: 200},
        maxVel: {x: 200, y: 200},
        animSheet: new ig.AnimationSheet('media/squirrel-particle.png', 4, 4),
            
        init: function(x, y, settings) {
        
            this.addAnim('idle', 5, [0,1,2,3]);
            this.parent(x, y, settings);
            
        },
        
        prepareEntity: function(settings) {
            
            this.parent(settings);
            
            var speed = ((Math.random() * 180) + 20); // 20 - 200
            this.vel.x = speed * (settings.flip ? -1 : 1);
            this.vel.y = -((Math.random() * 180) + 20); // 20 - 200
            
        },
        
    });
    
    ig.EntityPool.enableFor(EntitySquirrelParticle);
});