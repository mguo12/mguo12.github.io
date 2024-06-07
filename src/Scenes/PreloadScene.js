console.log(Phaser.tilemaps);
export default class Preload extends Phaser.Scene {
    constructor() {
        super({ key: "Preload" });
    }

    preload() {
        let game = this

        var style = { font: "32px Arial", fill: "#ffff00", align: "center" };
        this.text_process = this.add.text(450, 250, 'loading... 0%', style);

        this.load.on('progress', function (value) {
            this.text_process.setText(`loading...${(value * 100).toFixed(2)}%`);
        }, this);

        this.load.tilemapTiledJSON('man', 'assets/map.json');
        this.load.tilemapTiledJSON('man2', 'assets/map2.json');
        this.load.tilemapTiledJSON('man3', 'assets/map3.json');
        this.load.spritesheet('playbutton', 'assets/play_button.png', { frameWidth: 198, frameHeight: 70, endFrame: 2 });
        this.load.spritesheet('replaybutton', 'assets/replaybutton.png', { frameWidth: 196, frameHeight: 70, endFrame: 2 });
        this.load.image('tilemap_packed', 'assets/tilemap_packed.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('background2', 'assets/background2.png');
        this.load.image('background3', 'assets/background3.png');
        this.load.image('coin', 'assets/coin.png');
        this.load.image('diamond', 'assets/diamond.png');
        this.load.image('line', 'assets/deadline.png');
        this.load.image('door', 'assets/door.png');
        this.load.bitmapFont('carrier_command', 'assets/carrier_command.png', 'assets/carrier_command.xml');
        this.load.image('award', 'assets/award.png');
        this.load.image('block', 'assets/block.png');
        this.load.image('fly_floor', 'assets/move_land.png');
        this.load.image('fly_floor2', 'assets/move_land2.png');
        this.load.spritesheet('spring', 'assets/bounce.png', { frameWidth: 35, frameHeight: 26, endFrame: 2 });
        this.load.spritesheet('hero', 'assets/hero.png', { frameWidth: 30, frameHeight: 35, endFrame: 16 });
        this.load.spritesheet('dinosaur', 'assets/dinosaur.png', {  
            frameWidth: 71,
            frameHeight: 65,
            startFrame: 0,
            endFrame: 5
        }); 
        this.load.spritesheet('boss', 'assets/boss.png', {  
            frameWidth: 100,
            frameHeight: 77,
            startFrame: 0,
            endFrame: 2
        });

        this.load.audio('chapter1', 'assets/chapter1.mp3');
        this.load.audio('chapter2', 'assets/chapter2.mp3');
        this.load.audio('chapter3', 'assets/chapter3.mp3');
        this.load.audio('powerup', 'assets/powerup.mp3');
        this.load.audio('getcoin', 'assets/getcoin.mp3');
        this.load.audio('getcoin2', 'assets/getcoin2.mp3');
        this.load.audio('spring_music', 'assets/spring.mp3');
        this.load.audio('death_music', 'assets/death_music.mp3');
        this.load.audio('vectory_music', 'assets/vectory_music.mp3');
        this.load.audio('click_music', 'assets/click_music.mp3');
        this.load.audio('jump_music', 'assets/jump_music.mp3');

   
        this.load.on('complete', function () {
            this.scene.start('Home');
        }, this);


    }

    create() {
    }

    update(time, delta) {


    }



}