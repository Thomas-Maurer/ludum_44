import {PlayerControls} from "./playerControls/playerControls";

export default class Player {
    private sprite: Phaser.Physics.Matter.Sprite;
    private playerControl: PlayerControls;
    constructor(scene: Phaser.Scene, x: number, y: number, key: string, frame?: string | integer) {
        this.sprite = scene.matter.add.sprite(x, y, key, frame);
        this.playerControl = new PlayerControls(scene);
    }

    /**
     * Return the PlayerSprite
     */
    public getPlayerSprite(): Phaser.Physics.Matter.Sprite {
        return this.sprite;
    }

    /**
     * Handle all the Action the player can do with the controls
     */
    public handleActions(): void {
        this.playerControl.handlePlayerControls(this);
    }
}