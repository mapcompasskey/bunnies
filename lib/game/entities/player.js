ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityPlayer = ig.Entity.extend({
        
        size: {x: 12, y: 24},
        offset: {x: 14, y: 16},
        maxVel: {x: 110, y: 400},
        friction: {x: 0, y: 0},
        flip: false,
        speed: 100,
        jump: 210,
        health: 6,
        maxHealth: 6,
        animSheet: new ig.AnimationSheet( 'media/player.png', 40, 40 ),
        
        isInvincible: false,
        speedMultiplier: 1,
        
        walking: false,
        jumping: false,
        falling: false,
        hurting: false,
        crouching: false,
        dying: false,
        attacking: false,
        //attack_1: false,
        //attack_jump: false,
        
        type: ig.Entity.TYPE.A, // add to friendly group
        checkAgainst: ig.Entity.TYPE.NONE, // check collisions against nothing
        collides: ig.Entity.COLLIDES.PASSIVE,
        
        init: function( x, y, settings ) {
            this.parent( x, ( y - this.size.y ), settings );
            
            // add the animations
            this.addAnim( 'idle', 1, [0], true );
            this.addAnim( 'crouch', 1, [1], true );
            this.addAnim( 'jump', 1, [2], true );
            this.addAnim( 'fall', 1, [3], true );
            this.addAnim( 'walk', 0.2, [4, 5, 6, 5] );
            this.addAnim( 'hurt', 1, [3], true );
            this.addAnim( 'dead', 1, [3], true );
            this.addAnim( 'attack', 0.05, [8, 9, 10, 11, 11] );
            
            // game instance of this entity
            ig.game.player = this;
        },
        
        update: function() {
            
            if ( ig.game.isPaused ) {
                return;
            }
            
            this.checkStatus();
            this.checkPosition();
            this.parent();
                        
            // update sword
            this.updatePlayerSword();
        },
        
        checkStatus: function() {
        
            // update direction facing
            if ( ! this.hurting && ! this.dying ) {
                if ( ig.input.state('left') ) {
                    this.flip = true;
                }
                else if ( ig.input.state('right') ) {
                    this.flip = false;
                }
            }
            
            // toggle invincibility
            if ( ig.input.pressed('invincible') ) {
                this.isInvincible = this.isInvincible ? false : true;
            }
            
            // check entity status
            this.isHurting();
            this.isCrouching();
            this.isAttacking();
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
            
            // if hurting, stop hurting when the animation ends
            if ( this.hurting ) {
                if ( this.currentAnim == this.anims.hurt ) {
                    if ( this.currentAnim.loopCount ) {
                        this.hurting = false;
                    }
                }
            }
            
        },
        
        // check if crouching
        isCrouching: function() {
            
            if ( this.hurting || this.dying || this.jumping || this.falling || this.attacking ) {
                return;
            }
            
            // if standing on something and just pressed "DOWN" button
            if ( ! this.crouching ) {
                if ( this.standing && ig.input.state('down') ) {
                    this.crouching = true;
                    this.vel.x = 0;
                    this.updateCollisionBox();
                    return;
                }
            }
            // else, if crouching and no longer pressing "DOWN" button
            else {
                if ( ! ig.input.state('down') ) {
                    this.crouching = false;
                    this.updateCollisionBox();
                }
            }
            
        },
        
        // check if attacking
        isAttacking: function() {
            
            if ( this.hurting || this.dying || this.crouching ) {
                this.attacking = false;
                return;
            }
            /*
            // if attacking 1
            if ( this.attacking && this.attack_1 ) {
                if ( this.currentAnim == this.anims.attack1 ) {
                    if ( this.sword ) {
                        if ( this.currentAnim.frame > 1 ) {
                            this.sword.canDamage = true;
                        } else {
                            this.sword.canDamage = false;
                        }
                    }
                    
                    if ( this.currentAnim.loopCount ) {
                        this.attack_1 = false;
                        this.attacking = false;
                        if ( this.sword ) {
                            this.sword.attack_1 = false;
                            this.sword.updateCollisionBox();
                        }
                    }
                }
            }
            
            // if jump attack
            if ( this.attacking && this.attack_jump ) {
                if ( this.currentAnim == this.anims.attackJump ) {
                    if ( this.sword ) {
                        if ( this.currentAnim.frame > 1 ) {
                            this.sword.canDamage = true;
                        } else {
                            this.sword.canDamage = false;
                        }
                    }
                    
                    if ( this.currentAnim.loopCount ) {
                        this.attack_jump = false;
                        if ( this.sword ) {
                            this.sword.attack_jump = false;
                            this.sword.updateCollisionBox();
                        }
                        this.attacking = false;
                    }
                }
            }
            
            // is attack button pressed
            if ( ! this.attacking ) {
                if ( ig.input.pressed('attack') ) {
                
                    // add player sword entity
                    this.sword = ig.game.spawnEntity( EntityPlayerSword, 0, 0 );
                    
                    // if jumping/falling
                    if ( this.jumping || this.falling ) {
                        this.attacking = true;
                        this.attack_jump = true;
                        this.sword.attack_jump = true;
                    }
                    // else, normal attack
                    else {
                        this.attacking = true;
                        this.attack_1 = true;
                        this.sword.attack_1 = true;
                    }
                    
                    this.sword.updateCollisionBox();
                }
            }
            */
            
            // if attacking
            if ( this.attacking ) {
                if ( this.currentAnim == this.anims.attack ) {
                    if ( this.currentAnim.loopCount ) {
                        this.attacking = false;
                    }
                }
            }
            
            // if attack button pressed
            if ( ! this.attacking && ig.input.pressed('attack') ) {
                this.attacking = true;
            }
            
        },
        
        // check if jumping
        isJumping: function() {
            
            if ( this.hurting || this.dying || this.crouching ) {
                this.jumping = false;
                this.falling = false;
                return;
            }
            
            // if standing on something and just pressed "JUMP" button
            if ( this.standing && ig.input.pressed('jump') ) {
                this.jumping = true;
                this.vel.y = -this.jump;
                return;
            }
            
            // reduce jumping height
            if ( this.jumping && ig.input.released('jump') ) {
                this.vel.y = ( this.vel.y / 2 );
            }
            
            // if falling
            if ( this.vel.y > 0 && ! this.standing ) {
                this.falling = true;
                return;
            }
            
            // if standing on something while jumping/falling
            if ( ( this.jumping || this.falling ) && this.standing ) {
                this.jumping = false;
                this.falling = false;
            }
            
        },
        
        // checking if idle or moving left/right
        isMoving: function() {
        
            if ( this.hurting || this.dying || this.crouching ) {
                this.walking = false;
                return;
            }
            
            // reduce speed if attacking
            this.speedMultiplier = 1;
            if ( this.attacking && ! this.jumping && ! this.falling) {
                this.speedMultiplier = 0.5;
            }
            
            // if moving left
            if ( ig.input.state('left') ) {
                this.walking = true;
                this.vel.x = -(this.speed * this.speedMultiplier);
            }
            // else, if moving right
            else if ( ig.input.state('right') ) {
                this.walking = true;
                this.vel.x = (this.speed * this.speedMultiplier);
            }
            // else, if standing still
            else {
                this.walking = false;
                this.vel.x = 0;
            }
            
        },
        
        // update entity animation
        animate: function() {
            
            // update entitiy opacity
            if ( this.hurting || this.isInvincible ) {
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
            else if ( this.crouching ) {
                if ( this.currentAnim != this.anims.crouch ) {
                    this.currentAnim = this.anims.crouch.rewind();
                }
            }
            /*
            else if ( this.attacking ) {
                if ( this.attack_jump ) {
                    if ( this.currentAnim != this.anims.attackJump ) {
                        this.currentAnim = this.anims.attackJump.rewind();
                    }
                }
                else if ( this.attack_1 ) {
                    if ( this.currentAnim != this.anims.attack1 ) {
                        this.currentAnim = this.anims.attack1.rewind();
                    }
                }
            }
            */
            else if ( this.attacking ) {
                if ( this.currentAnim != this.anims.attack ) {
                    this.currentAnim = this.anims.attack.rewind();
                }
            }
            else if ( this.falling ) {
                if ( this.currentAnim != this.anims.fall ) {
                    this.currentAnim = this.anims.fall.rewind();
                }
            }
            else if ( this.jumping ) {
                if ( this.currentAnim != this.anims.jump ) {
                    this.currentAnim = this.anims.jump.rewind();
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
        
        // update player sword
        updatePlayerSword: function() {
            
            if ( this.sword ) {
            
                // update sword position
                if ( this.attacking ) {
                    this.sword.updatePosition( this );
                }
                // else, remove the sword
                else {
                    this.sword.kill();
                    this.sword = null;
                }
            }
        },
        
        // check if this entity needs repositioned
        checkPosition: function() {
        
            // if this entity has moved off the map
            if ( this.pos.x < 0 ) {
                this.pos.x = ( ig.game.collisionMap.pxWidth - ( this.size.x * 2 ) );
            }
            else if ( ( this.pos.x + this.size.x ) > ig.game.collisionMap.pxWidth ) {
                this.pos.x = this.size.x;
            }
            
            // if this entity has fallen off the map
            if ( this.pos.y > ig.game.collisionMap.pxHeight ) {
                this.pos.y = 0;
            }
            
        },
        
        // update the size of the collision box
        updateCollisionBox: function() {
            
            if ( this.crouching ) {
                this.size.x = 12;
                this.size.y = 20;
                this.offset.x = 18;
                this.offset.y = 20;
                this.pos.y += 4;
            } else {
                this.size.x = 12;
                this.size.y = 24;
                this.offset.x = 14;
                this.offset.y = 16;
                this.pos.y -= 4;
            }
        
        },
        
        // called when overlapping with an entity whose .checkAgainst property matches this entity
        receiveDamage: function( amount, from ) {
        
            if ( this.hurting || this.dying || this.isInvincible ) {
                return;
            }
            
            /*
            // reduce health
            this.health -= amount;
            
            // if dead
            if ( this.health <= 0 ) {
                this.vel.x = 0;
                this.vel.y = 0;
                this.maxVel.x = 0;
                this.maxVel.y = 0;
                this.dying = true;
                return true;
            }
            
            // update state
            this.hurting = true;
            
            // apply knockback
            this.vel.x = ( from.pos.x > this.pos.x ) ? -200 : 200;
            this.vel.y = -150;
            */
            
            return true;
        },
        
    });
});