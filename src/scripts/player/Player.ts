import {PlayerControls} from "./playerControls/playerControls";

export default class Player {
    private sprite: Phaser.Physics.Matter.Sprite;
    private playerControl: PlayerControls;
    private canJump: boolean;
    private jumpCooldownTimer: Phaser.Time.TimerEvent;
    private scene: Phaser.Scene;
    constructor(scene: Phaser.Scene, x: number, y: number, key: string, frame?: string | integer) {
        this.sprite = scene.matter.add.sprite(x, y, key, frame);
        this.playerControl = new PlayerControls(scene);
        this.scene = scene;
        this.canJump = true;
        this.sprite.setFixedRotation();
        this.sprite.setFriction(0.2, 0.02,0);
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

    /**
     * Return if the player can jump or not
     */
    public getCanJump(): boolean {
        return this.canJump;
    }

    public desactivateJump(): void {
        // Add a slight delay between jumps since the bottom sensor will still collide for a few
        // frames after a jump is initiated
        this.jumpCooldownTimer = this.scene.time.addEvent({
            delay: 250,
            callback: () => (this.canJump = true)
        });
        this.canJump = false;
    }
}