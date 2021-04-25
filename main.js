var config;
var game;

class MainScene extends Phaser.Scene {

    constructor() {
        super();
        this.bulletGroup;
        this.player;
    }

    preload() {
        //load background image
        this.load.image('backgrnd', 'assets/sprites/background/mars_landscape.jpg');

        //load player image
        this.load.image('player', 'assets/sprites/player/player_ship.png');


        this.load.spritesheet('blueBullet', 'assets/sprites/bullets/blue_bullets/bullets.png', {
            frameWidth: 128,
            frameHeight: 35
        });

    }


    create() {

        //window size
        var windowWidth = window.innerWidth;
        var widnowHeight = window.innerHeight;

        //background sprite and size
        this.bg = this.add.image(windowWidth / 2, widnowHeight / 2, 'backgrnd');
        this.bg.setDisplaySize(windowWidth, widnowHeight);

        this.addPlayer(windowWidth, widnowHeight);

        this.bulletGroup = new BulletGroup(this);

        //Create player bullets animation
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers(
                'blueBullet', { start: 0, end: 2 }),
            frameRate: 9, repeat: -1
        });

        //enable window borders colliders
        this.physics.world.setBoundsCollision(true, true, true, true);
    }

    addPlayer(windowWidth, widnowHeight) {
        //player sprite and size
        this.player = this.physics.add.sprite(250, widnowHeight / 2, 'player');
        this.player.setDisplaySize(300, 150);

        //player move control
        this.cursors = this.input.keyboard.createCursorKeys();

        //player shoot control
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //player collision with window borders
        this.player.body.setCollideWorldBounds(true);
    }

    playerShoot(){
        this.bulletGroup.fire(this.player.x + 200, this.player.y);
    }

    update() {

        //player vertical velocity
        this.player.body.velocity.y = 0;

        if (this.cursors.up.isDown) {//arrow up is down - player move to top

            this.player.body.velocity.y = -400;

        } else if (this.cursors.down.isDown) {//arrow down is down - player move to bottom

            this.player.body.velocity.y = 400;

        }

        //player shoot
        if (Phaser.Input.Keyboard.JustDown(this.shoot)) {
            this.playerShoot();
        }
    }

}

class BulletGroup extends Phaser.Physics.Arcade.Group{

    constructor(scene){
        super(scene.physics.world, scene);

        this.createMultiple({
            classType : Bullet,
            frameQuantity : 30,
            active : false,
            visible : false,
            key : 'blueBullet'
        });
    }

    fire(x, y){
        const bullet = this.getFirstDead(false);
        if(bullet){
            bullet.fire(x, y);
        }
    }

}

class Bullet extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y){
        super(scene, x, y, 'blueBullet');
    }

    fire(x, y){
        this.body.reset(x, y); //Spawn point
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(1000); //Speed
        this.anims.play('fly', true); //Play animation
    }

    preUpdate(time, delta) { //Delete bullet behind window border
		super.preUpdate(time, delta);
 
		if (this.x >= window.innerWidth) {
			this.setActive(false);
			this.setVisible(false);
		}
	}

}

window.onload = function () {

    config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        physics: {
            default: 'arcade',
        },
        scene: MainScene
    };

    game = new Phaser.Game(config);
}



