export default class AudioManager {
    public readonly playerJump: any;
    constructor(game: Phaser.Scene) {
        game.load.audio('playerJump', 'assets/sounds/jump.wav');
        this.playerJump = game.load.audio("playerJump");
        this.playerJump.play();
    }
}