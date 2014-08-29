ig.module(
    'game.entities.bunny-particle'
)
.requires(
    'plugins.particle'
)
.defines(function() {
    EntityBunnyParticle = EntityParticle.extend({
        
        size: {x: 4, y: 4},
        lifetime: 0.7,
        fadetime: 0.25,
        bounciness: 0.7,
        vel: {x: 100, y: 200},
        maxVel: {x: 200, y: 200},
        animSheet: new ig.AnimationSheet('media/bunny-particle.png', 4, 4),
            
        init: function(x, y, settings) {
        
            this.addAnim('idle', 5, [0,1,2,3]);
            this.parent(x, y, settings);
                        
            // get a random number between 50 and 100
            var speed = ((Math.random() * 50) + 50);
            this.vel.x = speed * (settings.flip ? -1 : 1);
            
        },
        
    });
});