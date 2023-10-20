class Play extends Phaser.Scene {
    constructor() {
        super ("playScene");
    }
    preload(){
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png'); //key name and the location of the image
        this.load.image('starfield', './assets/starfield.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        //###为什么别的都没用pixel这个用了，是因为frame的问题吗？
    }
    create(){
        // green UI background
        this.starfield = this.add.tileSprite(0,0, 640, 480, 'starfield').setOrigin(0, 0);
        //tells us the x-position, y =position, width height,and akey string that tells us whcih image to use
        //and have to put this infront of the ui thing because it read from lowest to highest 
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5,0);
        //##### whats this passing here ask professor tmr.
        //##### confused about whats x and y coordinate how do i set where they are and let the game know
        //##### and it should be scene, x,y , texture = rocket , but the frame im really confused 
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        //the frame number (we only have one frame in our sprite, so we pass 0, meaning the first frame),
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        //setOrigin() method to make sure the origin is on the upper left of the sprite, so our screen-wrapping code from Spaceship.js will work.
        this.anims.create({
            key: 'explode',
            //variable name is explode.
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            //So this code is using the global animation manager to create a new animation and bind it
            //to the scene (via this).
            frameRate: 30 //帧数？
        });
        this.p1Score = 0 ;
          // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        // 60-second play clock
        this.gameOver = false;
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {// delayed call 
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this); // whats null this do here ?
    }
 
    
    update() {
        // update run every frame . -4 = will move 4 horizontal pixels left every frame 
        // to right = -  to left = +
        //One advantage of using a separate class to handle our 
        //player rocket is that we can keep class-specific code within the class itself.
        // As we’ve already seen, Phaser runs a core update() loop that allows all game movements, animations,
          if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start("menuScene");
         }
        this.starfield.tilePositionX -= 4;
        //this.p1Rocket.update();
        //this.ship01.update();               // update spaceships (x3)
        //this.ship02.update();
        //this.ship03.update();
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
          }
          if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
          }
          if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
          }
          if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        } 
    }
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
          rocket.x + rocket.width > ship.x && 
          rocket.y < ship.y + ship.height &&
          rocket.height + rocket.y > ship. y) {
          return true;
        } else {
          return false;
        }
        //##所以这个不是很需要记？
        //##会用就行？
      }
      shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        //###why putting the ship alpha = 0 will make it invisiable ?  
        // create explosion sprite at ship's position
        //###set origion is like putting the upper left of the sprit ?
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });       
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;  
        this.sound.play('sfx_explosion');
      }
      
}