import Player from "../Player";
import Vector2 = Phaser.Math.Vector2;
import MainScene from "../../scenes/MainScene";
import AudioManager from "../../AudioManager";

export class PlayerControls {
    private cursors: any;
    private leftInput: string;
    private rightInput: string;
    private jumpInput: string;
    private scene: MainScene;
    private audioManager: AudioManager;
    constructor(scene: MainScene) {
        this.initDefaultKeys();
        this.mappingKeys(scene);
        this.scene = scene;
        this.audioManager = this.scene.audioManager;
    }

    /**
     * Init the default control keys
     */
    private initDefaultKeys(): void {
        this.leftInput = 'left';
        this.rightInput = 'right';
        this.jumpInput = 'up';
    }

    /**
     * CHange the jump control key
     * @param value
     */
    public changeJumpKey(value: string): void {
        this.jumpInput = value;
    }

    /**
     * CHange the right control key
     * @param value
     */
    public changeRightKey(value: string): void {
        this.rightInput = value;
    }

    /**
     * CHange the left control key
     * @param value
     */
    public changeLeftKey(value: string): void {
        this.leftInput = value;
    }

    /**
     * Map the Keys to the events
     * @param scene
     */
    private mappingKeys(scene: Phaser.Scene): void {
        // Handle Keyboard Event
        this.cursors = scene.input.keyboard.addKeys(
            {
                escape: Phaser.Input.Keyboard.KeyCodes.ESC,
                up: this.jumpInput,
                down: "down",
                left: this.leftInput,
                right: this.rightInput,
            });
    }

    public handlePlayerControls(player: Player): void {
        let negativeforceVector: Vector2;
        let forceVector: Vector2;
        let body: any = player.getPlayerSprite().body;

        if (!player.isPlayerInTheAir()) {
            // Player is in the Air
            forceVector = new Vector2(0.1, 0);
            negativeforceVector = new Vector2(-0.1, 0);
            if (body.velocity.x >= 0.3) {
                player.getPlayerSprite().setVelocity(0.3);
            } else if (body.velocity.x <= -0.3) {
                player.getPlayerSprite().setVelocity(-0.3);
            }
        } else {
            //Player touch the ground
            negativeforceVector = new Vector2(-0.1, 0);
            forceVector = new Vector2(0.1, 0);
            if (body.velocity.x >= 0.1) {
                player.getPlayerSprite().setVelocityX(0.1);
            } else if (body.velocity.x <= -0.15) {
                player.getPlayerSprite().setVelocityX(-0.15);
            }
        }
        if (this.cursors.right.isDown) {
            if (player.anims.currentAnim !== null && player.anims.currentAnim.key === 'playerJump') {
            } else {
                player.anims.play('playerRun', true);
            }

            player.getPlayerSprite().setFlipX(false);
            player.getPlayerSprite().applyForce(forceVector);
        } else if (this.cursors.left.isDown) {
            if (player.anims.currentAnim !== null && player.anims.currentAnim.key === 'playerJump') {
            } else {
                player.anims.play('playerRun', true);
                //this.audioManager.playSound(this.audioManager.soundsList.PLAYER_FOOTSTEP);
            }
            player.getPlayerSprite().setFlipX(true);
            player.getPlayerSprite().applyForce(negativeforceVector);
        } else {
            if (player.anims.currentAnim !== null && player.anims.currentAnim.key === 'playerJump') {

            } else {
                player.anims.play('playerIdle', true);
            }
            player.getPlayerSprite().setVelocityX(0);
        }
        if (this.cursors.up.isDown && player.getCanJump() && !player.isPlayerInTheAir()) {
            player.anims.play('playerJump', true);
            //this.audioManager.playSound(this.audioManager.soundsList.PLAYER_JUMP);
            player.desactivateJump();
            player.getPlayerSprite().setVelocityY(-11);
        }
    }
}