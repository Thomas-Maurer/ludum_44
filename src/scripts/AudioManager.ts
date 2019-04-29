import MainScene from "./scenes/MainScene";

export default class AudioManager {
    public soundInstance: Phaser.Sound.BaseSound
    private scene: MainScene;
    public playingSound: Phaser.Sound.BaseSound;
    public playingMusic: Phaser.Sound.BaseSound;
    /**
     * Contain the list of all available sounds (.wav)
     */
    public soundsList = {
        PLAYER_JUMP: "playerJump",
        PLAYER_FOOTSTEP: "playerFootstep",
        VICTORY: 'victory',
        DEATH: 'death',
        SUCK: 'suck',
        PEASANT_DIE: 'peasantDie',
        PLAYER_DIE: 'playerDie',
        HIT: 'hit',
        HEARTH_BEAT: 'hearth_beat'
    };
    /**
     * List of music (.mp3)
     */
    public musicsList = {
        WORLD: 'world',
        CHURCH: 'church',
        SHOP: 'shop'
    }
    constructor(scene: MainScene) {


        this.scene = scene;
        // preload all sounds
        for (const soundName in this.soundsList) {
            if (this.soundsList.hasOwnProperty(soundName)) {
                const soundFileName = this.soundsList[soundName];
                this.scene.load.audio(soundFileName, 'assets/sounds/' + soundFileName + '.wav');
                console.log("Sound " + soundFileName + " loaded from " + soundFileName)
            }
        }

        // preload all musics
        for (const soundName in this.musicsList) {
            if (this.musicsList.hasOwnProperty(soundName)) {
                const soundFileName = this.musicsList[soundName];
                this.scene.load.audio(soundFileName, 'assets/sounds/' + soundFileName + '.mp3');
                console.log("Music " + soundFileName + " loaded from " + soundFileName)
            }
        }

    }

    /**
     * Play the given sound name
     * @param soundName 
     * @param options Phaser sound options
     */
    public playSound(soundName: string, options?: SoundConfig) {
        this.playingSound = this.scene.sound.add(soundName);
        this.playingSound.play(null, options);
    }
    /**
     * Play the given music name (one at time)
     */
    public playMusic(musicName: string, options?: SoundConfig) {
        //Stop if music can't play
        if (!this.scene.musicCanPlay) {
            return;
        }
        if (!options) {
            options = {}
        };
        if (this.playingMusic) {
            this.playingMusic.stop();
        }
        this.playingMusic = this.scene.sound.add(musicName);
        options.loop = true; //force music loop
        this.playingMusic.play(null, options);

    }

}