let config;
let game;

class MainScene extends Phaser.Scene {

    constructor() {
        super();

        this.enemyGroup;
        this.easyEnemyGroup;
        this.normalEnemyGroup;
        this.hardEnemyGroup;



        this.spawnEnemyEvent;

        this.gameLevel;

        this.levelText;

        this.bulletGroup;
        this.enemyBulletGroup;
        this.blastGroup;

        this.bonusGroup;
        this.player;
        this.scoreText;
        this.score;

        this.superShootText;

        this.hpBackgrnd;
        this.hpBar;

        this.energyBackgrnd;
        this.energyBar;

        this.shieldBackgrnd;
        this.shieldBar;

        this.easyEnemies = [];
        this.normalEnemies = [];
        this.hardEnemies = [];

        this.spawnPoints = [];

        this.bonuses = [];

        this.asteroidGroup;
        this.asteroid;
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

        // this.load.spritesheet('asteroid', 'assets/sprites/asteroid/asteroid_spriteSheet.png', {
        //     frameWidth: 512,
        //     frameHeight: 512
        // });

        //load orange blasts tiles
        // this.load.spritesheet('orangeBlast', 'assets/sprites/bullets/orange_blast/orange_blasts.png', {
        //     frameWidth: 64,
        //     frameHeight: 32
        // });

        this.load.atlas("orangeBullet", "assets/sprites/bullets/orange_bullets/orange_bullet.png", "assets/sprites/bullets/orange_bullets/orange_bullet.json");

        this.load.atlas("orangeBlast", "assets/sprites/bullets/orange_blast/orange_blasts.png", "assets/sprites/bullets/orange_blast/orange_blasts.json");

        this.load.atlas("blueBulletExplo", "assets/sprites/bullets/blue_bullets/explo/blue_explo.png", "assets/sprites/bullets/blue_bullets/explo/blue_explo.json");

        this.load.atlas("orangeBlastExplo", "assets/sprites/bullets/orange_blast/explo/blast_explo.png", "assets/sprites/bullets/orange_blast/explo/blast_explo.json");

        this.load.atlas("orangeBulletExplo", "assets/sprites/bullets/orange_bullets/explo/orange_bullet_explo.png", "assets/sprites/bullets/orange_bullets/explo/orange_bullet_explo.json");

        //load hp bar background image
        this.load.image('hpBackgrnd', 'assets/sprites/gui/hp/Health_1.png');

        //load energy bar background image
        this.load.image('energyBackgrnd', 'assets/sprites/gui/energy/Energy_1.png');

        //load shield bar background image
        this.load.image('shieldBackgrnd', 'assets/sprites/gui/shield/Shield.png');

        //load easy enemy images
        this.load.image('easyEnemy1', 'assets/sprites/enemy/easy/Drone_4.png');
        this.load.image('easyEnemy2', 'assets/sprites/enemy/easy/Drone_5.png');
        this.load.image('easyEnemy3', 'assets/sprites/enemy/easy/Drone_9.png');
        this.easyEnemies.push('easyEnemy1');
        this.easyEnemies.push('easyEnemy2');
        this.easyEnemies.push('easyEnemy3');

        //load normal enemies images
        this.load.image('normalEnemy1', 'assets/sprites/enemy/normal/Ship_1.png');
        this.load.image('normalEnemy2', 'assets/sprites/enemy/normal/Ship_2.png');
        this.load.image('normalEnemy3', 'assets/sprites/enemy/normal/Ship_3.png');
        this.normalEnemies.push('normalEnemy1');
        this.normalEnemies.push('normalEnemy2');
        this.normalEnemies.push('normalEnemy3');

        //load hard enemies images
        this.load.image('hardEnemy1', 'assets/sprites/enemy/hard/Ship_1.png');
        this.load.image('hardEnemy2', 'assets/sprites/enemy/hard/Ship_2.png');
        this.load.image('hardEnemy3', 'assets/sprites/enemy/hard/Ship_3.png');
        this.hardEnemies.push('hardEnemy1');
        this.hardEnemies.push('hardEnemy2');
        this.hardEnemies.push('hardEnemy3');

        //load bonuses images
        this.load.image('hpBonus', 'assets/sprites/bonuses/Item_1.png');
        this.load.image('shieldBonus', 'assets/sprites/bonuses/Item_2.png');
        this.load.image('energyBonus', 'assets/sprites/bonuses/Item_3.png');
        this.bonuses.push('hpBonus');
        this.bonuses.push('shieldBonus');
        this.bonuses.push('energyBonus');

    }


