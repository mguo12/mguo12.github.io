export default class Duck extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" });
        this.ducks = [];
    }

    preload() {
        this.GameWidth = document.getElementById('game').offsetWidth;
        this.GameHeight = document.getElementById('game').offsetHeight;
        this.load.setPath("./assets/");
        this.load.image("backgroundWood", "bg_wood.png");
        this.load.image("cloud1", "cloud1.png");
        this.load.image('cloud2', "cloud2.png");
        this.load.image("target", "target_colored_outline.png");
        this.load.image("curtain", "curtain.png");
        this.load.image("curtainTop", "curtain_top.png");
        this.load.image("curtainStraight", "curtain_Straight.png");
        this.load.image("Duck", "duck_outline_yellow.png");
        this.load.image("Duck1", "duck_outline_white.png");
        this.load.image("Duck2", "duck_outline_brown.png");
        this.load.image("Duck3", "duck_back.png");
        this.load.image("Duck4", "duck_brown.png");
        this.load.image("Duck5", "duck_white.png");
        this.load.image("go", "text_go.png");
        this.load.image("ready", "text_ready.png")
        this.load.image("water1", "water1.png");
        this.load.image("water2", "water2.png");
        this.load.audio("click", "switch_006.ogg");

    }

    create() {
        this.createBackground();

        this.add.image(65, 200, "curtain");
        this.add.image(this.GameWidth - 65, 200, "curtain").setScale(-1, 1);

        this.add.image(300, 150, "cloud1");
        this.add.image(500, 200, "cloud2");
        this.add.image(700, 200, "cloud2");
        this.add.image(this.GameWidth - 700, 200, "cloud2");
        this.add.image(this.GameWidth - 500, 200, "cloud2");
        this.add.image(this.GameWidth - 300, 150, "cloud1");

        this.DuckXY = [
            [100, 870, false, "Duck"],
            [300, 890, false, "Duck1"],
            [500, 910, false, "Duck2"],
            [this.GameWidth - 500, 920, false, "Duck3"],
            [this.GameWidth - 300, 940, false, "Duck4"],
            [this.GameWidth - 100, 960, false, "Duck5"],
        ]
        this.duckList = [];

        this.duckSpeed = 50;
        for (let i = 0; i < this.DuckXY.length; i++) {
   
            let duck = this.physics.add.sprite(this.DuckXY[i][0], this.DuckXY[i][1],  this.DuckXY[i][3]);
       
            if (!this.DuckXY[i][2]) {
                duck.setVelocity(0, this.duckSpeed);
            }
            this.duckList.push(duck);
        }


        for (let i = 65; i < this.GameWidth + 132; i += 132) {
            this.add.image(i, 700, i % 132 == 65 ? "water1" : "water2");
        }

        this.add.image(300, 400, "target");
        this.add.image(this.GameWidth - 300, 400, "target");

        const readyButton = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "ready");
        readyButton.on("pointerdown", () => {
            this.sound.play("click");
            this.scene.start('Ready');
        });

        const playButton = this.add.image(this.sys.game.config.width / 2, 900, "go").setInteractive();
        playButton.on("pointerdown", () => {
            this.sound.play("click");
            this.scene.start('Duck');
        });

        this.add.text(this.sys.game.config.width / 2, 100, "Duck Raider", { font: "80px", fill: "#FFFF00" }).setOrigin(0.5);
    }

    update(time, delta) {
        for (let i = 0; i < this.duckList.length; i++) {
            let duck = this.duckList[i];
            if (duck.y < 870) {
                this.DuckXY[i][2] = false;
                duck.setVelocity(0, this.duckSpeed);
            } else if (duck.y > 1000) { 
                this.DuckXY[i][2] = true;
                duck.setVelocity(0, -this.duckSpeed);
            }
        }

    }


    createBackground() {
        const spacing = 125;
        for (let x = 0; x < this.sys.game.config.width; x += spacing) {
            for (let y = 0; y < this.sys.game.config.height; y += spacing) {
                this.add.image(x, y, "backgroundWood").setOrigin(0, 0);
            }
        }
    }

}