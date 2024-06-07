export default class Main extends Phaser.Scene {
    constructor() {
        super({ key: "Home" });
    }

    preload() {
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        this.clickMusic = this.sound.add('click_music', { volume: window.GameVolume, loop: false });  

        this.add.bitmapText(window.GameWidth / 2 - 260, 130, 'carrier_command', 'Valor\'s', 64);
        this.add.bitmapText(window.GameWidth / 2 - 340, 270, 'carrier_command', 'ADVENTURE', 64);

        const playButton = this.add.image(window.GameWidth / 2, 470, 'playbutton').setInteractive();
        playButton.on("pointerdown", () => {
            this.sound.play('click_music');  

            this.scene.start('Start');
        });

        this.player = this.physics.add.sprite(150, 250, 'hero'); 

        this.player.setGravityY(0);

        this.player.setBounceX(1);

        this.player.setVelocityX(70);

        this.player.setCollideWorldBounds(true);

        this.player.anims.create({
            key: 'home_right',
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        });

        this.player.anims.create({
            key: 'home_left',
            frames: this.anims.generateFrameNumbers('hero', { start: 9, end: 6}),
            frameRate: 12,
            repeat: -1
        });

        this.player.anims.play('home_right');
    }

    update(time, delta) {
        if (this.player.body.x < 10) {  
            this.player.setVelocityX(70)
            this.player.anims.play('home_right', true);  
        } else if (this.player.body.x > 300) {  
            this.player.setVelocityX(-70)
            this.player.anims.play('home_left', true);  
        }

    }



}