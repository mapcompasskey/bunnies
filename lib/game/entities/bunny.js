ig.module(
    'game.entities.bunny'
)
.requires(
    'game.entities.player-punch',
    'impact.entity',
    'impact.entity-pool'
)
.defines(function() {
    EntityBunny = ig.Entity.extend({
        
        size: {x: 15, y: 12},
        offset: {x: 5, y: 13},
        maxVel: {x: 500, y: 300},
        friction: {x: 0, y: 0},
        flip: false,
        speed: 140,
        jump: 220,
        health: 4,
        maxHealth: 4,
        animSheet: new ig.AnimationSheet( 'media/bunny.png', 25, 25 ),
        
        actionTimer: null,
        hurting: false,
        dying: false,
        falling: false,
        
        type: ig.Entity.TYPE.B, // add to enemy group
        checkAgainst: ig.Entity.TYPE.A, // check collisions against friendly group
        collides: ig.Entity.COLLIDES.PASSIVE,
        
        init: function( x, y, settings ) {
            this.parent( x, ( y - this.size.y ), settings );
            
            // add the animations
            this.addAnim( 'idle', 1, [0], true );
            this.addAnim( 'walk', 0.2, [1, 2, 3] );
            this.addAnim( 'fall', 1, [2], true );
            this.addAnim( 'hurt', 1, [3], true );
            this.addAnim( 'dead', 1, [3], true );
            
            this.prepareEntity();
        },
        
        // resurrect this entity from the entity pool (pooling enabled below)
        reset: function( x, y, settings ) {
            this.parent( x, ( y - this.size.y ), settings );
            this.prepareEntity();
        },
              
        // reset parameters
        prepareEntity: function() {
            
            // reset parameters
            this.speed = Math.floor( ( Math.random() * 50 ) + 100 ); // 100 - 150
            this.maxVel = {x: 500, y: 300};
            this.health = this.maxHealth;
            
            this.hurting = false;
            this.dying = false;
            this.falling = false;
            
            // set entity action
            this.updateAction();
            //this.walking = true;
            //this.falling = true;
            //this.flip = !this.flip;
        },
        
        update: function() {
        
            if ( ig.game.isPaused ) {
                return;
            }
            
            this.checkStatus();
            this.checkPosition();
            this.parent();
        },
        
        checkStatus: function() {
            
            // if action timer ended
            if ( this.actionTimer ) {
                if ( this.actionTimer.delta() > 0 ) {
                    this.updateAction();
                }
            }
            
            // check entity status
            this.isHurting();
            this.isJumping();
            this.isMoving();
            this.animate();
        },
        
        // check if hurting
        isHurting: function() {
            
            // if dying, kill this entity when the animation ends
            if ( this.dying ) {
                if ( this.currentAnim == this.anims.dead ) {
                    if ( this.currentAnim.loopCount ) {
                        this.kill();
                    }
                }
            }
            
            /*
            // stop hurting when the animation ends
            if ( this.hurting ) {
                if ( this.currentAnim == this.anims.hurt ) {
                    if ( this.currentAnim.loopCount ) {
                        this.hurting = false;
                    }
                }
            }
            */
            
            // stop hurting when the entity lands
            if ( this.hurting ) {
                if ( this.currentAnim == this.anims.hurt ) {
                    if ( this.standing ) {
                        this.hurting = false;
                    }
                }
            }
            
        },
        
        // check if jumping
        isJumping: function() {
            
            if ( this.hurting || this.dying ) {
                this.falling = false;
                return;
            }
            
            // if falling
            if ( this.vel.y > 0 && ! this.standing ) {
                this.falling = true;
                return;
            }
            
            // if standing on something while jumping/falling
            if ( this.falling && this.standing ) {
                this.falling = false;
            }
            
        },
        
        // check if moving
        isMoving: function() {
            
            if ( this.hurting || this.dying ) {
                return;
            }
            
            if ( this.walking ) {
                this.vel.x = this.speed * ( this.flip ? -1 : 1 );
            } else {
                this.vel.x = 0;
            }
            
        },
        
        // update entity animation
        animate: function() {
            
            // update entitiy opacity
            if ( this.hurting || this.dying ) {
                this.currentAnim.alpha = 0.5;
            }
            else if ( this.currentAnim.alpha < 1 ) {
                this.currentAnim.alpha = 1;
            }
            
            // update animation state
            if ( this.dying ) {
                if ( this.currentAnim != this.anims.dead ) {
                    this.currentAnim = this.anims.dead.rewind();
                }
            }
            else if ( this.hurting ) {
                if ( this.currentAnim != this.anims.hurt ) {
                    this.currentAnim = this.anims.hurt.rewind();
                }
            }
            else if ( this.falling ) {
                if ( this.currentAnim != this.anims.fall ) {
                    this.currentAnim = this.anims.fall.rewind();
                }
            }
            else if ( this.walking ) {
                if ( this.currentAnim != this.anims.walk ) {
                    this.currentAnim = this.anims.walk.rewind();
                }
            }
            else {
                if ( this.currentAnim != this.anims.idle ) {
                    this.currentAnim = this.anims.idle.rewind();
                }
            }
            
            // update facing direction
            this.currentAnim.flip.x = this.flip;
        },
        
        // check if this entity needs repositioned
        checkPosition: function() {
            
            // if entity has reached the edge of a platform
            if ( ! this.hurting && ! this.falling ) {
                var xPos = this.pos.x + ( this.flip ? -1 : this.size.x + 1 );
                var yPos = ( this.pos.y + this.size.y + 1 );
                if ( ! ig.game.collisionMap.getTile( xPos, yPos ) ) {
                    
                    // check again incase the entity is moving down a sloped tile
                    yPos += (ig.game.tileSize * 2);
                    if ( ! ig.game.collisionMap.getTile( xPos, yPos ) ) {
                        this.flip = !this.flip;
                        this.vel.x = ( this.vel.x > 0 ? -this.vel.x : this.vel.x );
                    }
                    
                }
            }
            
            // if this entity has moved off the map
            if ( (this.pos.x - 10) < 0 ) {
                this.pos.x = ( ig.game.collisionMap.pxWidth - (this.size.x * 2) );
            }
            else if ( (this.pos.x + this.size.x + 10) > ig.game.collisionMap.pxWidth ) {
                this.pos.x = this.size.x;
            }
            
            // if this entity has fallen off the map
            if ( this.pos.y > ig.game.collisionMap.pxHeight ) {
                this.pos.y = 0;
            }
            
        },
                
        // update entity action
        updateAction: function() {
            
            if ( this.hurting || this.dying ) {
                return;
            }
            
            // get a random number 1 - 5
            var num = Math.floor( ( Math.random() * 5 ) + 1 );
            switch ( num ) {
                // walk right
                case 5:
                case 4:
                    this.flip = false;
                    this.walking = true;
                    break;
                
                // walk left
                case 3:
                case 2:
                    this.flip = true;
                    this.walking = true;
                    break;
                
                // change direction
                default:
                    //this.walking = false;
                    this.flip = !this.flip;
            }
            
            // reset action timer to 1 - 5 seconds
            var timer = Math.floor( ( Math.random() * 5 ) + 1 );
            this.actionTimer = new ig.Timer( timer );
        },
        
        // called when this entity overlaps with an entity matching the .checkAgainst property
        check: function( other ) {
            
            if ( this.hurting || this.dying ) {
                return;
            }
            
            other.receiveDamage( 1, this );
        },
        
        // called by attacking entity
        receiveDamage: function( amount, from ) {
        
            if ( this.hurting || this.dying ) {
                return false;
            }
            
            // reduce health
            //this.health -= amount;
            
            // if dead
            if ( this.health <= 0 ) {
                this.vel = {x: 0, y: 0};
                this.maxVel = {x: 0, y: 0};
                this.dying = true;
                return true;
            }
            
            // update state
            this.hurting = true;
            
            // apply knockback
            this.vel.x = ( from.flip ? -140 : 140 );
            this.vel.y = -100;
            
            return true;
        }
        
    });
    
    ig.EntityPool.enableFor( EntityBunny );
});