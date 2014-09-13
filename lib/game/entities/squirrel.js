ig.module(
    'game.entities.squirrel'
)
.requires(
    'game.entities.squirrel-acorn',
    'game.entities.blood-particle',
    'game.entities.squirrel-particle',
    'impact.entity',
    'impact.entity-pool'
)
.defines(function() {
    EntitySquirrel = ig.Entity.extend({
        
        size: {x: 60, y: 60},
        offset: {x: 0, y: 0},
        maxVel: {x: 200, y: 200},
        friction: {x: 0, y: 0},
        flip: false,
        speed: 0,
        jump: 0,
        health: 1,
        maxHealth: 1,
        animSheet: new ig.AnimationSheet('media/squirrel.png', 60, 60),
        
        attackDelay: 3,
        timerAttackDelay: null,
        canAttack: true,
        attackProximity: 240,
        canExplode: false,
        explodeFlip: false,
        
        attacking: false,
        hurting: false,
        dying: false,
        falling: false,
        
        type: ig.Entity.TYPE.B, // add to enemy group
        checkAgainst: ig.Entity.TYPE.A, // check collisions against friendly group
        collides: ig.Entity.COLLIDES.PASSIVE,
        
        init: function(x, y, settings) {
        
            this.parent(x, y, settings);
            
            // add the animations
            this.addAnim('idle', 1, [0], true);
            this.addAnim('attack', 1, [1], true);
            this.addAnim('fall', 1, [1], true);
            this.addAnim('hurt', 1, [2], true);
            this.addAnim('dead', 0.1, [2, 3], true);
            
            this.prepareEntity();
            
        },
        
        // resurrect this entity from the entity pool (pooling enabled below)
        reset: function(x, y, settings) {
        
            this.parent(x, (y - this.size.y), settings);
            this.prepareEntity();
            
        },
              
        // reset parameters
        prepareEntity: function() {
            
            // reset parameters
            this.maxVel = {x: 200, y: 200};
            this.health = this.maxHealth;
            
            this.hurting = false;
            this.dying = false;
            this.falling = false;
            
        },
        
        update: function() {
        
            if (ig.game.isPaused)
            {
                return;
            }
            
            this.checkStatus();
            this.checkPosition();
            this.parent();
            
        },
        
        checkStatus: function() {
            
            // check entity status
            this.isHurting();
            this.isJumping();
            this.isAttacking();
            this.animate();
            
        },
        
        // check if hurting
        isHurting: function() {
            
            // if dying
            if (this.dying)
            {
                // if can shoot particles
                if (this.canExplode)
                {
                    var x = this.pos.x + (this.size.x / 2);
                    var y = this.pos.y;
                    for (var i = 0; i < 20; i++)
                    {
                        ig.game.spawnEntity(EntityBloodParticle, x, y, {flip:this.explodeFlip});
                        ig.game.spawnEntity(EntitySquirrelParticle, x, y, {flip:this.explodeFlip});
                    }
                    this.canExplode = false;
                }
                
                // kill the entity when the animation ends
                if (this.currentAnim == this.anims.dead)
                {
                    if (this.currentAnim.loopCount)
                    {
                        this.kill();
                    }
                }
            }
            
            // if hurting
            if (this.hurting)
            {
                if (this.currentAnim == this.anims.hurt)
                {
                    // stop hurting when the animation ends
                    if (this.currentAnim.loopCount) {
                        this.hurting = false;
                    }
                    
                    // stop hurting when the entity lands
                    if (this.standing)
                    {
                        this.hurting = false;
                    }
                }
            }
            
        },
        
        // check if jumping
        isJumping: function() {
            
            if (this.hurting || this.dying)
            {
                this.falling = false;
                return;
            }
            
            // if falling
            if (this.vel.y > 0 && ! this.standing)
            {
                this.falling = true;
                return;
            }
            
            // if standing on something while jumping/falling
            if (this.falling && this.standing)
            {
                this.falling = false;
            }
            
        },
        
        // check if attacking
        isAttacking: function() {
            
            if (this.hurting || this.dying || this.falling)
            {
                return;
            }
            
            // if the player is within range
            if (ig.game.player)
            {
                var distance = this.distanceTo(ig.game.player);
                if (distance < this.attackProximity)
                {
                    // face the player
                    this.flip = (ig.game.player.pos.x < this.pos.x ? true : false);
                    
                    // if can attack
                    if (this.canAttack)
                    {
                        // throw an acorn
                        ig.game.spawnEntity(EntitySquirrelAcorn, this.pos.x, this.pos.y);
                        
                        // can't attack again until the timer has expired
                        this.canAttack = false;
                        this.timerAttackDelay = new ig.Timer(this.attackDelay);
                    }
                }
            }
            
            // if can't attack and there is an attack delay timer
            if ( ! this.canAttack && this.timerAttackDelay)
            {
                // if the attack delay timer has expired
                if (this.timerAttackDelay.delta() > 0)
                {
                    this.canAttack = true;
                }
            }
            
        },
        
        // update entity animation
        animate: function() {
            
            // update entitiy opacity
            /*if (this.hurting || this.dying)
            {
                this.currentAnim.alpha = 0.5;
            }
            else if (this.currentAnim.alpha < 1)
            {
                this.currentAnim.alpha = 1;
            }*/
            
            // update animation state
            if (this.dying)
            {
                if (this.currentAnim != this.anims.dead)
                {
                    this.currentAnim = this.anims.dead.rewind();
                }
            }
            else if (this.hurting)
            {
                if (this.currentAnim != this.anims.hurt)
                {
                    this.currentAnim = this.anims.hurt.rewind();
                }
            }
            else if (this.attack)
            {
                if (this.currentAnim != this.anims.attack)
                {
                    this.currentAnim = this.anims.attack.rewind();
                }
            }
            else if (this.falling)
            {
                if (this.currentAnim != this.anims.fall)
                {
                    this.currentAnim = this.anims.fall.rewind();
                }
            }
            else
            {
                if (this.currentAnim != this.anims.idle)
                {
                    this.currentAnim = this.anims.idle.rewind();
                }
            }
            
            // update facing direction
            this.currentAnim.flip.x = this.flip;
            
        },
        
        // check if this entity needs repositioned
        checkPosition: function() {
            /*
            // if this entity has moved off the map
            if ((this.pos.x - 10) < 0)
            {
                this.pos.x = (ig.game.collisionMap.pxWidth - (this.size.x * 2));
            }
            else if ((this.pos.x + this.size.x + 10) > ig.game.collisionMap.pxWidth)
            {
                this.pos.x = this.size.x;
            }
            
            // if this entity has fallen off the map
            if (this.pos.y > ig.game.collisionMap.pxHeight)
            {
                this.pos.y = 0;
            }
            */
        },
        
        // colliding with .checkAgainst objects
        check: function(other) {
            
            if (this.hurting || this.dying)
            {
                return;
            }
            
            //other.receiveDamage(1, this);
            
        },
        
        // called by attacking entity
        receiveDamage: function(amount, from) {
        
            if (this.hurting || this.dying)
            {
                return false;
            }
            
            // reduce health
            this.health -= amount;
            
            // apply knockback
            this.vel.x = (from.flip ? -140 : 140);
            this.vel.y = -300;
            
            // if dead
            if (this.health <= 0)
            {
                //this.vel = {x: 0, y: 0};
                //this.maxVel = {x: 0, y: 0};
                this.vel.x = (from.flip ? -210 : 210);
                this.dying = true;
                this.canExplode = true;
                this.explodeFlip = from.flip;
                return true;
            }
            
            // update state
            this.hurting = true;
            
            return true;
            
        },
        
    });
    
    ig.EntityPool.enableFor(EntitySquirrel);
});