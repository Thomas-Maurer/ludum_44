export default class AudioManager {
    public soundInstance: Phaser.Sound.BaseSound
    private scene: Phaser.Scene
    /**
     * Contain the list of all available sounds
     */
    public soundsList = {
        PLAYER_JUMP: "playerJump",
        PLAYER_FOOTSTEP: "playerFootstep"
    };
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        // preload all sounds
        for (const soundName in this.soundsList) {
            if (this.soundsList.hasOwnProperty(soundName)) {
                const soundFileName = this.soundsList[soundName];
                this.scene.load.audio('playerJump', 'assets/sounds/' + soundFileName + '.wav');
            }
        }

    }

    public playSound(soundName: string) {
        const sound = this.scene.sound.add(soundName);
        sound.play();
    }
}