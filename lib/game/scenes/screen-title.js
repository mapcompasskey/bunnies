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
        tileSize: 30,
        gravity: 400,
        imgLogoPos: {x: 0, y: 0},
        imgLogo: new ig.Image('media/destroy-all-bunnies.png'),
        imgBackground: new ig.Image('media/title-image-background.png'),
        imgForeground: new ig.Image('media/title-image-foreground.png'),
        
        // initialize your game here
        init: function() {
            
            // bind keys
            ig.input.bind(ig.KEY.MOUSE1, 'click');
            
            // add Start button
            var settings = {action:'start', anchor:{bottom:15, right:15, offset:{x:0, y:0}}, width:150, height:57, imgSrc:'media/buttons/start.png'};
            this.buttonStart = ig.game.spawnEntity(EntityButton, 0, 0, settings);
            
            // load the level
            this.loadLevel(LevelTitle1);
            
            // show collision boxes
            //ig.Entity._debugShowBoxes = true;
            
            this.resizeGame();
            
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
            
            // if Start button is pressed
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
            
            // draw Start button
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
            
        },
        
        // update the game size and the placement of some elements
        resizeGame: function() {
        
            // has the game started
            if ( ! ig.system)
            {
                return;
            }
            
            // resize the canvas
            if (fullscreen || ig.ua.mobile)
            {
                if (ig.gameCanvas)
                {
                    ig.gameCanvas.style.width  = window.innerWidth + 'px';
                    ig.gameCanvas.style.height = window.innerHeight + 'px';
                    ig.system.resize((window.innerWidth * ig.gameScale), (window.innerHeight * ig.gameScale));
                }
            }
            
            // update logo position
            this.imgLogoPos.x = ((ig.system.width / 2) - (this.imgLogo.width / 2));
            this.imgLogoPos.y = 30;
            
            // reposition Start button
            this.buttonStart.align();
            
        },
        
    });
});