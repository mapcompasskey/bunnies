ig.module( 
	'game.main' 
)
.requires(
    //'impact.debug.debug',
	'impact.game',
	'impact.font',
    'plugins.simple-camera',
    'game.scenes.screen-title',
    'game.scenes.stage-1',
    'game.entities.hud',
    'game.entities.button',
    'game.entities.player',
    'game.entities.bunny',
    'game.entities.bunny-2',
    'game.levels.title1',
    'game.levels.area1'
)
.defines(function(){

    //
    // --------------------------------------------------------------------------
    // ImpactJS Overrides
    // --------------------------------------------------------------------------
    //
    ig.BackgroundMap.inject({
    
        // override default parallax effect on some layers
        setScreenPos: function(x, y) {
        
            this.scroll.x = (x / this.distance);
            //this.scroll.y = (y / this.distance);
            
            switch (this.name)
            {
                case 'skyline':
                    this.scroll.y = y;
                    break
                
                case 'background_1':
                    this.scroll.y = y;
                    break
                
                default:
                    this.scroll.y = (y / this.distance);
            }
            
        }
        
    });
    
    //
    // --------------------------------------------------------------------------
    // Fullscreen / Mobile mode
    // --------------------------------------------------------------------------
    //
    
    // scale the game down by 2 if the browser width is less than 640 pixels
    ig.gameScale = (window.innerWidth < 640 ? 2 : 1);
    if (fullscreen || ig.ua.mobile)
    {
        // set the canvas element to the size of the window
        ig.gameCanvas = document.getElementById('canvas');
        ig.gameCanvas.style.width  = window.innerWidth + 'px';
        ig.gameCanvas.style.height = window.innerHeight + 'px';
        
        // on browser resize, update the canvas and game entities
        window.addEventListener('resize', function() {
            if ( ! ig.system)
            {
                return;
            }
            ig.game.resizeGame();
        }, false);
    }
    
    //
    // --------------------------------------------------------------------------
    // Initialize the Game
    // --------------------------------------------------------------------------
    //
    ig.main('#canvas', ScreenTitle, 1, 900, 540, 1);
    //ig.main('#canvas', Stage1, 1, 900, 540, 1);
    
});