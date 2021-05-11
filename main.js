let config;
let game;

class MainScene extends Phaser.Scene {

    constructor() {
        super();
        this.bulletGroup;
        this.blastGroup;
        this.enemyGroup;
        this.player;
        this.scoreText;
        this.score;

        this.hpBackgrnd;
        this.hpBar;

        this.energyBackgrnd;
        this.energyBar;

        this.easyEnemies = [];
    }

    preload() {

        //load background image
        this.load.image('backgrnd', 'assets/sprites/background/alien_landscape.jpg');

        //load player image
        this.load.image('player', 'assets/sprites/player/player_ship.png');

        //load blue bullets tiles
        this.load.spritesheet('blueBullet', 'assets/sprites/bullets/blue_bullets/bullets.png', {
            frameWidth: 128,
            frameHeight: 35
        });

        //load orange blasts tiles
        // this.load.spritesheet('orangeBlast', 'assets/sprites/bullets/orange_blast/orange_blasts.png', {
        //     frameWidth: 64,
        //     frameHeight: 32
        // });

        this.load.atlas("orangeBlast", "assets/sprites/bullets/orange_blast/orange_blasts.png", "assets/sprites/bullets/orange_blast/orange_blasts.json");

        //load hp bar background image
        this.load.image('hpBackgrnd', 'assets/sprites/gui/hp/Health_1.png');

        //load energy bar background image
        this.load.image('energyBackgrnd', 'assets/sprites/gui/energy/Energy_1.png');


        //load easy enemy images
        let enemy1 = this.load.image('easyEnemy1', 'assets/sprites/enemy/easy/Drone_4.png');
        let enemy2 = this.load.image('easyEnemy2', 'assets/sprites/enemy/easy/Drone_5.png');
        let enemy3 = this.load.image('easyEnemy3', 'assets/sprites/enemy/easy/Drone_9.png');
        this.easyEnemies.push('easyEnemy1');
        this.easyEnemies.push('easyEnemy2');
        this.easyEnemies.push('easyEnemy3');
    }


    create() {

        //window size
        var windowWidth = window.innerWidth;
        var widnowHeight = window.innerHeight;

        //background sprite and size
        this.bg = this.add.image(windowWidth / 2, widnowHeight / 2, 'backgrnd');
        this.bg.setDisplaySize(windowWidth, widnowHeight);

        this.bulletGroup = new BulletGroup(this);

        this.blastGroup = new BlastGroup(this);

        this.enemyGroup = new EnemyGroup(this);

        this.initializePlayer(widnowHeight);

        this.initializeHpBar(windowWidth);

        this.initializeEnergyBar();

        this.initializeEasyEnemies(widnowHeight, windowWidth);

        //Create player blue bullets animation
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers(
                'blueBullet', { start: 0, end: 2 }),
            frameRate: 9, repeat: -1
        });


        //Create player orange blast animation animation
        this.anims.create({
            key: 'blastFly',
            frames: this.anims.generateFrameNames('orangeBlast', {
                start: 0,
                end: 5,
                zeroPad: 3,
                prefix: 'OrangeBlast__',
                suffix: '.png'
            }),
            frameRate: 8,
            repeat: -1
        });

    
        //enable window borders colliders
        this.physics.world.setBoundsCollision(true, true, true, true);


        this.score = 0;

        //Create score text
        this.scoreText = this.add.text(windowWidth / 2 - 128, 32, 'Score: 0', { fontSize: '32px', fill: '#FFF', fontFamily: '"Goblin One", cursive' });

        this.initializeLoopEvents();

    }

    initializePlayer(widnowHeight) {

        this.player = new Player(this, 250, widnowHeight / 2);
        this.player.spawn(250, widnowHeight / 2);

        //player move control
        this.cursors = this.input.keyboard.createCursorKeys();

        //player shoot control
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //player super shoot control
        this.superShoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    }

    initializeEasyEnemies(widnowHeight, windowWidthd){

        this.enemyGroup.spawn(800, 500);

    }

    spawnEasyEnemy(){
        this.enemyGroup.spawn(1600, 500);
    }

    initializeHpBar(windowWidth) {
        //hp bar background sprite and size
        this.hpBackgrnd = this.add.image(windowWidth - 256, 50, 'hpBackgrnd');
        this.hpBackgrnd.setDisplaySize(256, 64);

        //hp bar graphics and size
        this.hpBar = this.add.graphics();
        this.hpBar.fillStyle('0xe139e9', 1);
        this.hpBar.fillRect(0, 0, 170, 30);
        this.hpBar.x = windowWidth - 310;
        this.hpBar.y = 35;

        this.actualizeHpBar();

    }

    actualizeHpBar() {
        this.hpBar.scaleX = this.player.hp / 100;
    }

    initializeEnergyBar() {
        //energy bar background sprite and size
        this.energyBackgrnd = this.add.image(256, 50, 'energyBackgrnd');
        this.energyBackgrnd.setDisplaySize(256, 64);

        //energy bar graphics and size
        this.energyBar = this.add.graphics();
        this.energyBar.fillStyle('0x80d9ff', 1);
        this.energyBar.fillRect(0, 0, 170, 30);
        this.energyBar.x = 200;
        this.energyBar.y = 35;

        this.actualizeEnergyBar();
    }

    actualizeEnergyBar() {
        this.energyBar.scaleX = this.player.energy / 100;
    }

    initializeLoopEvents() {
        //Loop calling increase score function
        this.time.addEvent({ delay: 100, callback: this.increaseScore, callbackScope: this, loop: true });

        //Loop calling increase player energy accumulate function
        this.time.addEvent({ delay: 1000, callback: this.player.accumulateEnergy, callbackScope: this.player, loop: true });

        this.time.addEvent({ delay: 2000, callback: this.spawnEasyEnemy, callbackScope: this, loop: true });
    }

    update() {

        //player vertical velocity
        this.player.stop();

        if (this.cursors.up.isDown) {//arrow up is down - player move to top

            this.player.moveUp();

        } else if (this.cursors.down.isDown) {//arrow down is down - player move to bottom

            this.player.moveDown();
        }

        //player shoot
        if (Phaser.Input.Keyboard.JustDown(this.shoot)) {
            this.player.shoot(this.bulletGroup);
        }

        //player super shoot
        if (Phaser.Input.Keyboard.JustDown(this.superShoot)) {
            this.player.superShoot(this.blastGroup);
        }
    }

    //Function for loop increase score
    increaseScore() {
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
    }


}

