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
        
        levelName: 'stage1',
        clearColor: '#3987c9',
        isPaused: false,
        tileSize: 30,
        gravity: 1200,
        bunnyKillCounter: 0,
        touchButtons: null,
        
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
            
            // add touch controls
            if (fullscreen || ig.ua.mobile)
            {
                var settings = null;
                this.touchButtons = [];
                
                // Left button
                settings = {action:'left', anchor:{bottom:0, left:0, offset:{x:0, y:0}}, width:120, height:120, imgSrc:'media/buttons/arrow-left.png'};
                this.touchButtons.push(ig.game.spawnEntity(EntityButton, 0, 0, settings));
                
                // Right button
                settings = {action:'right', anchor:{bottom:0, left:0, offset:{x:120, y:0}}, width:120, height:120, imgSrc:'media/buttons/arrow-right.png'};
                this.touchButtons.push(ig.game.spawnEntity(EntityButton, 0, 0, settings));
                
                // Attack button
                settings = {action:'attack', anchor:{bottom:0, right:0, offset:{x:-120, y:0}}, width:120, height:120, imgSrc:'media/buttons/button-a.png'};
                this.touchButtons.push(ig.game.spawnEntity(EntityButton, 0, 0, settings));
                
                // Jump button
                settings = {action:'jump', anchor:{bottom:0, right:0, offset:{x:0, y:0}}, width:120, height:120, imgSrc:'media/buttons/button-b.png'};
                this.touchButtons.push(ig.game.spawnEntity(EntityButton, 0, 0, settings));
            }
            
            // load the level
            this.loadLevel(LevelArea1);
            
            // show collision boxes
            //ig.Entity._debugShowBoxes = true;
            
            this.resizeGame();
            
        },
        
        update: function() {
        
            // track touch buttons
            // *must be done before parent update or the input "pressed" event won't work
            // I think it has something to do with "ig.input.clearPressed();" getting called
            if (this.touchButtons)
            {
                for ( var i = 0; i < this.touchButtons.length; i++ )
                {
                    this.touchButtons[i].update();
                }
            }
            
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
            
            // draw touch controls
            if (this.touchButtons)
            {
                for ( var i = 0; i < this.touchButtons.length; i++ ) {
                    this.touchButtons[i].draw(true);
                }
            }
            
        },
        
        loadLevel: function(data) {
        
            // update background layer with x-axis parallax
            for (obj in data.layer)
            {
                if (data.layer[obj].name == 'background_1')
                {
                    data.layer[obj].distance = 2;
                }
            }
            
            // remember the currently loaded level, so we can reload when the player dies.
            this.currentLevel = data;
            
            // call the parent implemenation. this creates the background maps and entities.
            this.parent(data);
            
            // setup simple camera plugin
            this.camera = new ig.SimpleCamera();
            this.camera.offset.x.min = 0;
            this.camera.offset.x.max = 0;
            this.camera.getMinMax();
            
            // add level HUD
            ig.game.spawnEntity(EntityHud, 0, 0);
            
        },
        
        // add another bunny
        addBunny: function() {
            
            if (this.player)
            {
                var xPos, yPos = 0;
                
                // if the player is on the left side of the stage
                if (this.player.pos.x < ig.system.width)
                {
                    if (this.namedEntities)
                    {
                        if (this.namedEntities.bunnyspawner2)
                        {
                            xPos = this.namedEntities.bunnyspawner2.pos.x;
                            yPos = this.namedEntities.bunnyspawner2.pos.y;
                        }
                    }
                }
                
                // else, if the player is on the right side of the stage
                else if (this.player.pos.x > (ig.game.collisionMap.pxWidth - ig.system.width))
                {
                    if (this.namedEntities)
                    {
                        if (this.namedEntities.bunnyspawner2)
                        {
                            xPos = this.namedEntities.bunnyspawner2.pos.x;
                            yPos = this.namedEntities.bunnyspawner2.pos.y;
                        }
                    }
                }
                
                // else, the player is near the middle
                else
                {
                    if (this.namedEntities)
                    {
                        if (Math.random() > 0.5)
                        {
                            if (this.namedEntities.bunnyspawner1)
                            {
                                xPos = this.namedEntities.bunnyspawner1.pos.x;
                                yPos = this.namedEntities.bunnyspawner1.pos.y;
                            }
                        }
                        else
                        {
                            if (this.namedEntities.bunnyspawner3)
                            {
                                xPos = this.namedEntities.bunnyspawner3.pos.x;
                                yPos = this.namedEntities.bunnyspawner3.pos.y;
                            }
                        }
                    }
                }
                
                // add a new bunny
                ig.game.spawnEntity(EntityBunny, xPos, yPos);
            }
            
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
            
            // update touch controls
            if (this.touchButtons)
            {
                for ( var i = 0; i < this.touchButtons.length; i++ )
                {
                    this.touchButtons[i].draw(true);
                }
            }
                
            // update camera boundaries
            if (this.camera)
            {
                this.camera.getMinMax();
            }
            
        },
        
    });
});