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
        
        clearColor: '#000000',
        imgBackground: new ig.Image('media/bg-screen-title.png'),
        imgLogo: new ig.Image('media/game-logo.png'),
        imgLogoPos: {x: 0, y: 0},
        
        // initialize your game here
        init: function() {
            
            // bind keys
            ig.input.bind(ig.KEY.MOUSE1, 'click');
            
            // add "Start" button
            var settings = {action:'start', anchor:{bottom:5, right:5, offset:{x:0, y:0}}, width:50, height:19, imgSrc:'media/start.png'};
            this.buttonStart = ig.game.spawnEntity(EntityButton, 0, 0, settings);
            
            // set image position
            this.imgLogoPos.x = ((ig.system.width / 2) - (this.imgLogo.width / 2));
            this.imgLogoPos.y = ((ig.system.height / 2) - (this.imgLogo.height / 2));
            
        },
        
        update: function() {
        
            this.parent();
            
            // if "Start" button is pressed
            if (ig.input.released('start'))
            {
                ig.system.setGame(Stage1);
            }
            
        },
        
        draw: function() {
        
            this.parent();
            
            // draw background
            this.imgBackground.draw(0, 0);
            
            // draw logo
            this.imgLogo.draw(this.imgLogoPos.x, this.imgLogoPos.y);
            
            // draw "Start" button
            this.buttonStart.draw(true);
            
        },
        
    });
});