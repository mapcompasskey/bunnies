ig.module(
    'game.entities.bunny-2'
)
.requires(
    'game.entities.bunny'
)
.defines(function() {
    EntityBunny2 = EntityBunny.extend({
        
        animSheet: new ig.AnimationSheet('media/bunny-2.png', 25, 25),
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.NONE,
        
        init: function(x, y, settings) {
        
            this.parent(x, y, settings);
            
        },
        
    });
});