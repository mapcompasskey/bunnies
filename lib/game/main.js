ig.module( 
	'game.main' 
)
.requires(
    'impact.debug.debug',
	'impact.game',
	'impact.font',
    //'plugins.camera',
    'plugins.simple-camera',
    'game.entities.player',
    'game.entities.bunny',
    'game.levels.area1'
)
.defines(function(){
    
    //
    // --------------------------------------------------------------------------
    // The Game Stage
    // --------------------------------------------------------------------------
    //
    GameStage = ig.Game.extend({
        
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
            ig.Entity._debugShowBoxes = true;
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
            
            // setup camera plugin
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
    
    
    
    //
    // --------------------------------------------------------------------------
    // ImpactJS Overrides
    // --------------------------------------------------------------------------
    //
    // override default parallax effect to force y-axis positiong from certain layers
    ig.BackgroundMap.inject({
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
    
    /*
    ig.BackgroundMap.inject({
    	drawTiled: function() {	
            var tile = 0,
                anim = null,
                tileOffsetX = (this.scroll.x / this.tilesize).toInt(),
                tileOffsetY = (this.scroll.y / this.tilesize).toInt(),
                pxOffsetX = this.scroll.x % this.tilesize,
                pxOffsetY = this.scroll.y % this.tilesize,
                pxMinX = -pxOffsetX - this.tilesize,
                pxMinY = -pxOffsetY - this.tilesize,
                pxMaxX = ig.system.width + this.tilesize - pxOffsetX,
                pxMaxY = ig.system.height + this.tilesize - pxOffsetY;
                
            if (this.name == 'clouds') {
                
                var tileY = 0;
                pxY = ig.system.height - 100;
                
                for( var mapX = -1, pxX = pxMinX; pxX < pxMaxX; mapX++, pxX += this.tilesize ) {
                    var tileX = mapX + tileOffsetX;
                    
                    // Repeat X?
                    if( tileX >= this.width || tileX < 0 ) {
                        if( !this.repeat ) { continue; }
                        tileX = (tileX%this.width + this.width) % this.width;
                    }
                    
                    // Draw!
                    if( (tile = this.data[tileY][tileX]) ) {
                        if( (anim = this.anims[tile-1]) ) { 
                            anim.draw( pxX, pxY );
                        }
                        else {
                            this.tiles.drawTile( pxX, pxY, tile-1, this.tilesize );
                        }
                    }
                } // end for x
            
            }
            else {
                // FIXME: could be sped up for non-repeated maps: restrict the for loops
                // to the map size instead of to the screen size and skip the 'repeat'
                // checks inside the loop.
                
                for( var mapY = -1, pxY = pxMinY; pxY < pxMaxY; mapY++, pxY += this.tilesize) {
                    var tileY = mapY + tileOffsetY;
                        
                    // Repeat Y?
                    if( tileY >= this.height || tileY < 0 ) {
                        if( !this.repeat ) { continue; }
                        tileY = (tileY%this.height + this.height) % this.height;
                    }
                    
                    for( var mapX = -1, pxX = pxMinX; pxX < pxMaxX; mapX++, pxX += this.tilesize ) {
                        var tileX = mapX + tileOffsetX;
                        
                        // Repeat X?
                        if( tileX >= this.width || tileX < 0 ) {
                            if( !this.repeat ) { continue; }
                            tileX = (tileX%this.width + this.width) % this.width;
                        }
                        
                        // Draw!
                        if( (tile = this.data[tileY][tileX]) ) {
                            if( (anim = this.anims[tile-1]) ) { 
                                anim.draw( pxX, pxY );
                            }
                            else {
                                this.tiles.drawTile( pxX, pxY, tile-1, this.tilesize );
                            }
                        }
                    } // end for x
                    
                } // end for y
            }
            
        }
    });
    */
    
    
    //
    // --------------------------------------------------------------------------
    // Initialize the Game
    // --------------------------------------------------------------------------
    //
    var width = window.innerWidth;
    var height = window.innerHeight;
    ig.main('#canvas', GameStage, 1, 300, 180, 3);
});
