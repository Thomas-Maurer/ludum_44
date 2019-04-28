export default class AudioManager {
    public soundInstance: Phaser.Sound.BaseSound
    private scene: Phaser.Scene
    /**
     * Contain the list of all available sounds
     */
    public soundsList = {
        PLAYER_JUMP: "playerJump",
        PLAYER_FOOTSTEP: "playerFootstep",
        VICTORY: 'victory',
        DEATH: 'death'
    };
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        // preload all sounds
        for (const soundName in this.soundsList) {
            if (this.soundsList.hasOwnProperty(soundName)) {
                const soundFileName = this.soundsList[soundName];
                this.scene.load.audio(soundFileName, 'assets/sounds/' + soundFileName + '.wav');
                console.log("Sound " + soundFileName + " loaded from " + soundFileName)
            }
        }

    }

    /**
     * Play the given sound name
     * @param soundName 
     * @param options Phaser sound options
     */
    public playSound(soundName: string, options?: SoundConfig) {
        const sound = this.scene.sound.add(soundName);
        sound.play(null, options);
    }
}