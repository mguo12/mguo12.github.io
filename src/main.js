import Duck from './Scenes/Duck.js';
import MainMenu from './Scenes/MainMenu.js';


let GameWidth = document.getElementById('game').offsetWidth;
let GameHeight = document.getElementById('game').offsetHeight;

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: GameWidth,
    height: GameHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainMenu, Duck]
};
document.getElementById('description').innerHTML = '<h2>Welcome to Duck Raider!</h2><h2>A for move Left</h2><h2>D for move Right</h2><h2>Space for fire</h2><h2>Enjor the game!</h2>'

const game = new Phaser.Game(config);