    create() {

        //window size
        var windowWidth = window.innerWidth;
        var widnowHeight = window.innerHeight;

        //background sprite and size
        this.bg = this.add.image(windowWidth / 2, widnowHeight / 2, 'backgrnd');
        this.bg.setDisplaySize(windowWidth, widnowHeight);

        // this.asteroid = this.add.sprite(0,0,'asteroid');
        // this.asteroid.frame = 0;

        this.bulletGroup = new BulletGroup(this, BlueBullet, 'blueBullet');
        this.enemyBulletGroup = new BulletGroup(this, OrangeBullet, 'orangeBullet');

        this.blastGroup = new BlastGroup(this);

        this.enemyGroup = new EasyEnemyGroup(this);

        this.bonusGroup = new BonusGroup(this);

        // this.asteroidGroup = new AsteroidGroup(this);

        this.initializePlayer(widnowHeight);

        this.initializeHpBar(windowWidth);

        this.initializeEnergyBar(windowWidth);

        this.initializeShieldBar(windowWidth);

        this.initializeSpawnPoints();


        this.initializeColliders();



        //Create player blue bullets animation
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers(
                'blueBullet', { start: 0, end: 2 }),
            frameRate: 9, repeat: -1
        });


        //Create player orange blast animation
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

        //Create blue bullets explosion animation
        this.anims.create({
            key: 'blueExplo',
            frames: this.anims.generateFrameNames('blueBulletExplo', {
                start: 0,
                end: 6,
                zeroPad: 1,
                prefix: 'BlueBulletExplo_',
                suffix: '.png'
            }),
            frameRate: 30,
            repeat: 0
        });

        this.anims.create({
            key: 'blastExplo',
            frames: this.anims.generateFrameNames('orangeBlastExplo', {
                start: 0,
                end: 11,
                zeroPad: 3,
                prefix: 'Explo__',
                suffix: '.png'
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: 'orangeBulletFly',
            frames: this.anims.generateFrameNames('orangeBullet', {
                start: 0,
                end: 5,
                zeroPad: 3,
                prefix: 'OrangeTail__',
                suffix: '.png'
            }),
            frameRate: 10,
            repeat: 0
        });

        //Create orange bullets explosion animation
        this.anims.create({
            key: 'orangeExplo',
            frames: this.anims.generateFrameNames('orangeBulletExplo', {
                start: 0,
                end: 6,
                zeroPad: 1,
                prefix: 'OrangeBulletExplo_',
                suffix: '.png'
            }),
            frameRate: 30,
            repeat: 0
        });

        // this.anims.create({
        //     key: 'asteroidDestroy',
        //     frames: this.anims.generateFrameNumbers(
        //         'asteroid', { start: 0, end: 5 }),
        //     frameRate: 15, repeat: 0
        // });

        //enable window borders colliders
        this.physics.world.setBoundsCollision(true, true, true, true);


        this.score = 0;

        //Create score text
        this.scoreText = this.add.text(windowWidth / 2 - 128, 32, 'Score: 0', { fontSize: '32px', fill: '#FFF', fontFamily: '"Goblin One", cursive' });

        //Create super shoot prompt text
        this.superShootText = this.add.text(windowWidth / 2 - 400, 128, '', { fontSize: '32px', fill: '#e63410', fontFamily: '"Goblin One", cursive' });

        //Crate level difficulty text
        this.levelText = this.add.text(800, 256, '', { fontSize: '64px', fill: '#e63410', fontFamily: '"Goblin One", cursive' });
        this.levelText.setOrigin(0.5);

        this.initializeLoopEvents();

        this.spawnEnemy();

    }

    initializeColliders() {
        this.physics.add.overlap(this.bulletGroup, this.enemyGroup, this.blueBulletPlayerHit, null, this);
        this.physics.add.overlap(this.blastGroup, this.enemyGroup, this.orangeBlastPlayerHit, null, this);
        this.physics.add.overlap(this.player, this.bonusGroup, this.playerBonusHit, null, this);
        this.physics.add.overlap(this.player, this.enemyGroup, this.playerEnemyHit, null, this);
        this.physics.add.overlap(this.player, this.enemyBulletGroup, this.playerEnemyBulletHit, null, this);
    }

    blueBulletPlayerHit(bullet, enemy) {
        if (bullet.enable && enemy.enable) {
            enemy.receiveDamage(10);
            bullet.explo();
        }
    }

    orangeBlastPlayerHit(blast, enemy) {
        if (blast.enable) {
            enemy.receiveDamage(40);
            blast.explo();
        }
    }

    playerBonusHit(player, bonus) {
        player.receiveBonus(bonus.texture.key);
        bonus.destroy();
    }

    playerEnemyHit(player, enemy) {
        if (enemy.enable) {
            player.receiveDamage(enemy.collisionDamage);
            enemy.playerCollision();
        }
    }

    playerEnemyBulletHit(player, bullet) {
        if (bullet.enable) {
            player.receiveDamage(bullet.damage);
            bullet.explo();
        }
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

    spawnEnemy() {

        switch (this.gameLevel) {

            case undefined:
                this.spawnEnemyEvent = this.time.addEvent({ delay: 1200, callback: this.spawnEnemy, callbackScope: this, loop: true });
                this.gameLevel = 'easy';
                break;

            case 'easy':
                if (this.score >= 500) {
                    this.spawnEnemyEvent.remove(false);
                    this.gameLevel = 'normal';
                    this.enemyGroup = new NormalEnemyGroup(this);
                    this.levelText.setText('NORMAL LEVEL');
                    this.initializeColliders();
                    this.spawnEnemyEvent = this.time.addEvent({ delay: 1700, callback: this.spawnEnemy, callbackScope: this, loop: true });
                    return;
                }
                break;

            case 'normal':
                if (this.score >= 1000) {
                    this.spawnEnemyEvent.remove(false);
                    this.gameLevel = 'hard';
                    this.enemyGroup = new HardEnemyGroup(this);
                    this.levelText.setText('HARD LEVEL');
                    this.initializeColliders();
                    this.spawnEnemyEvent = this.time.addEvent({ delay: 2200, callback: this.spawnEnemy, callbackScope: this, loop: true });
                    return;
                }
                break;

        }

        if (this.levelText !== '') {
            this.levelText.setText('');
        }

        let spawnPoint = Phaser.Utils.Array.GetRandom(this.spawnPoints);
        this.enemyGroup.spawn(spawnPoint.x, spawnPoint.y);
    }

    initializeHpBar(windowWidth) {
        //hp bar background sprite and size
        this.hpBackgrnd = this.add.image(200, 50, 'hpBackgrnd');
        this.hpBackgrnd.setDisplaySize(256, 64);

        //hp bar graphics and size
        this.hpBar = this.add.graphics();
        this.hpBar.fillStyle('0xe139e9', 1);
        this.hpBar.fillRect(0, 0, 170, 30);
        this.hpBar.x = 145;
        this.hpBar.y = 35;

        this.actualizeHpBar();

    }

    actualizeHpBar() {
        this.hpBar.scaleX = this.player.hp / 100;
    }

    initializeEnergyBar(windowWidth) {
        //energy bar background sprite and size
        this.energyBackgrnd = this.add.image(windowWidth - 256, 50, 'energyBackgrnd');
        this.energyBackgrnd.setDisplaySize(256, 64);

        //energy bar graphics and size
        this.energyBar = this.add.graphics();
        this.energyBar.fillStyle('0x80d9ff', 1);
        this.energyBar.fillRect(0, 0, 170, 30);
        this.energyBar.x = windowWidth - 310;
        this.energyBar.y = 35;

        this.actualizeEnergyBar();
    }

    actualizeEnergyBar() {
        this.energyBar.scaleX = this.player.energy / 100;
    }

    initializeShieldBar(windowWidth) {
        //shield bar background sprite and size
        this.shieldBackgrnd = this.add.image(480, 50, 'shieldBackgrnd');
        this.shieldBackgrnd.setDisplaySize(256, 64);

        //shield bar graphics and size
        this.shieldBar = this.add.graphics();
        this.shieldBar.fillStyle('0xe6e6e6', 1);
        this.shieldBar.fillRect(0, 0, 170, 30);
        this.shieldBar.x = 425;
        this.shieldBar.y = 35;

        this.actualizeShieldBar();
    }

    actualizeShieldBar() {
        this.shieldBar.scaleX = this.player.shield / 100;
    }

    initializeSpawnPoints() {

        let spawnPoint1 = {};
        spawnPoint1.x = 1800;
        spawnPoint1.y = 200;
        this.spawnPoints.push(spawnPoint1);

        let spawnPoint2 = {};
        spawnPoint2.x = 1800;
        spawnPoint2.y = 300;
        this.spawnPoints.push(spawnPoint2);

        let spawnPoint3 = {};
        spawnPoint3.x = 1800;
        spawnPoint3.y = 400;
        this.spawnPoints.push(spawnPoint3);

        let spawnPoint4 = {};
        spawnPoint4.x = 1800;
        spawnPoint4.y = 500;
        this.spawnPoints.push(spawnPoint4);

        let spawnPoint5 = {};
        spawnPoint5.x = 1800;
        spawnPoint5.y = 600;
        this.spawnPoints.push(spawnPoint5);

    }

    initializeLoopEvents() {
        //Loop calling increase score function
        this.time.addEvent({ delay: 100, callback: this.increaseScore, callbackScope: this, loop: true });

        //Loop calling increase player energy accumulate function
        this.time.addEvent({ delay: 1000, callback: this.player.accumulateEnergy, callbackScope: this.player, loop: true });

        // //Loop calling asteroid spawn
        // this.time.addEvent({ delay: 1500, callback: this.spawnAsteroid, callbackScope: this, loop: true });
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

    // spawnAsteroid(){
    //     this.asteroidGroup.spawn(1500, 500);
    // }

    //Function for loop increase score
    increaseScore() {
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
    }

    showSuperShootPrompt() {
        this.superShootText.setText('press ENTER for SUPER SHOOT!');
    }

    hideSuperShootPrompt() {
        this.superShootText.setText('');
    }
}

class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'player');

        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        this.hp;
        this.energy;
        this.shield;
    }

    spawn(x, y) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.body.setCollideWorldBounds(true); //collision with borders
        this.setDisplaySize(200, 100);

        this.hp = 100;
        this.shield = 100;
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
        if (this.energy >= 100) {
            blastGroup.fire(this.x + 50, this.y);
            this.energy = 0;
            this.scene.actualizeEnergyBar();
            this.scene.hideSuperShootPrompt();
        }
    }

    accumulateEnergy() {
        this.energy += 5;
        if (this.energy >= 100) {
            this.scene.showSuperShootPrompt();
            this.energy = 100;
        }
        this.scene.actualizeEnergyBar();
    }

    receiveHp(value) {
        this.hp += value;
        if (this.hp >= 100) {
            this.hp = 100;
        }
        this.scene.actualizeHpBar();
    }

    receiveEnergy(value) {
        this.energy += value;
        if (this.energy >= 100) {
            this.energy = 100;
        }
        this.scene.actualizeEnergyBar();
    }

    receiveShield(value) {
        this.shield += value;
        if (this.shield >= 100) {
            this.shield = 100;
        }
        this.scene.actualizeShieldBar();
    }

    receiveBonus(bonusKey) {

        switch (bonusKey) {

            case "hpBonus":
                this.receiveHp(15);
                break;

            case "energyBonus":
                this.receiveEnergy(10);
                break;

            case "shieldBonus":
                this.receiveShield(5);
                break;

        }

    }

    receiveDamage(value) {

        this.shield -= value;

        if (this.shield < 0) {
            this.hp += this.shield;
            this.shield = 0;
        }

        if (this.hp <= 0) {

            this.hp = 0;
            this.scene.actualizeHpBar();
            this.scene.actualizeShieldBar();
            this.destroy();
        }
        this.scene.actualizeHpBar();
        this.scene.actualizeShieldBar();
    }

    destroy() {

    }

}

