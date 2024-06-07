export default class Over extends Phaser.Scene {
    constructor() {
        super({ key: "Over" });
    }

    preload() {
    }

    create() {  

        this.clickMusic = this.sound.add('click_music', { volume: window.GameVolume, loop: false });  

        var award = this.add.sprite(window.GameWidth / 2, 100, 'award');  

        var textGame = this.add.bitmapText(window.GameWidth / 2 - 170, 200, 'carrier_command', window.GameState || 'Game Over', 32);  
  
        var textOver = this.add.bitmapText(window.GameWidth / 2 - 130, 310, 'carrier_command', 'scores:' + window.GameScore, 24);  
  
        var timeOver = this.add.bitmapText(window.GameWidth / 2 - 140, 370, 'carrier_command', 'time:' + window.GameTime, 24);  

        const replayButton = this.add.sprite(window.GameWidth / 2, 470, 'replaybutton').setInteractive();
        replayButton.on("pointerdown", () => {
            this.sound.play('click_music');  
            this.scene.start('Home');
        });
    }  
  

    update() {  

    }  



}