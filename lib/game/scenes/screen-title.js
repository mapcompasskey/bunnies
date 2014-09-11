ig.module(
    'game.scenes.screen-title'
)
.requires(
    'impact.game'
)
.defines(function() {

    //
    // --------------------------------------------------------------------------
    // Title Screen
    // --------------------------------------------------------------------------
    //
    ScreenTitle = ig.Game.extend({
        
        levelName: 'title',
        clearColor: '#78cdf9',
        isPaused: false,
        tileSize: 10,
        gravity: 400,
        imgLogoPos: {x: 0, y: 0},
        imgLogo: new ig.Image('media/destroy-all-bunnies.png'),
        imgBackground: new ig.Image('media/title-background.png'),
        imgForeground: new ig.Image('media/title-foreground.png'),
        
        // initialize your game here
        init: function() {
            
            // bind keys
            ig.input.bind(ig.KEY.MOUSE1, 'click');
            
            // add "Start" button
            var settings = {action:'start', anchor:{bottom:5, right:5, offset:{x:0, y:0}}, width:50, height:19, imgSrc:'media/start.png'};
            this.buttonStart = ig.game.spawnEntity(EntityButton, 0, 0, settings);
            
            // set image position
            this.imgLogoPos.x = ((ig.system.width / 2) - (this.imgLogo.width / 2));
            this.imgLogoPos.y = 10;
            
            // load the level
            this.loadLevel(LevelTitle1);
            
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
            
            // if "Start" button is pressed
            this.buttonStart.update();
            if (ig.input.released('start'))
            {
                ig.system.setGame(Stage1);
            }
            
        },
        
        draw: function() {
            
            this.parent();
            
            // draw background
            this.imgBackground.draw(0, 0);
            
            // draw foreground
            this.imgForeground.draw(0, 0);
            
            // draw logo
            this.imgLogo.draw(this.imgLogoPos.x, this.imgLogoPos.y);
            
            // draw "Start" button
            this.buttonStart.draw(true);
            
        },
        
        loadLevel: function(data) {
            
            // remember the currently loaded level, so we can reload when the player dies.
            this.currentLevel = data;
            
            // call the parent implemenation. this creates the background maps and entities.
            this.parent(data);
            
            // update camera
            this.screen.x = (this.tileSize * 5);
            this.screen.y = 0;
            
            /*
            // spawn bunnies on the left side
            for (var i = 1; i < 8; i++)
            {
                ig.game.spawnEntity(EntityBunny2, (this.tileSize * 3), (this.tileSize * 12));
            }
            
            // spawn bunnies on the right side
            for (var i = 1; i < 8; i++)
            {
                ig.game.spawnEntity(EntityBunny2, (this.tileSize * 37), (this.tileSize * 12));
            }
            */
            
        },
        
    });
});