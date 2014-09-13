ig.module(
    'game.entities.hud'
)
.requires(
    'impact.entity',
	'impact.font'
)
.defines(function() {
    EntityHud = ig.Entity.extend({
        
        size: {x: 0, y: 0},
        fontMunro: new ig.Font('media/font.munro.png'),
        imgBunny: new ig.Image('media/hub-image-bunny.png'),
        imgBackground: new ig.Image('media/hud-image-background.png'),
        
        bunny: {
            counter: 0,
            timer: 0,
            //sheetIcon: new ig.AnimationSheet( 'media/hub-image-bunny.png', 60, 60 ),
            sheetIcon: new ig.AnimationSheet( 'media/hub-image-bunny.png', 40, 40 ),
            animIcon: {
                'idle': null,
                'hurt': null
            }
        },
        
        /*
        size: {x: 0, y: 0},
        maxVel: {x: 0, y: 0},
        font_calibri: new ig.Font( 'media/font.calibri.png' ),
        hudBackground: new ig.Image( 'media/hud-background.png' ),
        
        // player settings
        player: {
            health: 0,
            hearts: [],
            imgIcon: new ig.Image( 'media/player-icon.png' ),
            imgHearts: new ig.Image( 'media/player-hearts.png' ),
        },
        
        // building settings
        building: {
            sheetIcon: new ig.AnimationSheet( 'media/building-health.png', 40, 40 ),
            animIcon: {
                'idle': null,
                'hurt': null
            }
        },
        
        // zombie counter
        zombie: {
            imgIcon: new ig.Image( 'media/zombie-icon.png' ),
            imgIcon2: new ig.Image( 'media/zombie-dead-icon.png' )
        },
        */
        
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.NEVER,
        _wmIgnore: true,
        
        init: function(x, y, settings) {
        
            this.parent(x, y, settings);
            
            // add building icon animations
            //this.building.animIcon.idle = new ig.Animation( this.building.sheetIcon, 1, [0], true );
            //this.building.animIcon.hurt = new ig.Animation( this.building.sheetIcon, 0.3, [1, 0] );
            this.bunny.animIcon.idle = new ig.Animation(this.bunny.sheetIcon, 1, [0], true);
            this.bunny.animIcon.hurt = new ig.Animation(this.bunny.sheetIcon, 0.3, [1, 2]);
            
        },
        
        update: function() {
        
            if (ig.game.isPaused)
            {
                return;
            }
            
            this.parent();
            
        },
        
        // override default draw method
        draw: function() {
        
            this.drawBackground();
            this.drawBunnyCounter();
            //this.drawPlayerHealth();
            //this.drawBuildingHealth();
            //this.drawZombieCounter();
            
        },
        
        // draw the background
        drawBackground: function() {
            
            var width = ig.system.width;
            var tileSize = 60;
            var count = Math.ceil( width / tileSize );
            for ( var i = 0; i < count; i++ )
            {
                this.imgBackground.draw((tileSize * i ), 0);
            }
            
        },
        
        // draw the bunny counter
        drawBunnyCounter: function() {
            
            //this.imgBunny.draw(10, 10);
            this.fontMunro.draw('x' + ig.game.bunnyKillCounter, 65, 10, ig.Font.ALIGN.LEFT);
            
            if (this.bunny.counter != ig.game.bunnyKillCounter)
            {
                this.bunny.animIcon.hurt.draw(10, 10);
                this.bunny.animIcon.hurt.update();
                
                this.bunny.timer += ig.system.tick;
                if (this.bunny.timer > 2)
                {
                    this.bunny.timer = 0;
                    this.bunny.counter = ig.game.bunnyKillCounter;
                }
            }
            else
            {
                this.bunny.animIcon.idle.draw(10, 10);
            }
            
        }
        
        /*
        // display the player's health
        drawPlayerHealth: function() {
            if (ig.game.player) {
                var xPos = ig.system.width - 40;
                var yPos = 2;
                var health = ig.game.player.health;
                var maxHealth = ig.game.player.maxHealth;
                var var1 = 0;
                var var2 = 0;
                var tile = 0;
                
                // if health has changed
                if ( health != this.player.health ) {
                    this.player.hearts = [];
                    for ( var i = 0; i < maxHealth; i++ ) {
                        this.player.hearts.push( ( (health - i) > 0 ) ? 1 : 0 );
                    }
                    this.player.health = health;
                }
                
                // draw player icon
                this.player.imgIcon.drawTile( xPos, 0, 1, 40, 40 );
                
                // draw player hearts
                for ( var i = 0; i < Math.floor( maxHealth / 2 ); i++ ) {
                    var1 = this.player.hearts[ ( i * 2 ) + 0 ];
                    var2 = this.player.hearts[ ( i * 2 ) + 1 ];
                    tile = ( var1 + var2 );
                    xPos = ( xPos - 36 );
                    this.player.imgHearts.drawTile( xPos, yPos, tile, 36 );
                }
            }
        },
        
        // display the building's health
        drawBuildingHealth: function() {
            if (ig.game.building) {
            
                // add building icon
                if (ig.game.building.hurting) {
                    this.building.animIcon.hurt.draw( 0, 0 );
                    this.building.animIcon.hurt.update();
                } else {
                    this.building.animIcon.idle.draw( 0, 0 );
                }
                
                // add building health percentage
                this.font_calibri.draw( ig.game.building.percent + '%', 45, 7, ig.Font.ALIGN.LEFT );
            }
        },
        
        // draw the zombie counter
        drawZombieCounter: function() {
            this.zombie.imgIcon.draw( 140, 0 );
            this.font_calibri.draw( 'x' + ig.game.zombieCounter, 180, 7, ig.Font.ALIGN.LEFT );
            
            this.zombie.imgIcon2.draw( 240, 0 );
            this.font_calibri.draw( 'x' + ig.game.zombieDeadCounter, 280, 7, ig.Font.ALIGN.LEFT );
        }
        */
        
    });
});