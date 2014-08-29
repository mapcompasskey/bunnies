ig.module( 
	'game.main' 
)
.requires(
    'impact.debug.debug',
	'impact.game',
	'impact.font',
    //'plugins.camera',
    'plugins.simple-camera',
    'game.scenes.screen-title',
    'game.scenes.stage-1',
    'game.entities.button',
    'game.entities.player',
    'game.entities.bunny',
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
        
            this.scroll.x = x / this.distance;
            //this.scroll.y = y / this.distance;
            
            switch (this.name)
            {
                case 'clouds':
                    this.scroll.y = y;// + 200;
                    break
                    
                default:
                    this.scroll.y = y / this.distance;
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
    //ig.main('#canvas', GameStage, 1, 300, 180, 3);
    ig.main('#canvas', ScreenTitle, 1, 300, 180, 3);
    
});