class EnemyGroup extends Phaser.Physics.Arcade.Group {

    constructor(scene, type, key) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: type,
            frameQuantity: 10,
            active: false,
            visible: false,
            key: key
        });

    }

    spawn(x, y) {
        const enemy = Phaser.Utils.Array.GetRandom(Phaser.Utils.Array.GetAll(this.getChildren(), 'active', false));
        if (enemy) {
            enemy.spawn(x, y);
        }
    }

}

class EasyEnemyGroup extends EnemyGroup {

    constructor(scene) {
        super(scene, EasyEnemy, 'easyEnemy');
    }

}

class NormalEnemyGroup extends EnemyGroup {

    constructor(scene) {
        super(scene, NormalEnemy, 'normalEnemy');
    }

}

class HardEnemyGroup extends EnemyGroup {

    constructor(scene) {
        super(scene, HardEnemy, 'hardEnemy');
    }

}

class Enemy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, enemies) {
        super(scene, x, y, Phaser.Utils.Array.GetRandom(enemies));
        this.hp;
        this.speed;
        this.widthX;
        this.heightY;
        this.enable;
        this.collisionDamage;
        this.score;
        this.ownTexture = this.texture.key;
        this.shootSpeed;
        this.damage;
        this.shootEvent;
    }

    spawn(x, y) {
        if (this.shootEvent !== undefined)
            this.shootEvent.remove(false);
        this.anims.remove('blastExplo');
        this.setTexture(this.ownTexture);
        this.body.reset(x, y); //Spawn point
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(this.speed); //Speed
        this.setDisplaySize(this.widthX, this.heightY);
        this.flipX = true;
        this.enable = true;
        this.shootEvent = this.scene.time.addEvent({ delay: this.shootSpeed, callback: this.shoot, callbackScope: this, loop: true });
    }

    shoot() {
        this.scene.enemyBulletGroup.fire(this.x - 200, this.y, this.damage);
    }

    receiveDamage(value) {

        this.hp -= value;
        if (this.hp <= 0) {
            this.shootEvent.remove(false);
            this.scene.score += this.score;
            let randomValue = Math.floor(Math.random() * 10);
            if (randomValue > 4)
                this.scene.bonusGroup.spawn(this.x, this.y);
            this.showDestroyAnim();
        }
    }

    showDestroyAnim() {
        this.enable = false;
        this.setVelocityX(0);
        this.anims.play('blastExplo', false); //Play animation
        this.scene.time.addEvent({ delay: 500, callback: this.destroy, callbackScope: this, loop: false });
    }

    playerCollision() {
        this.showDestroyAnim();
    }

    destroy() {
        this.setActive(false);
        this.setVisible(false);
        this.body.reset(0, 0);
    }

    preUpdate(time, delta) { //Delete bullet behind window border
        super.preUpdate(time, delta);

        if (this.x <= 0) {
            this.setActive(false);
            this.setVisible(false);
            this.body.reset(0, 0);
        }
    }

}

