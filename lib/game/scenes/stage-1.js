ig.module(
    'game.scenes.stage-1'
)
.requires(
    'impact.game'
)
.defines(function() {

    //
    // --------------------------------------------------------------------------
    // Stage 1
    // --------------------------------------------------------------------------
    //
    Stage1 = ig.Game.extend({
        
        clearColor: '#000000',
        isPaused: false,
        tileSize: 10,
        gravity: 400,
        
        // initialize your game here
        init: function() {
            
            // bind keys
            ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
            ig.input.bind(ig.KEY.UP_ARROW, 'up');
            ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
            ig.input.bind(ig.KEY.X, 'jump');
            ig.input.bind(ig.KEY.Z, 'attack');
            ig.input.bind(ig.KEY.C, 'invincible');
            ig.input.bind(ig.KEY.P, 'pause');
            
            this.loadLevel(LevelArea1);
            
            // show collision boxes
            //ig.Entity._debugShowBoxes = true;
            
        },
        
        update: function() {
        
            this.parent();
            
            if (ig.input.pressed('pause'))
            {
                this.isPaused = !this.isPaused;
            }
            
            if (ig.game.isPaused)
            {
                return;
            }
            
            // update camera
            if (this.camera)
            {
                // camera follows the player
                this.camera.follow(this.player);
            }
            else
            {
                // center screen on the player
                this.screen.x = (this.player.pos.x - (ig.system.width / 2));
                this.screen.y = (this.player.pos.y - (ig.system.height / 2));
            }
            
        },
        
        draw: function() {
        
            this.parent();
            
        },
        
        loadLevel: function(data) {
        
            // update clouds layer with x-axis parallax
            for (obj in data.layer)
            {
                if (data.layer[obj].name == 'clouds')
                {
                    data.layer[obj].distance = 3;
                    //console.log(data.layer[obj]);
                }
            }
            
            // remember the currently loaded level, so we can reload when the player dies.
            this.currentLevel = data;
            
            // call the parent implemenation. this creates the background maps and entities.
            this.parent(data);
            
            // setup camera plugin
            //this.camera = new ig.Camera();
            
            // setup simple camera plugin
            this.camera = new ig.SimpleCamera();
            this.camera.offset.x.min = 0;
            this.camera.offset.x.max = 0;
            this.camera.getMinMax();
            
            // spanw bunny
            for (var i = 1; i < 10; i++)
            {
                ig.game.spawnEntity(EntityBunny, (this.tileSize * (10 * i)), (this.tileSize * 30));
            }
            
            // spawn player
            ig.game.spawnEntity(EntityPlayer, (this.tileSize * 5), (this.tileSize * 30));
            
        },
        
    });
});