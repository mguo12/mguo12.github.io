export default class Duck extends Phaser.Scene {
    constructor() {
        super({ key: "Duck" });
        this.GameWidth = 0;
        this.GameWidth = 0;
        this.GameLevel = 0;
        this.LevelText = null;
        this.timer = null;
        this.isWin = false;
        this.duckSprite = null;
        this.bullets = null;
        this.enemyDucks = null;
        this.score = 0;
        this.scoreText = null;
        this.graphics = null;
        this.curves = [];
        this.points = [];

    }

    preload() {
        this.GameWidth = document.getElementById('game').offsetWidth;
  
        this.GameHeight = document.getElementById('game').offsetHeight;
    
        this.GameLevel = 0;
    
        this.MaxGameLevel = 25

        this.load.setPath("./assets/");
        this.load.image("playerDuck", "duck_outline_yellow.png");
        this.load.image("enemyDuck1", "duck_outline_white.png");
        this.load.image("enemyDuck2", "duck_outline_brown.png");
        this.load.image("enemyDuck3", "duck_back.png");
        this.load.image("enemyDuck4", "duck_brown.png");
        this.load.image("enemyDuck5", "duck_white.png");
        this.load.image("backgroundBlue", "bg_blue.png");
        this.load.image("playerBullet", "icon_bullet_gold_short.png");
        this.load.image("enemyDuckBullet1", "shot_blue_small.png");
        this.load.image("enemyDuckBullet2", "shot_grey_small.png");
        this.load.image("enemyDuckBullet3", "shot_yellow_small.png");
        this.load.image("enemyDuckBullet4", "shot_brown_small.png");
        this.load.image("enemyDuckBullet5", "shot_yellow_large.png");
        this.load.image("playerHeart", "icon_duck.png");
        this.load.image("gameover", "text_gameover.png");
        this.load.image("win", "win.png");
        this.load.image("go", "text_go.png");
        this.load.image("ready", "text_ready.png")
        this.load.image("upgrade", "upgrade.jpg");

        this.load.audio("shotSound", "back_004.ogg");
        this.load.audio("hitSound", "confirmation_004.ogg");
        this.load.audio("getHitSound", "minimize_007.ogg");
        this.load.audio("gameoverSound", "toggle_003.ogg");
    }

    create() {

        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff } });
        // create background
        this.createBackground();

        // upgrade level
        this.upgrade = this.add.image(this.GameWidth / 2 - 128, this.GameHeight / 3 - 128, "upgrade").setOrigin(0, 0);
        this.upgrade.setVisible(false);
        // create bullet
        this.createBullets();

        // create enemy
        this.createEnemies();

        // create player duck
        this.createPlayer();

        // reset scores
        this.scoreText = this.add.text(this.sys.game.config.width - 16, 16, "Score: 0", { fontSize: "32px", fill: "#fff" }).setOrigin(1, 0);
        this.LevelText = this.add.text(this.sys.game.config.width - 16, 50, "Score: 0", { fontSize: "32px", fill: "#fff" }).setOrigin(1, 0);
        // this.upgrade = this.physics.add.sprite(this.GameWidth/2, this.GameHeight/2, "upgrade");

        // create enemy bullet
        this.createEnemyBullets();

        this.playerLives = 3;
        this.livesIcons = [];

        // create player heart
        for (let i = 0; i < this.playerLives; i++) {
            let x = this.sys.game.config.width - 40 * (i + 1);
            let heart = this.add.image(x, 100, "playerHeart").setScale(0.5).setOrigin(0.5);
            this.livesIcons.push(heart);
        }

        this.points = [
            100, 100,
            200, 200,
            300, 300,
            400, 400,
            500, 100,
            600, 200,
            700, 300,
            900, 400,
            1100, 200,
            1250, 175,
            1375, 300
        ];
        this.points2 = [
            1375, 300,
            1250, 175,
            1100, 200,
            900, 400,
            700, 300,
            600, 200,
            500, 100,
            400, 400,
            300, 300,
            200, 200,
            100, 100
        ];
        let spline = new Phaser.Curves.Spline(this.points);
        this.curves.push(spline);
        let spline2 = new Phaser.Curves.Spline(this.points2);
        this.curves.push(spline2);

        this.physics.add.collider(this.bullets, this.enemyDucks, this.hitEnemy, null, this);

        this.physics.add.collider(this.duckSprite, this.enemyBullets, this.hitPlayer, null, this);

        this.init_game();

    }

    init_game() {
        this.score = 0;
        this.GameLevel = 0;
        this.isWin = false;
        this.scoreText.setText("Score: 0");
        this.LevelText.setText("Level: 0");

        this.playerLives = 3;
        this.livesIcons.forEach((icon, index) => {
            icon.setVisible(index < this.playerLives);
        });

        this.enemyDucks.clear(true, true);

        this.duckSprite.setPosition(this.GameWidth / 2, this.GameHeight - 100);
        this.duckSprite.setActive(true).setVisible(true);

        this.bullets.clear(true, true);
        this.enemyBullets.clear(true, true);

        if (this.enemySpawnEvent) {
            this.enemySpawnEvent.remove(false);
        }

        this.enemySpawnEvent = this.time.addEvent({
            delay: 2000,
            callback: () => {
                if (this.playerLives >= 0 && !this.isWin) {
                    this.spawnEnemy(this.curves[0])
                    this.spawnEnemy(this.curves[1])
                }
            },
            callbackScope: this,
            loop: true
        });

        this.graphics.clear();
        this.curves.forEach(curve => curve.draw(this.graphics, 64));
    }

    randompPointsTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
            this.randompPoints()
        }, 3000);
    }

    randompPoints() {
        let result = [];
        let x = Math.floor(Math.random() * this.GameWidth)
        let y = Math.floor(Math.random() * 50)
        for (let i = 0; i < 30; i++) {
            let w = Math.floor(Math.random() * 500);
            let h = Math.floor(Math.random() * (i == 0 ? 100 : 500));
            if (x + w <= this.GameWidth) {
                x += w
            } else {
                x -= w
            }
            if (y + h > Math.floor(this.GameHeight / 1.5)) {
                y -= h
            } else {
                y += h
            }
            result.push(x, y);
        }
        let spline = new Phaser.Curves.Spline(result);
        this.curves.unshift(spline);
    }


    createBackground() {
        const spacing = 125;
        const numColumns = Math.ceil(this.sys.game.config.width / spacing);
        const numRows = Math.ceil(this.sys.game.config.height / spacing);
        for (let x = 0; x < numColumns; x++) {
            for (let y = 0; y < numRows; y++) {
                this.add.image(x * spacing, y * spacing, "backgroundBlue").setOrigin(0, 0);
            }
        }
    }

    createPlayer() {
        this.duckSprite = this.physics.add.sprite(this.GameWidth / 2, this.GameHeight - 100, "playerDuck");
        this.duckSprite.setCollideWorldBounds(true);

        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,

        });
        this.input.keyboard.on("keydown-SPACE", () => {
            if (this.duckSprite.active) {
                this.shootBullet(this.duckSprite.x, this.duckSprite.y - 20);
                this.sound.play("shotSound");
            }
        });
    }

    createBullets() {
        this.bullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 9999999999,
            runChildUpdate: true
        });
    }

    createEnemyBullets() {
        this.enemyBullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 9999999999,
        });
    }

    hitEnemy(bullet, enemy) {
        if (enemy.data && enemy.data.get('score') !== undefined) {
            this.score += enemy.data.get('score');
            this.scoreText.setText(`Score: ${this.score}`);
            if (this.GameLevel != Math.floor(this.score / 100)) {
                this.GameLevel = Math.floor(this.score / 100)
                this.upgrade.setVisible(true);
                setTimeout(() => {
                    this.upgrade.setVisible(false);
                }, 500);
            }

            if (this.score >= 4000) {               //Victory Condition
                this.isWin = true
                this.livesIcons[0].setVisible(false);

                this.showVictoryScreen(true);
                this.sound.play("gameoverSound");
                return
            }
            this.LevelText.setText(`Level: ${this.GameLevel}`);
        }

        bullet.disableBody(true, true);
        bullet.destroy();
        enemy.disableBody(true, true);
        enemy.destroy();
        this.sound.play("hitSound");
    }


    hitPlayer(player, bullet) {
        bullet.disableBody(true, true);
        bullet.destroy();

        this.playerLives--;
        if (this.playerLives > 0) {
            this.livesIcons[this.playerLives].setVisible(false);
            this.sound.play("getHitSound");
        } else {
            this.livesIcons[0].setVisible(false);
            player.setActive(false).setVisible(false);
            this.showGameOverScreen();
            this.sound.play("gameoverSound");
        }
    }

    

    showGameOverScreen(isWin) {
        this.physics.pause();
        const gameOverImage = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, isWin?'win':"gameover")

        const gameOverText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "\n \n \n \nClick to Restart", {
            fontFamily: "Monaco, Courier, monospace",
            fontSize: "40px",
            fill: "#d8d8d8"
        }).setOrigin(0.5).setInteractive();

        gameOverText.on("pointerdown", () => {
            this.scene.restart(); 

        });
    }

    showVictoryScreen() {
        this.physics.pause();
        this.bullets.clear(true, true);
        this.enemyBullets.clear(true, true);

        const victoryimage = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "win", {
        }).setOrigin(0.5);

        victoryimage.setInteractive();
        victoryimage.on("pointerdown", () => {
            this.scene.start("MainMenu");
        });
    }

    createEnemies() {
        this.enemyDucks = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: 10,
            runChildUpdate: true
        });

        this.time.addEvent({
            delay: 20000,
            callback: () => {
                if (this.playerLives >= 0  && !this.isWin) {
                    this.spawnEnemy(this.curves[0])
                    this.spawnEnemy(this.curves[1])
                }
            },
            callbackScope: this,
            loop: true
        });

        this.enemyDucks.children.iterate((enemy) => {
            enemy.setCollideWorldBounds(true);
        });
    }

    spawnEnemy(curve) {
        if (this.playerLives <= 0 || this.isWin) {
            return
        }
        const x = Phaser.Math.Between(0, this.sys.game.config.width);
        const duckType = Phaser.Math.Between(1, 5);
        const type = `enemyDuck${duckType}`;
        const enemy = this.enemyDucks.create(x, 0, type);
        if (!enemy) {
            return
        }
        enemy.path = curve;
        enemy.pathT = 0;
        enemy.pathSpeed = 0.0005 + Math.min(this.GameLevel, this.MaxGameLevel) * 0.0001;
        enemy.pathVector = new Phaser.Math.Vector2();

        const scores = [10, 20, 30, 40, 50];
        const bulletTypes = ["enemyDuckBullet1", "enemyDuckBullet2", "enemyDuckBullet3", "enemyDuckBullet4", "enemyDuckBullet5"];
        enemy.setData("score", scores[duckType - 1]);
        enemy.setData("bulletType", bulletTypes[duckType - 1]);

        this.time.addEvent({
            delay: 3000 - Math.min(this.GameLevel, this.MaxGameLevel) * 100,
            callback: () => {
                if (enemy.active && this.playerLives >= 0  && !this.isWin) {
                    this.shootEnemyBullet(enemy);
                }
            },
            loop: true
        });
    }

    shootEnemyBullet(enemy) {
        if (this.playerLives <= 0 || this.isWin) {
            return
        }
        const bulletType = enemy.data.get("bulletType");
        let bullet = this.enemyBullets.get(enemy.x, enemy.y, bulletType);
        if (bullet) {
            bullet.setActive(true).setVisible(true);
            bullet.setVelocityY(300);
        }
    }

    shootBullet(x, y) {
        let bullet = this.bullets.get(x, y, "playerBullet");
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setVelocityY(-300);
            bullet.setAngle(270);
        }
    }

    update() {
        if (this.playerLives <= 0 || this.isWin) {
            return
        }
        this.enemyDucks.children.iterate((enemy) => {
            if (enemy.pathT !== undefined) {
                enemy.pathT += enemy.pathSpeed;
                if (enemy.pathT > 1) {
                    enemy.pathT = 0;
                }
                enemy.path.getPoint(enemy.pathT, enemy.pathVector);
                enemy.setPosition(enemy.pathVector.x, enemy.pathVector.y);
            }
        });

        this.duckSprite.setX(Phaser.Math.Clamp(this.duckSprite.x, 0, this.sys.game.config.width));
        this.duckSprite.setY(Phaser.Math.Clamp(this.duckSprite.y, 0, this.GameHeight - 100));

        this.enemyDucks.children.iterate((enemy) => {
            if (enemy.active) {
                enemy.setX(Phaser.Math.Clamp(enemy.x, 0, this.sys.game.config.width));
                enemy.setY(Phaser.Math.Clamp(enemy.y, 0, this.sys.game.config.height));
            }
        });

        this.graphics.clear();
        this.curves.forEach(curve => curve.draw(this.graphics, 64));

        if (this.keys.left.isDown) {
            this.duckSprite.x -= 5;
        }
        if (this.keys.right.isDown) {
            this.duckSprite.x += 5;
        }
    }
}

