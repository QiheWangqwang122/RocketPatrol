//const { Phaser } = require("../lib/phaser");
let config = {
    type : Phaser.AUTO,
    width : 640,
    height : 480,
    scene : [ Menu, Play ]  //scene 只有menu 和play
}
let game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize /3 ;
let keyF,keyR,keyLEFT,keyRIGHT;
