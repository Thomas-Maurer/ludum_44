import Player from "../Player";
import EventUtils from "../../utils/events.utils";
import Vector2 = Phaser.Math.Vector2;

export class PlayerControls {
    private cursors: any;
    private leftInput: string;
    private rightInput: string;
    private jumpInput: string;
    constructor(scene: Phaser.Scene) {
        this.initDefaultKeys();
        this.mappingKeys(scene);
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
            player.getPlayerSprite().setFlipX(true);
            player.getPlayerSprite().applyForce(forceVector);
        } else if (this.cursors.left.isDown) {
            player.getPlayerSprite().setFlipX(false);
            player.getPlayerSprite().applyForce(negativeforceVector);
        } else {
            player.getPlayerSprite().setVelocityX(0);
        }
        if (this.cursors.up.isDown && player.getCanJump() && !player.isPlayerInTheAir()) {
            window.dispatchEvent(EventUtils.PLAYER_JUMP);
            player.desactivateJump();
            player.getPlayerSprite().setVelocityY(-11);
        }
    }

}