class EasyEnemy extends Enemy {

    constructor(scene, x, y) {
        super(scene, x, y, scene.easyEnemies);
    }

    spawn(x, y) {
        this.hp = 30;
        this.speed = -400;
        this.widthX = 200;
        this.heightY = 100;
        this.collisionDamage = 50;
        this.score = 20;
        this.shootSpeed = 700;
        this.damage = 5;
        super.spawn(x, y);
    }
}

class NormalEnemy extends Enemy {

    constructor(scene, x, y) {
        super(scene, x, y, scene.normalEnemies);
    }

    spawn(x, y) {
        this.hp = 60;
        this.speed = -250;
        this.widthX = 300;
        this.heightY = 150;
        this.collisionDamage = 100;
        this.score = 60;
        this.shootSpeed = 800;
        this.damage = 10;
        super.spawn(x, y);
    }
}

class HardEnemy extends Enemy {

    constructor(scene, x, y) {
        super(scene, x, y, scene.hardEnemies);
    }

    spawn(x, y) {
        this.hp = 100;
        this.speed = -190;
        this.widthX = 400;
        this.heightY = 200;
        this.collisionDamage = 150;
        this.score = 100;
        this.shootSpeed = 900;
        this.damage = 15;
        super.spawn(x, y);
    }
}


