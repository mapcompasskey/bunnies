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
    // Initialize the Game
    // --------------------------------------------------------------------------
    //
    var width = window.innerWidth;
    var height = window.innerHeight;
    ig.main('#canvas', ScreenTitle, 1, 900, 540, 1);
    //ig.main('#canvas', Stage1, 1, 900, 540, 1);
    
});
