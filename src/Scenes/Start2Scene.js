export default class Start2 extends Phaser.Scene {
    constructor() {
        super({ key: "Start2" });
    }

    preload() {

    }

    create() {
        this.isOver = false
        this.add.image(0, 0, 'background2').setOrigin(0, 0);
        this.chapter2 = this.sound.add('chapter2', { volume: window.GameVolume, loop: true });
        this.chapter2.play();
        this.getcoin = this.sound.add('getcoin', { volume: window.GameVolume, loop: false });
        this.getcoin2 = this.sound.add('getcoin2', { volume: window.GameVolume, loop: false });
        this.jump_music = this.sound.add('jump_music', { volume: window.GameVolume, loop: false });
        this.spring_music = this.sound.add('spring_music', { volume: window.GameVolume, loop: false });
        this.death_music = this.sound.add('death_music', { volume: window.GameVolume, loop: false });
        this.powerup = this.sound.add('powerup', { volume: 1, loop: false });

        // reset score
        this.score = window.GameScore;
        this.timeStr = '00:00'
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
        this.p = this.physics.add.sprite(70, 370, 'hero');
        this.p.body.setGravityY(1100);
        this.p.body.setBounceY(0);
        this.p.body.linearDamping = 1.2;
        this.p.body.setCollideWorldBounds(true);
        this.p.body.setVelocityX(0);

        this.map = this.make.tilemap({ key: "man2" });
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
        this.block3 = this.physics.add.sprite(3150, 0, 'block');
        this.block3.setGravityY(1100);

        this.lines = this.add.sprite(0, 555, 'line');
        this.physics.add.existing(this.lines);
        this.lines.body.setAllowGravity(false);
        this.lines.body.setImmovable(true);
        this.lines.scaleX = 2; 
        this.lines.setVisible(false);

        this.scoreText = this.add.text(980, 12, 'Score: ' + this.score, { fontSize: '32px', fill: '#fff' });

        // create spring
        this.springList = []
        let springLocation = [
            { x: 3700, y: 445 },
        ]
        springLocation.forEach(location => {
            let spring = this.physics.add.sprite(location.x, location.y, 'spring');
            spring.setImmovable(true);
            this.springList.push(spring)
        })


        // create movement platform
        this.fly_speed = 2
        this.fly_direction = 1;
        this.flyList = []
        let flyLocation = [
            { x: 400, y: 390, speed: 100, direction: 1, move: 'x', min: 400, max: 700 },
            { x: 1100, y: 350, speed: 100, direction: 1, move: 'x', min: 1100, max: 1400 },
            { x: 1600, y: 350, speed: 100, direction: 1, move: 'y', min: 300, max: 400 },
            { x: 2350, y: 350, speed: 100, direction: 1, move: 'y', min: 170, max: 400 },
            { x: 3900, y: 150, speed: 100, direction: 1, move: 'y', min: 100, max: 200 },
        ]
        flyLocation.forEach(flyItem => {
            let fly_floor = this.add.sprite(flyItem.x, flyItem.y, 'fly_floor2');
            fly_floor.speed = flyItem.speed
            fly_floor.direction = flyItem.direction
            fly_floor.move = flyItem.move
            fly_floor.min = flyItem.min
            fly_floor.max = flyItem.max
            this.physics.add.existing(fly_floor);
            fly_floor.body.immovable = true;
            this.flyList.push(fly_floor)
        })


        this.destination_door = this.add.sprite(4200, 50, 'door');
        this.physics.add.existing(this.destination_door);



        // create dinosaur
        this.dinosaurList = []
        let dinosaurLocation = [
            { x: 300, y: 70 },
            //{ x: 700, y: 70 },
            { x: 1400, y: 70 },
            //{ x: 700, y: 200 },
            { x: 1200, y: 220 },
            { x: 2300, y: 250 },
            //{ x: 3300, y: 70 },
            { x: 3400, y: 200 },
            //{ x: 3500, y: 300 },
        ]
        dinosaurLocation.forEach(location => {
            let dinosaur = this.physics.add.sprite(location.x, location.y, 'dinosaur', 0);
            dinosaur.setBounce(1, 0); 
            dinosaur.setVelocityX(-120);
            dinosaur.setCollideWorldBounds(true);

            this.dinosaurList.push(dinosaur)
        })

        // conversation
        const interactiveRect = this.add.rectangle(0, 0, window.GameWidth * 2, window.GameHeight * 2, 0xFFFFFF).setInteractive();
        const maskGraphics = this.add.graphics({ x: 0, y: 0 });
        const viewRect = new Phaser.Geom.Rectangle(0, 0, window.GameWidth, window.GameHeight);
        // Draw the field of view area (use black fill and translucent effect) 
        maskGraphics.fillStyle(0x000000, 0.5);
        maskGraphics.fillRect(viewRect.x, viewRect.y, viewRect.width, viewRect.height);
        interactiveRect.setMask(new Phaser.Display.Masks.BitmapMask(this, maskGraphics));
        
        this.isOverDialogue = false
        interactiveRect.on('pointerdown', (pointer, localX, localY, event) => {
            if (this.currentDialogueIndex >= this.dialogues.length) {
                interactiveRect.destroy();
                this.dialogueText.destroy()
                maskGraphics.destroy()
                copyP.destroy()
                this.isOverDialogue = true
            } else {
                this.showNextDialogue();
            }
        });
         // boss 
         this.boss = this.physics.add.sprite(900, 300, 'boss', 0);
         this.boss.setBounce(1, 0);
         this.boss.setCollideWorldBounds(true);
         

        var copyP = this.physics.add.sprite(70, 370, 'hero');
 
        // create text
        this.textStyle = { 
            fontSize: '16px',
            lineHeight: '20px', 
            fill: '#fff', 
            padding: 10,
            wordWrap: { width: 500, useAdvancedWrap: true },
            backgroundColor: 'rgba(1,1,1,0.5)'
        };
        this.dialogueText = this.add.text(200, 12, ' ', this.textStyle);

        // create text
        this.dialogues = [
            { speaker: 'Player', text: `Who are you?` },
            { speaker: 'Boss', text: `I am the Beaker Lord. If you want to go home, try to pass my challenge!` },
            { speaker: 'Player', text: `Ellie, wait for me!` },
        ];

        this.currentDialogueIndex = 0;


        this.showNextDialogue();
        this.p.setOrigin(0.5, 0.5);
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
        
        this.flyList.forEach(flyItem => {
            this.moveFly(flyItem)
        })
    }

    update(time, delta) {
        if (this.isOver || !this.isOverDialogue) {
            return
        }
        this.bossMove()
        if (this.cursors.up.isDown) {
            if (this.p.body.onFloor()) {
                console.log(this.p.body.x);
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

        this.dinosaurList.forEach(dinosaur => {
            if (dinosaur.body.velocity.x >= 0) {
                dinosaur.anims.play('dinosaur_right', true);
            } else if (dinosaur.body.velocity.x < 0) {
                dinosaur.anims.play('dinosaur_left', true);
            }
            this.physics.add.collider(dinosaur, this.layer, this.dinosaurBounce, null, this);
            this.physics.add.collider(this.p, dinosaur, this.beKilled, null, this);
        })

        // boss 
        if (this.boss.body.velocity.x >= 0) {
            this.boss.anims.play('boss_right', true);
        } else if (this.boss.body.velocity.x < 0) {
            this.boss.anims.play('boss_left', true);
        }

        this.springList.forEach(spring => {
            this.physics.add.collider(this.p, spring, this.spring_To, null, this);
        })


        // check collider
        this.physics.add.collider(this.p, this.layer, this.disBounce, null, this);  


        this.isDrag = this.physics.add.collider(this.p, this.block3, this.collectCase, null, this);
        if (this.isDrag) {
            this.block3.body.setDrag(50, 0);
        } else {
            this.block3.body.setDrag(0, 0);
        }

    
        this.flyList.forEach(flyItem => {
            this.physics.add.collider(this.p, flyItem, this.getFloor, null, this);
        })

        this.physics.add.collider(this.layer, this.block3);   
        this.physics.add.collider(this.lines, this.block3, this.killBox, null, this);

        this.physics.add.overlap(this.p, this.diamonds, this.collectDiamond, null, this);
        this.physics.add.overlap(this.p, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.p, this.lines, this.beKilled, null, this);
        this.physics.add.overlap(this.p, this.boss, this.beKilled, null, this);
        this.physics.add.overlap(this.p, this.destination_door, this.victory, null, this);
    }

    // boss movement
    bossMove(){
        if(this.isOverDialogue){
            let playerX = this.p.x;
            let playerY = this.p.y;
            let bossX = this.boss.x;
            let bossY = this.boss.y;
            let speed = 20
            if (playerX <= bossX) {
                this.boss.setVelocityX(-speed);
            }
            if (playerX > bossX) {
                this.boss.setVelocityX(speed);
            }
            if (playerY <= bossY) {
                this.boss.setVelocityY(-speed);
            }
            if (playerY > bossY) {
                this.boss.setVelocityY(speed);
            }
        }
    }

    showNextDialogue() {
        if(this.dialogueText){
            this.dialogueText.destroy()
        }


        const dialogue = this.dialogues[this.currentDialogueIndex];
        if (dialogue.speaker == 'Boss') {
            this.dialogueText = this.add.text(670, 200, `${dialogue.text}`, this.textStyle);
        } else {
            this.dialogueText = this.add.text(150, 300, `${dialogue.text}`, this.textStyle);
        }

        this.currentDialogueIndex++;
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
    moveFly(flyItem) {
        if (flyItem.timer) {
            clearInterval(flyItem.timer);
        }
        flyItem.timer = setInterval(() => {
            let speed = flyItem.speed * flyItem.direction
            if (flyItem.move == 'x') {
                flyItem.body.setVelocityX(speed);
            }
            if (flyItem.move == 'y') {
                flyItem.body.setVelocityY(speed);
            }
            if (flyItem[flyItem.move] <= flyItem.min) {
                flyItem.direction = 1;
            } 
            if (flyItem[flyItem.move] >= flyItem.max) {
                flyItem.direction = -1; 
            } 
        }, 30)
    }

    getFloor(p, flyItem) {
        if (p.y + 35 == flyItem.y) {
            let speed = flyItem.speed * flyItem.direction
            if (flyItem.move == 'x') {
                p.body.setVelocityX(speed);
            }
            if (flyItem.move == 'y') {
                p.body.setVelocityY(speed);
            }
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
        this.scene.start('Start3');
    }

    destroyFun() {
        this.sound.stopAll();
        this.flyList.forEach(flyItem=>{
            if (flyItem.timer) {
                clearInterval(flyItem.timer);
            }
        })

        this.children.each(child => {
            if (child.destroy) {
                child.destroy({ removeFromScene: true });
            }
        });
        window.GameScore = this.score
        window.GameTime = this.timeStr
        if (this.chapter2) {
            this.chapter2.stop();
        }
        this.isOver = true;
        this.scene.stop('Start2');
    }






}