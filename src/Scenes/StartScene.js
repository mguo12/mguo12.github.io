export default class Start extends Phaser.Scene {
    constructor() {
        super({ key: "Start" });
    }

    preload() {
        
    }

    create() {
        this.isOver = false
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.chapter1 = this.sound.add('chapter1', { volume: window.GameVolume, loop: true });
        this.chapter1.play();
        this.getcoin = this.sound.add('getcoin', { volume: window.GameVolume, loop: false });
        this.getcoin2 = this.sound.add('getcoin2', { volume: window.GameVolume, loop: false });
        this.jump_music = this.sound.add('jump_music', { volume: window.GameVolume, loop: false });
        this.spring_music = this.sound.add('spring_music', { volume: window.GameVolume, loop: false });
        this.death_music = this.sound.add('death_music', { volume: window.GameVolume, loop: false });
        this.powerup = this.sound.add('powerup', { volume: window.GameVolume, loop: false });
        this.scores = 0;
        this.timeStr = '00:00'

        window.GameStartTime = this.time.now / 1000;
        this.timeText = this.add.bitmapText(12, 12, 'carrier_command', '00:00', 16);

        this.timeEvent = this.time.addEvent({
            delay: 1000,
            callback: function () { 
                let elapsedTime = (this.time.now / 1000) - window.GameStartTime;
                let minutes = Math.floor(elapsedTime / 60);
                let seconds = Math.floor(elapsedTime % 60);

                minutes = (minutes < 10 ? '0' : '') + minutes;
                seconds = (seconds < 10 ? '0' : '') + seconds;

                this.timeText.setText(minutes + ':' + seconds);
                this.timeStr = minutes + ':' + seconds;
            },
            callbackScope: this,
            loop: true
        });

        this.stopTimer = function () {
            if (this.timeEvent) {
                this.timeEvent.remove();
                this.timeEvent = null;
            }
        };

        // create player
        this.p = this.physics.add.sprite(132, 132, 'hero');
        this.p.body.setGravityY(1100);
        this.p.body.setBounceY(0);
        this.p.body.linearDamping = 1.2;
        this.p.body.setCollideWorldBounds(true);
        this.p.body.setVelocityX(0);

        this.map = this.make.tilemap({ key: "man" });

        // add map images
        this.map.addTilesetImage('tilemap_packed', 'tilemap_packed');
        this.map.addTilesetImage('coinxd', 'coin');
        this.map.addTilesetImage('diamondxd', 'diamond');

        // add layer
        this.layer = this.map.createLayer('layer', 'tilemap_packed');
        this.map.setCollisionByExclusion([-1], true, this.layer);
        this.add.existing(this.layer);
        this.physics.add.collider(this.p, this.layer);

        // add river
        this.river = this.map.createLayer('river', 'tilemap_packed');
        this.map.setCollisionByExclusion([-1], true, this.river);
        this.add.existing(this.river);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // add gold
        this.coins = this.physics.add.group({
            key: 'coin',
            frameQuantity: 1,
            runChildUpdate: true
        });
        const coinsFromMap = this.map.createFromObjects('coins', this.coins, {
            key: 228,
            frame: 0,
            quantity: 1,
            checkExists: true,
            setXY: { x: 'x', y: 'y' }
        });
        coinsFromMap.forEach(coin => {
            if (!coin.body) {
                this.physics.add.existing(coin);
            }
            this.coins.add(coin);
        });

        // add diamond
        this.diamonds = this.physics.add.group({
            key: 'diamond',
            frameQuantity: 1,
            runChildUpdate: true
        });
        const diamondsFromMap = this.map.createFromObjects('diamonds', this.diamonds, {
            key: 229,
            frame: 0,
            quantity: 1,
            checkExists: true,
            setXY: { x: 'x', y: 'y' }
        });
        diamondsFromMap.forEach(diamond => {
            if (!diamond.body) {
                this.physics.add.existing(diamond);
            } 
            this.diamonds.add(diamond);
        });

        // add movement box
        this.box_cases = this.physics.add.group();
        this.block3 = this.physics.add.sprite(3173, 105, 'block');
        this.block3.setGravityY(1100);

        // Create a line fixed to the bottom of the screen
        this.lines = this.add.sprite(0, 555, 'line');
        this.physics.add.existing(this.lines);
        this.lines.body.setAllowGravity(false);
        this.lines.body.setImmovable(true);
        this.lines.scaleX = 2;
        this.lines.setVisible(false);

        // reset score
        this.score = 0;
        this.scoreText = this.add.text(980, 12, 'Score: ' + this.score, { fontSize: '32px', fill: '#fff' });

        // create spring
        this.springList = []
        let springLocation = [
            { x: 350, y: 515 },
            { x: 1350, y: 515 },
            { x: 3000, y: 515 },
        ]
        springLocation.forEach(location => {
            let spring = this.physics.add.sprite(location.x, location.y, 'spring');
            spring.setImmovable(true);
            this.springList.push(spring)
        })



        // create movement platform
        this.fly_floor = this.add.sprite(800, 350, 'fly_floor');
        this.physics.add.existing(this.fly_floor);

        this.elevator = this.add.sprite(1800, 300, 'fly_floor');
        this.physics.add.existing(this.elevator);


        // create door
        this.destination_door = this.add.sprite(4055, 497, 'door');
        this.physics.add.existing(this.destination_door);



        // create dinosaur
        this.dinosaurList = []
        let dinosaurLocation = [
            //{ x: 300, y: 388 },
            //{ x: 700, y: 270 },
            //{ x: 1000, y: 500 },
            //{ x: 1700, y: 100 },
            //{ x: 2300, y: 300 },
                    // { x: 2900, y: 500 },
            //{ x: 3100, y: 200 },
            //{ x: 3700, y: 300 },
            //{ x: 4000, y: 200 },
        ]
        dinosaurLocation.forEach(location => {
            let dinosaur = this.physics.add.sprite(location.x, location.y, 'dinosaur', 0);
            dinosaur.setBounce(1, 0);
            dinosaur.setVelocityX(-120);
            dinosaur.setCollideWorldBounds(true);

            this.dinosaurList.push(dinosaur)
        })



        this.p.setOrigin(0.5, 0.5);
        // set camera
        this.camera = this.cameras.main;
        this.cameras.main.setPosition(0, 0);
        this.worldWidth = this.scale.width;
        this.worldHeight = this.scale.height;
        this.cameraWidth = this.camera.width;
        this.cameraHeight = this.camera.height;

        this.cursors = this.input.keyboard.createCursorKeys();

        if (!this.anims.anims.size) {
            this.anims.create({
                key: 'booo_1',
                frames: this.anims.generateFrameNumbers('spring', { start: 0, end: 1 }),
                frameRate: 25,
                repeat: 0
            });
            this.anims.create({
                key: 'dinosaur_right',
                frames: this.anims.generateFrameNumbers('dinosaur', { start: 3, end: 5 }),
                frameRate: 6,
                repeat: -1
            });
            this.anims.create({
                key: 'dinosaur_left',
                frames: this.anims.generateFrameNumbers('dinosaur', { start: 2, end: 0 }),
                frameRate: 6,
                repeat: -1
            });
            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 5 }),
                frameRate: 12,
                repeat: -1
            });
            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('hero', { start: 11, end: 6 }),
                frameRate: 12,
                repeat: -1
            });
            this.anims.create({
                key: 'jump_right',
                frames: this.anims.generateFrameNumbers('hero', { start: 12, end: 13 }),
                frameRate: 8,
                repeat: 0  
            });
            this.anims.create({
                key: 'jump_left',
                frames: this.anims.generateFrameNumbers('hero', { start: 15, end: 14 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'boss_right',
                frames: this.anims.generateFrameNumbers('boss', { start: 0, end: 2 }),
                frameRate: 6,
                repeat: -1
            });
            this.anims.create({
                key: 'boss_left',
                frames: this.anims.generateFrameNumbers('boss', { start: 2, end: 0 }),
                frameRate: 6,
                repeat: -1
            });
        }

    }

    update(time, delta) {
        if (this.isOver) {
            return
        }
        if (this.cursors.up.isDown) {
            if (this.p.body.onFloor()) {
                if (this.cursors.right.isDown) {
                    this.p.anims.play('jump_right');
                    this.p.body.setVelocityY(-500);
                } else if (this.cursors.left.isDown) {
                    this.p.anims.play('jump_left');
                    this.p.body.setVelocityY(-500);
                } else {
                    this.sound.add('jump_music').play();
                    this.p.body.setVelocityY(-500);
                }
            }
        }
        if (this.cursors.right.isDown) {
            this.p.anims.play('right', true);
            this.p.setVelocityX(150);
        } else if (this.cursors.left.isDown) {
            this.p.anims.play('left', true);
            this.p.setVelocityX(-150);
        } else {
            this.p.anims.stop();
            this.p.setVelocityX(0);
        }

        this.time.addEvent({
            delay: 1000,
            repeat: -1,
            callback: () => {
                if (this.shouldFollow(this.p)) {

                    if (!this.cameras.main.isFollowing) {
                        let x = this.p.x - this.cameras.main.width / 2
                        this.cameras.main.scrollX = x;
                        this.timeText.x = x + 12;
                        this.scoreText.x = x + 980;
                    }
                } else {
                    this.cameras.main.stopFollow();
                }
            },
            callbackScope: this
        });

        if (this.fly_floor.y < 100) {
            this.fly_floor.body.setVelocityY(0);
            this.fly_floor.body.immovable = true;
        }

        this.dinosaurList.forEach(dinosaur => {
            if (dinosaur.body.velocity.x >= 0) {
                dinosaur.anims.play('dinosaur_right', true);
            } else if (dinosaur.body.velocity.x < 0) {
                dinosaur.anims.play('dinosaur_left', true);
            }
            this.physics.add.collider(dinosaur, this.layer, this.dinosaurBounce, null, this);
            this.physics.add.collider(this.p, dinosaur, this.beKilled, null, this);
        })

        this.springList.forEach(spring => {
            this.physics.add.collider(this.p, spring, this.spring_To, null, this);
        })


        // collider check
        this.physics.add.collider(this.p, this.layer, this.disBounce, null, this); 
        this.physics.add.collider(this.p, this.elevator, this.nonGravity, null, this);

        this.isDrag = this.physics.add.collider(this.p, this.block3, this.collectCase, null, this);
        if (this.isDrag) {
            this.block3.body.setDrag(50, 0);
        } else {
            this.block3.body.setDrag(0, 0);
        }

        this.physics.add.collider(this.layer, this.block3); //   
        this.physics.add.collider(this.lines, this.block3, this.killBox, null, this);
        this.physics.add.collider(this.p, this.fly_floor, this.getFloor, null, this);
        this.physics.add.overlap(this.p, this.diamonds, this.collectDiamond, null, this);
        this.physics.add.overlap(this.p, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.p, this.lines, this.beKilled, null, this);
        this.physics.add.overlap(this.p, this.destination_door, this.victory, null, this);
    }

    //  update score
    updateScore(points) {
        this.score += points;
        this.scoreText.setText('Score: ' + this.score);
    }

    shouldFollow(player) {
        const followX = player.x > 600 && player.x < 3600;
        return followX;
    }

    disBounce(p, layer) {
        this.p.body.bounce.y = 0;
    }

    dinosaurBounce(dinosaur, layer) {
    }
  
    nonGravity(p, elevator) {
        if (this.cursors.up.isDown) {
            try {
                this.jump_music.play();
            } catch (e) {
            }
            this.p.body.setVelocityY(-500);
        }
        setTimeout(() => {
            elevator.destroy();
        }, 500);
    }

    spring_To(p, spring) {
        try {
            this.sound.add('spring_music').play();
        } catch (e) { }
        spring.play('booo_1');
        p.setVelocityY(-900);
    }

  
    collectCase(p, box_case) {

    }

 
    killBox(line, block3) {

    }

    getFloor() {

        this.fly_floor.body.setVelocityY(-100);
        if (this.cursors.up.isDown) {

            this.jump_music.play();
            this.p.body.setVelocityY(-500);
        }

        if (this.fly_floor.y < 100) {
            this.fly_floor.body.setVelocityY(0);
            this.fly_floor.body.allowGravity = false;
            this.fly_floor.body.moves = false;
        }
    }
 
    collectDiamond(p, diamond) {
        diamond.destroy();
        try {
            this.getcoin2.play();
        } catch (e) {
            console.log(e);
        }

        this.updateScore(15);
    }

    collectCoin(p, coin) {
        coin.destroy();
        try {
            this.getcoin.play();
        } catch (e) {
            console.log(e);
         }
        this.updateScore(5);
    }

    beKilled(player, line) {
        this.destroyFun()
        window.GameState = 'GAME OVER'
        this.death_music.play();
        this.scene.start('Over');
    }

    victory(player, destinationDoor) {
        this.destroyFun()
        window.GameState = 'GAME WIN'
        this.powerup.play();
        this.scene.start('Start2');
    }

    destroyFun(){
        this.sound.stopAll();  
        this.children.each(child => {  
            if (child.destroy) {  
                child.destroy({ removeFromScene: true });  
            }  
        });  
        window.GameScore = this.score
        window.GameTime = this.timeStr
        if (this.chapter1) {
            this.chapter1.stop();
        }
        this.isOver = true;
        this.scene.stop('Start');
    }






}