class BulletGroup extends Phaser.Physics.Arcade.Group {

    constructor(scene, type, key) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: type,
            frameQuantity: 150,
            active: false,
            visible: false,
            key: key
        });
    }

    fire(x, y, damage = 10) {
        const bullet = this.getFirstDead(false);
        if (bullet) {
            bullet.fire(x, y, damage);
        }
    }

}

class Bullet extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);

        this.enable;
        this.speed;
        this.widthX;
        this.heightY;
        this.border;
        this.exploEvent;
        this.damage;
    }

    fire(x, y, anim, damage) {
        if (this.exploEvent !== undefined)
            this.exploEvent.remove(false);
        this.enable = true;
        this.body.reset(x, y); //Spawn point
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(this.speed); //Speed
        this.anims.play(anim, true); //Play animation
        this.setDisplaySize(this.widthX, this.heightY);
        this.damage = damage;
    }

    explo(anim) {
        if (this.exploEvent !== undefined)
            this.exploEvent.remove(false);
        this.setVelocityX(0);
        this.enable = false;
        this.anims.play(anim, true); //Play animation
        this.exploEvent = this.scene.time.addEvent({ delay: 200, callback: this.destroy, callbackScope: this, loop: false });

    }

    destroy() {
        this.setActive(false);
        this.setVisible(false);
        this.setX(0);
        this.setY(0);
    }

}

class BlueBullet extends Bullet {

    constructor(scene, x, y) {
        super(scene, x, y, 'blueBullet');
    }