class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'player');

        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        this.hp;
        this.energy;
    }

    spawn(x, y) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.body.setCollideWorldBounds(true); //collision with borders
        this.setDisplaySize(200, 100);

        this.hp = 100;
        this.energy = 0;
    }

    moveUp() {
        if (this.y < 170)
            return;
        this.body.velocity.y = -400;
    }

    moveDown() {
        this.body.velocity.y = 400;
    }

    stop() {
        this.body.velocity.y = 0;
    }

    shoot(bulletGroup) {
        bulletGroup.fire(this.x + 100, this.y);
    }

    superShoot(blastGroup) {
        if (this.energy == 100) {
            blastGroup.fire(this.x + 50, this.y);
            this.energy = 0;
            this.scene.actualizeEnergyBar();
        }
        
    }

    accumulateEnergy() {
        if (this.energy >= 100) {
            this.energy = 100;
            return;
        }
        this.energy += 5;
        this.scene.actualizeEnergyBar();
    }

}

class EnemyGroup extends Phaser.Physics.Arcade.Group {

    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Enemy,
            frameQuantity: 10,
            active: false,
            visible: false,
            key: 'easyEnemy'
        });
       
    }

    spawn(x, y) {
        const enemy = Phaser.Utils.Array.GetRandom(Phaser.Utils.Array.GetAll(this.getChildren(), 'active', false));
        if (enemy) {
            enemy.spawn(x, y);
        }
    }

}

class Enemy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, Phaser.Utils.Array.GetRandom(scene.easyEnemies));
    }

    spawn(x, y) {
        this.body.reset(x, y); //Spawn point
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(-400); //Speed
        this.setDisplaySize(50,100);
        this.scaleX = -1;
    }

    preUpdate(time, delta) { //Delete bullet behind window border
        super.preUpdate(time, delta);

        if (this.x <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }

}

class BulletGroup extends Phaser.Physics.Arcade.Group {

    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Bullet,
            frameQuantity: 30,
            active: false,
            visible: false,
            key: 'blueBullet'
        });
    }

    fire(x, y) {
        const bullet = this.getFirstDead(false);
        if (bullet) {
            bullet.fire(x, y);
        }
    }

}

class Bullet extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'blueBullet');
    }

    fire(x, y) {
        this.body.reset(x, y); //Spawn point
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(1000); //Speed
        this.anims.play('fly', true); //Play animation
        this.setDisplaySize(60, 20);
    }

    preUpdate(time, delta) { //Delete bullet behind window border
        super.preUpdate(time, delta);

        if (this.x >= window.innerWidth) {
            this.setActive(false);
            this.setVisible(false);
        }
    }

}

class BlastGroup extends Phaser.Physics.Arcade.Group {

    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Blast,
            frameQuantity: 30,
            active: false,
            visible: false,
            key: 'orangeBlast'
        });
    }

    fire(x, y) {
        const blast = this.getFirstDead(false);
        if (blast) {
            blast.fire(x, y);
        }
    }

}

class Blast extends Phaser.Physics.Arcade.Sprite{

constructor(scene, x, y){
    super(scene, x, y, 'orangeBlast');
}

fire(x, y) {
    this.body.reset(x, y); //Spawn point
    this.setActive(true);
    this.setVisible(true);
    this.setVelocityX(500); //Speed
    this.anims.play('blastFly', true); //Play animation
    this.setDisplaySize(100, 50);
    this.scaleX = -1;
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