    fire(x, y, damage) {
        this.speed = 1000;
        this.widthX = 60;
        this.heightY = 20;
        super.fire(x, y, 'fly', damage);
    }

    explo() {
        super.explo('blueExplo');
    }

    preUpdate(time, delta) { //Delete bullet behind window border
        super.preUpdate(time, delta);

        if (this.x >= this.scene.windowWidth) {
            this.setActive(false);
            this.setVisible(false);

        }
    }
}


class OrangeBullet extends Bullet {

    constructor(scene, x, y) {
        super(scene, x, y, 'orangeBullet');
    }

    fire(x, y, damage) {
        this.speed = -1000;
        this.widthX = 60;
        this.heightY = 20;
        this.flipX = true;
        super.fire(x, y, 'orangeBulletFly', damage);
    }

    explo(){
        super.explo('orangeExplo');
    }

    preUpdate(time, delta) { //Delete bullet behind window border
        super.preUpdate(time, delta);

        if (this.x <= 0) {
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
            frameQuantity: 15,
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

class Blast extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'orangeBlast');
        this.enable;
        this.exploEvent;
    }

    fire(x, y) {

        if (this.exploEvent !== undefined)
            this.exploEvent.remove(false);

        this.enable = true;

        this.body.reset(x, y); //Spawn point
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(500); //Speed
        this.anims.play('blastFly', true); //Play animation
        this.setDisplaySize(100, 50);
        this.flipX = true;
    }

    explo() {
        if (this.exploEvent !== undefined)
            this.exploEvent.remove(false);
        this.setDisplaySize(70, 70);
        this.setVelocityX(0);
        this.enable = false;
        this.anims.play('blastExplo', true); //Play animation
        this.exploEvent = this.scene.time.addEvent({ delay: 500, callback: this.destroy, callbackScope: this, loop: false });
    }

    destroy() {
        this.setActive(false);
        this.setVisible(false);
        this.setX(0);
        this.setY(0);
    }

    preUpdate(time, delta) { //Delete bullet behind window border
        super.preUpdate(time, delta);

        if (this.x >= window.innerWidth) {
            this.setActive(false);
            this.setVisible(false);
            this.body.reset(0, 0);
        }
    }

}

class BonusGroup extends Phaser.Physics.Arcade.Group {

    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Bonus,
            frameQuantity: 10,
            active: false,
            visible: false,
            key: 'bonuses'
        });

    }

    spawn(x, y) {
        const bonus = Phaser.Utils.Array.GetRandom(Phaser.Utils.Array.GetAll(this.getChildren(), 'active', false));
        if (bonus) {
            bonus.spawn(x, y);
        }
    }

}

class Bonus extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, Phaser.Utils.Array.GetRandom(scene.bonuses));
    }

    spawn(x, y) {

        this.body.reset(x, y); //Spawn point
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(-400); //Speed
        this.setDisplaySize(75, 75);
    }

    destroy() {
        this.setActive(false);
        this.setVisible(false);
        this.body.reset(0, 0);
    }

    preUpdate(time, delta) { //Delete bullet behind window border
        super.preUpdate(time, delta);

        if (this.x <= 0) {
            this.destroy();
        }
    }

}


// class AsteroidGroup extends Phaser.Physics.Arcade.Group {

//     constructor(scene) {
//         super(scene.physics.world, scene);

//         this.createMultiple({
//             classType: Asteroid,
//             frameQuantity: 10,
//             active: false,
//             visible: false,
//             key: 'asteroids'
//         });

//     }

//     spawn(x, y) {
//         const asteroid = this.getFirstDead(false);
//         if (asteroid) {
//             asteroid.spawn(x, y);
//         }
//     }

// }

// class Asteroid extends Phaser.Physics.Arcade.Sprite {

//     constructor(scene, x, y) {
//         super(scene, x, y, 'asteroid');
//     }

//     spawn(x, y) {

//         this.body.reset(x, y); //Spawn point
//         this.setActive(true);
//         this.setVisible(true);
//         this.setVelocityX(-400); //Speed
//         this.setDisplaySize(150, 150);
//     }

//     destroy(){
//         this.setActive(false);
//         this.setVisible(false);
//         this.body.reset(0, 0);
//     }

//     preUpdate(time, delta) { //Delete bullet behind window border
//         super.preUpdate(time, delta);

//         if(this.x <= 500){
//             this.anims.play('asteroidDestroy');
//         }

//         if (this.x <= 0) {
//             this.destroy();
//         }
//     }

// }

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



